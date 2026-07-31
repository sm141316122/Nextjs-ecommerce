"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signUpDefaltValues } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { signUpUser } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";

export default function SignUpForm() {
	const [data, action, pending] = useActionState(signUpUser, {
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
					<Label htmlFor="name">Name</Label>
					<Input
						id="name"
						name="name"
						type="text"
						autoComplete="name"
						defaultValue={signUpDefaltValues.name}
					/>
				</div>
				<div>
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="text"
						autoComplete="email"
						defaultValue={signUpDefaltValues.email}
					/>
				</div>
				<div>
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						required
						autoComplete="password"
						defaultValue={signUpDefaltValues.password}
					/>
				</div>
				<div>
					<Label htmlFor="confirmPassword">Confirm Password</Label>
					<Input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						required
						autoComplete="confirmPassword"
						defaultValue={signUpDefaltValues.confirmPassword}
					/>
				</div>
				<div>
					<Button
						disabled={pending}
						className="w-full cursor-pointer"
						variant="default"
						type="submit"
					>
						{pending ? "Submitting" : "Sign Up"}
					</Button>
				</div>

				{data && !data.success && (
					<div className="text-center text-destructive whitespace-pre-line">
						{data.message}
					</div>
				)}

				<div className="text-sm text-center text-muted-foreground">
					Already have an account?{" "}
					<Link href="./sign-in" target="_self" className="link">
						Sign In
					</Link>
				</div>
			</div>
		</form>
	);
}
