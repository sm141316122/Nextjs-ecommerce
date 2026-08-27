"use server";

import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { insertProductSchema, updateProductSchema } from "../validators";
import z from "zod";

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
}: {
	limit?: number;
	page: number;
	query: string;
	category?: string;
}) {
	const allProducts = await prisma.product.findMany({
		orderBy: { createdAt: "desc" },
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
