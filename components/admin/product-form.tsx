"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { productDefaultValues } from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Controller,
	Resolver,
	SubmitHandler,
	useForm,
	useWatch,
} from "react-hook-form";
import z from "zod";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { toast } from "../ui/toast";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../ui/card";
import { UploadButton } from "@/lib/uploadthing";
import { twMerge } from "tailwind-merge";
import { Checkbox } from "../ui/checkbox";

export default function ProductForm({
	type,
	product,
	productId,
}: {
	type: "Create" | "Update";
	product?: Product;
	productId?: string;
}) {
	const router = useRouter();

	const schemaToUse =
		type === "Update" ? updateProductSchema : insertProductSchema;

	const defaultValues =
		product && type === "Update" ? product : productDefaultValues;

	const form = useForm<z.infer<typeof schemaToUse>>({
		resolver: zodResolver(schemaToUse) as Resolver<z.infer<typeof schemaToUse>>,
		defaultValues: defaultValues,
	});

	const onSubmit: SubmitHandler<z.infer<typeof schemaToUse>> = async (
		values,
	) => {
		if (type === "Create") {
			const res = await createProduct(values);

			if (!res.success) {
				toast.add({
					type: "error",
					description: res.message,
				});

				return;
			}

			router.push("/admin/products");
		}

		if (type === "Update") {
			if (!productId) {
				router.push("/admin/products/");

				return;
			}

			const res = await updateProduct({ ...values, id: productId });

			if (!res.success) {
				toast.add({
					type: "error",
					description: res.message,
				});

				return;
			}

			router.push("/admin/products");
		}
	};

	const images = useWatch({
		control: form.control,
		name: "images",
	});

	const isFeatured = useWatch({
		control: form.control,
		name: "isFeatured",
	});

	const banner = useWatch({
		control: form.control,
		name: "banner",
	});

	return (
		<form id="product-form" onSubmit={form.handleSubmit(onSubmit)}>
			<FieldGroup>
				<div className="flex flex-col md:flex-row gap-4">
					<Controller
						name="name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-ivalid={fieldState.invalid}>
								<FieldLabel>Name</FieldLabel>
								<Input
									{...field}
									aria-invalid={fieldState.invalid}
									placeholder="Enter product name"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="slug"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-ivalid={fieldState.invalid}>
								<FieldLabel>Slug</FieldLabel>
								<div className="relative">
									<Input
										{...field}
										aria-invalid={fieldState.invalid}
										placeholder="Enter slug"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
									<Button
										type="button"
										className="bg-gray-500 hover: bg-gray-600 text-white px-4 py-1 mt-2"
										onClick={() =>
											form.setValue(
												"slug",
												slugify(form.getValues("name"), { lower: true }),
											)
										}
									>
										Generate
									</Button>
								</div>
							</Field>
						)}
					/>
				</div>

				<div className="flex flex-col md:flex-row gap-4">
					<Controller
						name="category"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-ivalid={fieldState.invalid}>
								<FieldLabel>Category</FieldLabel>
								<Input
									{...field}
									aria-invalid={fieldState.invalid}
									placeholder="Enter category"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="brand"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-ivalid={fieldState.invalid}>
								<FieldLabel>Brand</FieldLabel>
								<Input
									{...field}
									aria-invalid={fieldState.invalid}
									placeholder="Enter brand"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</div>

				<div className="flex flex-col md:flex-row gap-4">
					<Controller
						name="price"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-ivalid={fieldState.invalid}>
								<FieldLabel>Price</FieldLabel>
								<Input
									{...field}
									aria-invalid={fieldState.invalid}
									placeholder="Enter price"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="stock"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-ivalid={fieldState.invalid}>
								<FieldLabel>Stock</FieldLabel>
								<Input
									{...field}
									aria-invalid={fieldState.invalid}
									placeholder="Enter stock"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</div>

				<Controller
					name="images"
					control={form.control}
					render={() => (
						<Field>
							<FieldLabel>Images</FieldLabel>
							<Card>
								<CardContent className="space-y-2 mt-2 min-h-48">
									<div className="flex-start space-x-2">
										{images.map((image: string) => (
											<Image
												key={image}
												src={image}
												alt="porduct image"
												className="w-20 h-20 object-cover object-center rounded-sm"
												width={100}
												height={100}
											/>
										))}
										<UploadButton
											endpoint="imageUploader"
											onClientUploadComplete={(res) => {
												form.setValue("images", [...images, res[0].ufsUrl]);
											}}
											onUploadError={(error) => {
												toast.add({
													type: "destructive",
													description: `ERROR! ${error.message}`,
												});
											}}
											className="ut-button:p-1"
											config={{ cn: twMerge }}
										/>
									</div>
								</CardContent>
							</Card>
						</Field>
					)}
				/>

				<Controller
					name="isFeatured"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-ivalid={fieldState.invalid}>
							<FieldLabel>Featured Product</FieldLabel>
							<Card>
								<CardContent>
									<div className="space-x-2 flex items-center">
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
										<FieldLabel className="">Is Featured?</FieldLabel>
										{isFeatured && !banner && (
											<UploadButton
												endpoint="imageUploader"
												onClientUploadComplete={(res) => {
													form.setValue("banner", res[0].ufsUrl);
												}}
												onUploadError={(error) => {
													toast.add({
														type: "destructive",
														description: `ERROR! ${error.message}`,
													});
												}}
												className="ut-button:p-1"
												config={{ cn: twMerge }}
											/>
										)}
									</div>
									{isFeatured && banner && (
										<Image
											src={banner}
											alt="banner image"
											className="w-full object-cover object-center rounded-sm"
											width={1920}
											height={680}
										/>
									)}
								</CardContent>
							</Card>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name="description"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-ivalid={fieldState.invalid}>
							<FieldLabel>Description</FieldLabel>
							<Textarea
								{...field}
								aria-invalid={fieldState.invalid}
								placeholder="Enter product description"
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</FieldGroup>
			<div>
				<Button
					type="submit"
					size="lg"
					disabled={form.formState.isSubmitting}
					className="button col-span-2 w-full mt-4"
				>
					{form.formState.isSubmitting ? "Submitting..." : `${type} Product`}
				</Button>
			</div>
		</form>
	);
}
