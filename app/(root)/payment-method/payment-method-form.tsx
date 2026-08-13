"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { toast } from "@/components/ui/toast";
import { paymentMethodSchema } from "@/lib/validators";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";

export default function PaymentMethodForm({
	preferredPaymentMethod,
}: {
	preferredPaymentMethod: string | null;
}) {
	const router = useRouter();

	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof paymentMethodSchema>>({
		resolver: zodResolver(paymentMethodSchema),
		defaultValues: {
			type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
		},
	});

	const onSubmit: SubmitHandler<z.infer<typeof paymentMethodSchema>> = async (
		values,
	) => {
		startTransition(async () => {
			const res = await updateUserPaymentMethod(values);

			if (!res.success) {
				toast.add({
					type: "error",
					description: res.message,
				});
				return;
			}

			router.push("/place-order");
		});
	};

	return (
		<>
			<div className="max-w-md mx-auto space-y-4">
				<h1 className="h2-bold mt-4">Payment Method</h1>
				<p className="text-sm text-mutd-foreground">
					Please select a payment method
				</p>
				<form id="payment-method-form" onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<div className="flex flex-col md:flex-row gap-5">
							<Controller
								name="type"
								control={form.control}
								render={({ field, fieldState }) => (
									<FieldSet data-invalid={fieldState.invalid}>
										<RadioGroup
											name={field.name}
											value={field.value}
											onValueChange={field.onChange}
											aria-invalid={fieldState.invalid}
											className="flex flex-col space-y-2"
										>
											{PAYMENT_METHODS.map((method) => (
												<div
													key={method}
													className="flex items-center space-x-3 space-y-0"
												>
													<RadioGroupItem
														value={method}
														id={`payment-method-form-${method}`}
														aria-invalid={fieldState.invalid}
													/>
													<FieldLabel htmlFor={`payment-method-form-${method}`}>
														{method}
													</FieldLabel>
												</div>
											))}
										</RadioGroup>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</FieldSet>
								)}
							/>
						</div>
					</FieldGroup>
				</form>
				<div className="flex gap-2">
					<Button form="payment-method-form" type="submit" disabled={isPending}>
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
