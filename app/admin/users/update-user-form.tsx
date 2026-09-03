"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { updateUser } from "@/lib/actions/user.actions";
import { USER_ROLES } from "@/lib/constants";
import { updateUserSchema } from "@/lib/validators";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

export default function UpdateUserForm({
	user,
}: {
	user: z.infer<typeof updateUserSchema>;
}) {
	const router = useRouter();

	const form = useForm<z.infer<typeof updateUserSchema>>({
		resolver: zodResolver(updateUserSchema),
		defaultValues: user,
	});

	const onSubmit: SubmitHandler<z.infer<typeof updateUserSchema>> = async (
		values,
	) => {
		const res = await updateUser(values);

		if (!res.success) {
			toast.add({
				type: "error",
				description: res.message,
			});

			return;
		}

		router.push("/admin/users");
	};

	return (
		<form id="update-user-form" onSubmit={form.handleSubmit(onSubmit)}>
			<FieldGroup>
				<Controller
					name="email"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel>Email</FieldLabel>
							<Input {...field} disabled placeholder="Enter user email" />
						</Field>
					)}
				/>

				<Controller
					name="name"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel>Name</FieldLabel>
							<Input {...field} placeholder="Enter user name" />
						</Field>
					)}
				/>

				<Controller
					name="role"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel>Role</FieldLabel>
							<Select
								name={field.name}
								value={field.value}
								onValueChange={field.onChange}
							>
								<SelectTrigger aria-invalid={fieldState.invalid}>
									<SelectValue placeholder="Select" />
								</SelectTrigger>
								<SelectContent alignItemWithTrigger={false}>
									{USER_ROLES.map((role) => (
										<SelectItem key={role} value={role}>
											{role.charAt(0).toUpperCase() + role.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
					)}
				/>
			</FieldGroup>
			<div className="flex-between mt-4">
				<Button
					type="submit"
					className="w-full"
					disabled={form.formState.isSubmitting}
				>
					{form.formState.isSubmitting ? "Submitting..." : "Update User"}
				</Button>
			</div>
		</form>
	);
}
