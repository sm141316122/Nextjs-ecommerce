import { auth } from "@/auth";
import { getOrderById } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import OrderDetailsTable from "../order-details-table";
import { ShippingAddress } from "@/types";

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

	if (
		orderData.userId !== session?.user?.id &&
		session?.user?.role !== "admin"
	) {
		return redirect("/unauthorized");
	}

	return (
		<OrderDetailsTable
			order={{
				...orderData,
				shippingAddress: orderData.shippingAddress as ShippingAddress,
			}}
		/>
	);
}
