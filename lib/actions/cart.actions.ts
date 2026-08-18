"use server";

import { cookies } from "next/headers";
import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "../generated/prisma/client";

// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
	const itemsPrice = round(
			items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
		),
		shippingPrice = round(itemsPrice > 100 ? 0 : 10),
		taxPrice = round(0.15 * itemsPrice),
		totalPrice = round(itemsPrice + shippingPrice + taxPrice);

	return {
		itemsPrice: itemsPrice.toFixed(0),
		totalPrice: totalPrice.toFixed(0),
		shippingPrice: shippingPrice.toFixed(0),
		taxPrice: taxPrice.toFixed(0),
	};
};

export async function addCartItem(data: CartItem) {
	try {
		const sessionCartId = (await cookies()).get("sessionCartId")?.value;
		if (!sessionCartId) throw new Error("Cart session not found");

		const session = await auth();
		const userId = session?.user?.id ? (session.user.id as string) : undefined;

		const cart = await getMyCart();

		const item = cartItemSchema.parse(data);

		const product = await prisma.product.findFirst({
			where: { id: item.productId },
		});

		if (!product) {
			throw new Error("Product not found");
		}

		if (!cart) {
			const newCart = insertCartSchema.parse({
				userId: userId,
				sessionCartId: sessionCartId,
				items: [item],
				...calcPrice([item]),
			});

			await prisma.cart.create({
				data: {
					...newCart,
					itemsPrice: Number(newCart.itemsPrice),
					shippingPrice: Number(newCart.shippingPrice),
					taxPrice: Number(newCart.taxPrice),
					totalPrice: Number(newCart.totalPrice),
				},
			});

			revalidatePath(`/product/${product.slug}`);

			return {
				success: true,
				message: `${product.name} added to cart`,
			};
		} else {
			// Check if item is already in cart
			const existItem = cart.items.find(
				(cartItem) => cartItem.productId === item.productId,
			);

			if (existItem) {
				if (product.stock < existItem.qty + 1) {
					throw new Error("Not enough stock");
				}

				cart.items.find(
					(cartItem) => cartItem.productId === item.productId,
				)!.qty = existItem.qty + 1;
			} else {
				if (product.stock < 1) {
					throw new Error("Not enough stock");
				}

				cart.items.push(item);
			}

			const cartItemsCalcPrice = {
				...calcPrice(cart.items),
				itemsPrice: Number(calcPrice(cart.items).itemsPrice),
				shippingPrice: Number(calcPrice(cart.items).shippingPrice),
				taxPrice: Number(calcPrice(cart.items).taxPrice),
				totalPrice: Number(calcPrice(cart.items).totalPrice),
			};

			await prisma.cart.update({
				where: { id: cart.id },
				data: {
					items: cart.items,
					...cartItemsCalcPrice,
				},
			});

			revalidatePath(`/product/${product.slug}`);

			return {
				success: true,
				message: `${product.name} ${existItem ? "updated in" : "added to"} cart`,
			};
		}
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

export async function getMyCart() {
	const sessionCartId = (await cookies()).get("sessionCartId")?.value;
	if (!sessionCartId) throw new Error("Cart session not found");

	const session = await auth();
	const userId = session?.user?.id ? (session.user.id as string) : undefined;

	// Get user cart from database
	const cart = await prisma.cart.findFirst({
		where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
	});

	if (!cart) return undefined;

	return convertToPlainObject({
		...cart,
		items: cart.items as CartItem[],
		itemsPrice: cart.itemsPrice.toString(),
		totalPrice: cart.totalPrice.toString(),
		shippingPrice: cart.shippingPrice.toString(),
		taxPrice: cart.taxPrice.toString(),
	});
}

export async function removeItemFromCart(productId: string) {
	try {
		const sessionCartId = (await cookies()).get("sessionCartId")?.value;
		if (!sessionCartId) throw new Error("Cart session not found");

		const product = await prisma.product.findFirst({
			where: { id: productId },
		});
		if (!product) throw new Error("Product not found");

		const cart = await getMyCart();
		if (!cart) throw new Error("Cart not found");

		const exist = (cart.items as CartItem[]).find(
			(i) => i.productId === productId,
		);
		if (!exist) throw new Error("Item not found");

		if (exist.qty === 1) {
			cart.items = (cart.items as CartItem[]).filter(
				(i) => i.productId !== productId,
			);
		} else {
			cart.items = (cart.items as CartItem[]).map((i) => {
				if (i.productId === productId) i.qty--;

				return i;
			});
		}

		const cartItemsCalcPrice = {
			...calcPrice(cart.items),
			itemsPrice: Number(calcPrice(cart.items).itemsPrice),
			shippingPrice: Number(calcPrice(cart.items).shippingPrice),
			taxPrice: Number(calcPrice(cart.items).taxPrice),
			totalPrice: Number(calcPrice(cart.items).totalPrice),
		};

		await prisma.cart.update({
			where: { id: cart.id },
			data: {
				items: cart.items as Prisma.CartUpdateitemsInput[],
				...cartItemsCalcPrice,
			},
		});

		revalidatePath(`/product/${product.slug}`);

		return {
			success: true,
			message: `${product.name} was remove from cart`,
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}
