import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	CardContent,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { auth } from "@/auth";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
	title: "Sign In",
};

export default async function SingUpPage({
	searchParams,
}: {
	searchParams: Promise<{ callbackUrl: string }>;
}) {
	const { callbackUrl } = await searchParams;

	const session = await auth();

	if (session) {
		redirect(callbackUrl || "/");
	}

	return (
		<div className="w-full max-w-md mx-auto">
			<Card>
				<CardHeader className="space-y-4">
					<Link href="/" className="flex-center">
						<Image
							src="/images/logo.svg"
							width={100}
							height={100}
							alt={`${APP_NAME} logo`}
							priority
							loading="eager"
						/>
					</Link>
					<CardTitle className="text-center">Create Account</CardTitle>
					<CardDescription className="text-center">
						Enter your information below to sign up
					</CardDescription>
					<CardContent className="space-y-4">
						<SignUpForm />
					</CardContent>
				</CardHeader>
			</Card>
		</div>
	);
}
