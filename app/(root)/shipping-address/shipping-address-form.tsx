"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/toast";
import { ShippingAddress } from "@/types";
import { shippingAddressSchema } from "@/lib/validators";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { ArrowRight, Loader } from "lucide-react";
import { updateUserAddress } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

export default function ShippingAddressForm({
	address,
}: {
	address: ShippingAddress;
}) {
	const router = useRouter();

	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof shippingAddressSchema>>({
		resolver: zodResolver(shippingAddressSchema),
		defaultValues: address || shippingAddressDefaultValues,
	});

	const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
		values,
	) => {
		startTransition(async () => {
			const res = await updateUserAddress(values);

			if (!res.success) {
				toast.add({
					type: "error",
					description: res.message,
				});
				return;
			}

			router.push("/payment-method");
		});
	};

	return (
		<>
			<div className="max-w-md mx-auto space-y-4">
				<h1 className="h2-bold mt-4">Shipping Address</h1>
				<p className="text-sm text-mutd-foreground">
					Please enter and address to ship to
				</p>
				<form id="shipping-address-form" onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<div className="flex flex-col md:flex-row gap-5">
							<Controller
								name="fullName"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid} className="w-full">
										<FieldLabel>Full Name</FieldLabel>
										<Input
											{...field}
											aria-invalid={fieldState.invalid}
											placeholder="Enter full name"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>
						<div className="flex flex-col md:flex-row gap-5">
							<Controller
								name="streetAddress"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid} className="w-full">
										<FieldLabel>Address</FieldLabel>
										<Input
											{...field}
											aria-invalid={fieldState.invalid}
											placeholder="Enter address..."
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>
						<div className="flex flex-col md:flex-row gap-5">
							<Controller
								name="city"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid} className="w-full">
										<FieldLabel>City</FieldLabel>
										<Input
											{...field}
											aria-invalid={fieldState.invalid}
											placeholder="Enter city"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>
						<div className="flex flex-col md:flex-row gap-5">
							<Controller
								name="postalCode"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid} className="w-full">
										<FieldLabel>Postal Code</FieldLabel>
										<Input
											{...field}
											aria-invalid={fieldState.invalid}
											placeholder="Enter postal code"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>
						<div className="flex flex-col md:flex-row gap-5">
							<Controller
								name="country"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid} className="w-full">
										<FieldLabel>Country</FieldLabel>
										<Input
											{...field}
											aria-invalid={fieldState.invalid}
											placeholder="Enter country"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>
					</FieldGroup>
				</form>
				<div className="flex gap-2">
					<Button
						form="shipping-address-form"
						type="submit"
						disabled={isPending}
					>
						{isPending ? (
							<Loader className="w-4 h-4" />
						) : (
							<ArrowRight className="w-4 h-4" />
						)}{" "}
						Continue
					</Button>
				</div>
			</div>
		</>
	);
}
