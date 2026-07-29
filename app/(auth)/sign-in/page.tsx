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
import CredentialsSignForm from "./credentials-sign-form";
import { auth } from "@/auth";

export const metadata: Metadata = {
	title: "Sign In",
};

export default async function SingInPage({
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
						/>
					</Link>
					<CardTitle className="text-center">Sign In</CardTitle>
					<CardDescription className="text-center">
						Sign in yo your account
					</CardDescription>
					<CardContent className="space-y-4">
						<CredentialsSignForm />
					</CardContent>
				</CardHeader>
			</Card>
		</div>
	);
}
