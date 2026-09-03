"use server";

import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { insertProductSchema, updateProductSchema } from "../validators";
import z from "zod";
import { Prisma } from "../generated/prisma/client";

export async function getLatestProducts() {
	const data = await prisma.product.findMany({
		take: LATEST_PRODUCTS_LIMIT,
		orderBy: { createdAt: "desc" },
	});

	return convertToPlainObject(data);
}

export async function getProductBySlug(slug: string) {
	return await prisma.product.findFirst({
		where: { slug: slug },
	});
}

export async function getProductById(id: string) {
	const data = await prisma.product.findFirst({
		where: { id: id },
	});

	return convertToPlainObject(data);
}

export async function getAllProducts({
	limit = PAGE_SIZE,
	page,
	query,
	category,
	price,
	rating,
	sort,
}: {
	limit?: number;
	page: number;
	query: string;
	category?: string;
	price?: string;
	rating?: string;
	sort?: string;
}) {
	const queryFilter: Prisma.ProductWhereInput =
		query && query !== "all"
			? {
					name: {
						contains: query,
						mode: "insensitive",
					} as Prisma.StringFilter,
				}
			: {};

	const categoryFilter: Prisma.ProductWhereInput =
		category && category !== "all"
			? {
					category,
				}
			: {};

	const priceFilter: Prisma.ProductWhereInput =
		price && price !== "all"
			? {
					price: {
						gte: Number(price.split("-")[0]),
						lte: Number(price.split("-")[1]),
					},
				}
			: {};

	const ratingFilter: Prisma.ProductWhereInput =
		rating && rating !== "all"
			? {
					rating: {
						gte: Number(rating),
					},
				}
			: {};
	let sortOrder: { [key: string]: string };
	if (sort === "newest" || sort === "") {
		sortOrder = { createdAt: "desc" };
	} else if (sort === "lowest") {
		sortOrder = { price: "asc" };
	} else if (sort === "highest") {
		sortOrder = { price: "desc" };
	} else if (sort === "rating") {
		sortOrder = { rating: "desc" };
	} else {
		sortOrder = { createdAt: "desc" };
	}

	const allProducts = await prisma.product.findMany({
		where: {
			...queryFilter,
			...categoryFilter,
			...priceFilter,
			...ratingFilter,
		},
		orderBy: sortOrder,
		take: limit,
		skip: (page - 1) * limit,
	});

	const dataCount = await prisma.product.count();

	return { allProducts, totalPage: Math.ceil(dataCount / limit) };
}

export async function deleteProduct(id: string) {
	try {
		const productExists = await prisma.product.findFirst({
			where: { id },
		});

		if (!productExists) throw new Error("Product not found");

		await prisma.product.delete({
			where: { id },
		});

		revalidatePath("/admin/products");

		return { success: true, message: "Product delete successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}

export async function createProduct(data: z.infer<typeof insertProductSchema>) {
	try {
		const product = insertProductSchema.parse(data);

		await prisma.product.create({
			data: {
				...product,
				price: Number(product.price),
				stock: Number(product.stock),
			},
		});

		revalidatePath("/admin/products");

		return { success: true, message: "Product created successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}

export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
	try {
		const product = updateProductSchema.parse(data);
		const productExits = await prisma.product.findFirst({
			where: { id: product.id },
		});

		if (!productExits) throw new Error("Product not found");

		await prisma.product.update({
			where: {
				id: product.id,
			},
			data: {
				...product,
				price: Number(product.price),
				stock: Number(product.stock),
			},
		});

		revalidatePath("/admin/products");

		return { success: true, message: "Product updated successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}

export async function getAllProductCategory() {
	const data = await prisma.product.groupBy({
		by: ["category"],
		_count: true,
	});

	return data;
}

export async function getFeaturedProducts() {
	const data = await prisma.product.findMany({
		where: { isFeatured: true },
		orderBy: { createdAt: "desc" },
		take: 4,
	});

	return convertToPlainObject(data);
}
