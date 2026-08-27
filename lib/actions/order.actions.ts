"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getUserById } from "./user.actions";
import { getMyCart } from "./cart.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";

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
			itemsPrice: cart.itemsPrice,
			shippingPrice: cart.shippingPrice,
			taxPrice: cart.taxPrice,
			totalPrice: cart.totalPrice,
		});

		// Create a transaction to create order and order items in database
		const insertOrderId = await prisma.$transaction(async (tx) => {
			// Create order
			const insertOrder = await tx.order.create({
				data: {
					...order,
					itemsPrice: Number(order.itemsPrice),
					shippingPrice: Number(order.shippingPrice),
					taxPrice: Number(order.taxPrice),
					totalPrice: Number(order.totalPrice),
				},
			});
			// Create order items from tje cart items
			for (const item of cart.items as CartItem[]) {
				await tx.orderItem.create({
					data: {
						...item,
						orderId: insertOrder.id,
						price: Number(item.price),
					},
				});
			}

			// Clear cart
			await tx.cart.update({
				where: { id: cart.id },
				data: {
					items: [],
					itemsPrice: 0,
					shippingPrice: 0,
					taxPrice: 0,
					totalPrice: 0,
				},
			});

			return insertOrder.id;
		});

		if (!insertOrderId) throw new Error("Order not created");

		revalidatePath("/place-order");

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

export async function getOrderById(orderId: string) {
	const data = await prisma.order.findFirst({
		where: { id: orderId },
		include: {
			orderItems: true,
			user: { select: { name: true, email: true } },
		},
	});

	return convertToPlainObject(data);
}

export async function getMyOrders({
	limit = PAGE_SIZE,
	page,
}: {
	limit?: number;
	page: number;
}) {
	const session = await auth();
	if (!session) throw new Error("User not authorized");

	const userId = session?.user?.id;
	if (!userId) throw new Error("User not found");

	const orders = await prisma.order.findMany({
		where: { userId },
		orderBy: { createdAt: "desc" },
		take: limit,
		skip: (page - 1) * limit,
	});
	if (!orders) throw new Error("Orders not found");

	const dataCount = await prisma.order.count({
		where: { userId },
	});

	return { orders, totalPage: Math.ceil(dataCount / limit) };
}

export async function updateOrderToPaid(orderId: string) {
	const currentOrder = await prisma.order.findFirst({
		where: { id: orderId },
		include: { orderItems: true },
	});

	if (!currentOrder) throw new Error("Order not found");

	if (currentOrder.isPaid) throw new Error("Order is already paid");

	await prisma.$transaction(async (tx) => {
		for (const item of currentOrder.orderItems) {
			await tx.product.update({
				where: { id: item.productId },
				data: { stock: { increment: -item.qty } },
			});
		}

		await tx.order.update({
			where: { id: currentOrder.id },
			data: {
				isPaid: true,
				paidAt: new Date(),
			},
		});
	});
}

export async function getOrderSummary() {
	const ordersCount = await prisma.order.count();
	const productsCount = await prisma.product.count();
	const usersCount = await prisma.user.count();

	const totalSales = await prisma.order.aggregate({
		_sum: { totalPrice: true },
	});

	const salesDataRaw = await prisma.$queryRaw<
		Array<{ month: string; totalSales: bigint }>
	>`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

	const salesData = salesDataRaw.map((entry) => ({
		month: entry.month,
		totalSales: Number(entry.totalSales),
	}));

	const latestSales = await prisma.order.findMany({
		orderBy: { createdAt: "desc" },
		include: { user: { select: { name: true } } },
	});

	return {
		ordersCount,
		productsCount,
		usersCount,
		totalSales,
		salesData,
		latestSales,
	};
}

export async function getAllOrders({
	limit = PAGE_SIZE,
	page,
}: {
	limit?: number;
	page: number;
}) {
	const allOrders = await prisma.order.findMany({
		orderBy: { createdAt: "desc" },
		take: limit,
		skip: (page - 1) * limit,
		include: { user: { select: { name: true } } },
	});

	const dataCount = await prisma.order.count();

	return { allOrders, totalPage: Math.ceil(dataCount / limit) };
}

export async function deleteOrder(id: string) {
	try {
		await prisma.order.delete({
			where: { id },
		});

		revalidatePath("/admin/orders");

		return { success: true, message: "Order delete successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}

export async function updateOrderToPaidCOD(orderId: string) {
	try {
		await updateOrderToPaid(orderId);

		revalidatePath(`/order/${orderId}`);

		return { success: true, message: "Order marked as paid" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}

export async function deliverOrder(orderId: string) {
	try {
		const order = await prisma.order.findFirst({
			where: { id: orderId },
		});

		if (!order) throw new Error("Order not found");
		if (!order.isPaid) throw new Error("Order is not paid");

		await prisma.order.update({
			where: { id: order.id },
			data: {
				isDelivered: true,
				deliveredAt: new Date(),
			},
		});

		revalidatePath(`/order/${order.id}`);

		return { success: true, message: "Order has been marked delivered" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
