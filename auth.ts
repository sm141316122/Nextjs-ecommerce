import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db/prisma";
import { compareSync } from "bcrypt-ts-edge";

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
		async session({ session, user, trigger, token }: any) {
			session.user.id = token.sub;

			if (trigger === "update") {
				session.user.name = user.name;
			}

			return session;
		},
	},
});
