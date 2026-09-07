"use client";

import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { reviewFormDefaultValues } from "@/lib/constants";
import { insertReviewsSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { StarIcon } from "lucide-react";
import { createUpdateReview } from "@/lib/actions/review.actions";
import { toast } from "@/components/ui/toast";
import { Review } from "@/types";

export default function ReviewForm({
	userId,
	productId,
	onReviewSubmitted,
	currentUserReview,
}: {
	userId: string;
	productId: string;
	onReviewSubmitted: () => void;
	currentUserReview: Review | null;
}) {
	const [open, setOpen] = useState(false);

	const form = useForm<
		z.input<typeof insertReviewsSchema>,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		any,
		z.output<typeof insertReviewsSchema>
	>({
		resolver: zodResolver(insertReviewsSchema),
		defaultValues: reviewFormDefaultValues,
	});

	const handleSubmit: SubmitHandler<
		z.infer<typeof insertReviewsSchema>
	> = async (values) => {
		console.log("submitting");
		const res = await createUpdateReview({ ...values, productId });

		if (!res.success) {
			toast.add({
				type: "error",
				description: res.message,
			});

			return;
		}

		setOpen(false);

		onReviewSubmitted();

		toast.add({
			description: res.message,
		});
	};

	const handleOpenForm = () => {
		form.setValue("productId", productId);
		form.setValue("userId", userId);

		if (currentUserReview) {
			form.setValue("title", currentUserReview.title);
			form.setValue("description", currentUserReview.description);
			form.setValue("rating", currentUserReview.rating);
		}

		setOpen(true);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Button onClick={handleOpenForm}>
				{currentUserReview ? "Edit" : "Write a"} review
			</Button>
			<DialogContent className="sm:max-w-[425px]">
				<form id="review-form" onSubmit={form.handleSubmit(handleSubmit)}>
					<DialogHeader>
						<DialogTitle>
							{currentUserReview ? "Edit" : "Write a"} review
						</DialogTitle>
						<DialogDescription>
							Share your thoughts with other customers
						</DialogDescription>
					</DialogHeader>
					<FieldGroup className="grid gap-4 py-4">
						<Controller
							name="title"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Title</FieldLabel>
									<Input
										{...field}
										aria-invalid={fieldState.invalid}
										placeholder="Enter title"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="description"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Description</FieldLabel>
									<Textarea
										{...field}
										aria-invalid={fieldState.invalid}
										placeholder="Enter description"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="rating"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Rating</FieldLabel>
									<Select
										{...field}
										name={field.name}
										value={field.value ? field.value.toString() : ""}
										onValueChange={field.onChange}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select a rating" />
										</SelectTrigger>
										<SelectContent alignItemWithTrigger={false}>
											{Array.from({ length: 5 }).map((_, index) => (
												<SelectItem key={index} value={(index + 1).toString()}>
													{index + 1}
													{""}
													<StarIcon className="inline w-4 h-4" />
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
				<DialogFooter>
					<DialogClose render={<Button variant="outline">Cancel</Button>} />
					<Button
						form="review-form"
						type="submit"
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting ? "Submitting..." : "Submit"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
