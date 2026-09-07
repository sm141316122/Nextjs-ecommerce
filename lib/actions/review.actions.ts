"use server";

import z from "zod";
import { insertReviewsSchema } from "../validators";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { tr } from "zod/v4/locales";

export async function createUpdateReview(
	data: z.infer<typeof insertReviewsSchema>,
) {
	try {
		const session = await auth();
		if (!session) throw new Error("User is not authorized");

		const review = insertReviewsSchema.parse({
			...data,
			userId: session?.user?.id,
		});

		const product = await prisma.product.findFirst({
			where: { id: review.productId },
		});
		if (!product) throw new Error("Product not found");

		const reviewExists = await prisma.review.findFirst({
			where: {
				productId: review.productId,
				userId: review.userId,
			},
		});

		await prisma.$transaction(async (tx) => {
			if (reviewExists) {
				await tx.review.update({
					where: { id: reviewExists.id },
					data: {
						title: review.title,
						description: review.description,
						rating: review.rating,
					},
				});
			} else {
				await tx.review.create({
					data: review,
				});
			}

			const avgRating = await tx.review.aggregate({
				where: { productId: review.productId },
				_avg: { rating: true },
			});

			const numReviews = await tx.review.count({
				where: { productId: review.productId },
			});

			await tx.product.update({
				where: { id: review.productId },
				data: {
					rating: avgRating._avg.rating || 0,
					numReviews,
				},
			});
		});

		revalidatePath(`/product/${product.slug}`);

		return { success: true, message: "Review Updated Successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}

export async function getAllReviews(productId: string) {
	const reviews = await prisma.review.findMany({
		where: { productId },
		include: {
			user: {
				select: {
					name: true,
				},
			},
		},
		orderBy: { createdAt: "desc" },
	});

	return reviews;
}

export async function getCurrentUserReviewByProuctId(productId: string) {
	const session = await auth();
	if (!session) throw new Error("User is not authenticated");

	const review = await prisma.review.findFirst({
		where: {
			productId,
			userId: session?.user?.id,
		},
	});

	return review;
}
