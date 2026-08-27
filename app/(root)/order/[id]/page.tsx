import { auth } from "@/auth";
import { getOrderById } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { ShippingAddress } from "@/types";
import { requireOwnerOrAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = {
	title: "Order Details",
};

export default async function OrderDetailsPage(props: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await props.params;

	const orderData = await getOrderById(id);
	if (!orderData) notFound();

	const session = await auth();
	if (!session) throw new Error("User not authorized");

	await requireOwnerOrAdmin(orderData.userId);

	return (
		<OrderDetailsTable
			order={{
				...orderData,
				shippingAddress: orderData.shippingAddress as ShippingAddress,
			}}
			isAdmin={session.user?.role === "admin"}
		/>
	);
}
