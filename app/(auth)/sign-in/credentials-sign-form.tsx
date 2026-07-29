"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signInDefaltValues } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";

export default function CredentialsSignForm() {
	const [data, action, pending] = useActionState(signInWithCredentials, {
		success: false,
		message: "",
	});

	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";

	return (
		<form action={action}>
			<input type="hidden" name={callbackUrl} value={callbackUrl} />
			<div className="space-y-6">
				<div>
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						required
						autoComplete="email"
						defaultValue={signInDefaltValues.email}
					/>
				</div>
				<div>
					<Label htmlFor="email">Password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						required
						autoComplete="password"
						defaultValue={signInDefaltValues.password}
					/>
				</div>
				<div>
					<Button
						disabled={pending}
						className="w-full cursor-pointer"
						variant="default"
						type="submit"
					>
						{pending ? "Signing in..." : "Sign In"}
					</Button>
				</div>

				{data && !data.success && (
					<div className="text-center text-destructive">{data.message}</div>
				)}

				<div className="text-sm text-center text-muted-foreground">
					Don&apos;t have an account?{" "}
					<Link href="./sign-up" target="_self" className="link">
						Sign Up
					</Link>
				</div>
			</div>
		</form>
	);
}
