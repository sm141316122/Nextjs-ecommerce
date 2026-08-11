import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db/prisma";
import { compareSync } from "bcrypt-ts-edge";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const { handlers, signIn, signOut, auth } = NextAuth({
	pages: {
		signIn: "/sign-in",
	},
	session: { strategy: "jwt", maxAge: 60 * 24 * 60 * 60 },
	adapter: PrismaAdapter(prisma),
	providers: [
		Credentials({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (credentials == null) return null;

				const user = await prisma.user.findFirst({
					where: {
						email: credentials.email as string,
					},
				});

				if (user && user.password) {
					const isMatch = compareSync(
						credentials.password as string,
						user.password,
					);

					if (isMatch) {
						return {
							id: user.id,
							name: user.name,
							email: user.email,
							role: user.role,
						};
					}
				}

				return null;
			},
		}),
	],
	callbacks: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		async session({ session, user, trigger, token }: any) {
			session.user.id = token.sub;
			session.user.role = token.role;
			session.user.name = token.name;

			if (trigger === "update") {
				session.user.name = user.name;
			}

			return session;
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		async jwt({ token, user, trigger, session }: any) {
			if (user) {
				token.id = user.id;
				token.role = user.role;

				if (user.name === "NO_NAME") {
					token.name = user.email!.split("@")[0];

					await prisma.user.update({
						where: { id: user.id },
						data: { name: token.name },
					});
				}

				if (trigger === "signIn" || "signUp") {
					const cookieObject = await cookies();
					const sessionCartId = cookieObject.get("sessionCartId")?.value;

					if (sessionCartId) {
						const sessionCart = await prisma.cart.findFirst({
							where: { sessionCartId },
						});

						if (sessionCart) {
							await prisma.cart.deleteMany({
								where: { userId: user.id },
							});

							await prisma.cart.update({
								where: { id: sessionCart.id },
								data: { userId: user.id },
							});
						}
					}
				}
			}

			if (session?.user.name && trigger === "update") {
				token.name = session.user.name;
			}

			return token;
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		authorized({ request, auth }: any) {
			// Array of regex patterns of paths we want to protect
			const protectPaths = [
				/\/shipping-address/,
				/\/payment-method/,
				/\/place-order/,
				/\/profile/,
				/\/user\/(.*)/,
				/\/order\/(.*)/,
				/\/admin/,
			];

			// Get pathname from the regex URL object
			const { pathname } = request.nextUrl;

			// Check if user is not authenticated an accessing a protected path
			if (!auth && protectPaths.some((p) => p.test(pathname))) return false;

			// Check for session cart cookie
			if (!request.cookies.get("sessionCartId")) {
				// Generate new session cart id cookie
				const sessionCartId = crypto.randomUUID();

				// Clone the req headers
				const newRequestHeaders = new Headers(request.headers);

				// Creater new response and add the new headers
				const response = NextResponse.next({
					request: {
						headers: newRequestHeaders,
					},
				});

				// set newly generated sessionCartId in the respones cookies
				response.cookies.set("sessionCartId", sessionCartId);

				return response;
			} else {
				return true;
			}
		},
	},
} satisfies NextAuthConfig);
