"use client";

import { useSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updataProfileSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/lib/actions/user.actions";
import { toast } from "@/components/ui/toast";

export default function ProfileForm() {
	const { update, data: session } = useSession();

	const form = useForm<z.infer<typeof updataProfileSchema>>({
		resolver: zodResolver(updataProfileSchema),
		defaultValues: {
			email: session?.user?.email ?? "",
			name: session?.user?.name ?? "",
		},
	});

	const handleSubmit = async (data: z.infer<typeof updataProfileSchema>) => {
		const res = await updateProfile(data);

		if (!res.success) {
			toast.add({
				type: "error",
				description: res.message,
			});

			return;
		}

		const newSession = {
			...session,
			user: {
				...session?.user,
				name: data.name,
			},
		};

		await update(newSession);

		toast.add({ type: "success", description: res.message });
	};

	return (
		<form
			id="update-profile-form"
			className="flex flex-col gap-5"
			onSubmit={form.handleSubmit(handleSubmit)}
		>
			<div className="flex flex-col gap-5">
				<Controller
					name="email"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<Input {...field} disabled placeholder="Email" />
						</Field>
					)}
				/>
				<Controller
					name="name"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<Input {...field} placeholder="Name" />
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</div>
			<Button
				type="submit"
				size="lg"
				className="button col-span-2 w-full"
				disabled={form.formState.isSubmitting}
			>
				{form.formState.isSubmitting ? "Submitting..." : "Update Profile"}
			</Button>
		</form>
	);
}
