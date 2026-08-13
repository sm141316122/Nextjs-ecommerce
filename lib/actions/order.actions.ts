"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { getUserById } from "./user.actions";
import { getMyCart } from "./cart.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { success } from "zod";
import { redirect } from "next/dist/server/api-utils";

export async function createOrder() {
	try {
		const session = await auth();
		if (!session) throw new Error("User is not authenticated");

		const cart = await getMyCart();

		const userId = session?.user?.id;
		if (!userId) throw new Error("User is not found");

		const user = await getUserById(userId);

		if (!cart || cart.items.length === 0) {
			return {
				success: false,
				message: "Your cart is empty",
				redirectTo: "/cart",
			};
		}

		if (!user.address) {
			return {
				success: false,
				message: "No shipping adress",
				redirectTo: "/shipping-address",
			};
		}

		if (!user.paymentMethod) {
			return {
				success: false,
				message: "No payment method",
				redirectTo: "/payment-method",
			};
		}

		const order = insertOrderSchema.parse({
			userId: user.id,
			shippingAddress: user.address,
			paymentMethod: user.paymentMethod,
			itemsPrice: cart.itemPrice,
			shippingPrice: cart.shippingPrice,
			taxPrice: cart.taxPrice,
			totalPrice: cart.totalPrice,
		});

		// Create a transaction to create order and order items in database
		const insertOrderId = await prisma.$transaction(async (tx) => {
			// Create order
			const insertOrder = await tx.order.create({ data: order });
			// Create order items from tje cart items
			for (const item of cart.items as CartItem[]) {
				await tx.orderItem.create({
					data: {
						...item,
						orderId: insertOrder.id,
					},
				});
			}

			// Clear cart
			await tx.cart.update({
				where: { id: cart.id },
				data: {
					items: [],
					itemPrice: 0,
					shippingPrice: 0,
					taxPrice: 0,
					totalPrice: 0,
				},
			});

			return insertOrder.id;
		});

		if (!insertOrderId) throw new Error("Order not created");

		return {
			success: true,
			messga: "Order created",
			redirectTo: `/order/${insertOrderId}`,
		};
	} catch (error) {
		if (isRedirectError(error)) throw error;

		return { success: false, message: formatError(error) };
	}
}
