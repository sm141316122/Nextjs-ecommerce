import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db/prisma";
import { compareSync } from "bcrypt-ts-edge";
import { NextResponse } from "next/server";

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
				token.role = user.role;

				if (user.name === "NO_NAME") {
					token.name = user.email!.split("@")[0];

					await prisma.user.update({
						where: { id: user.id },
						data: { name: token.name },
					});
				}
			}

			return token;
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		authorized({ request, auth }: any) {
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
