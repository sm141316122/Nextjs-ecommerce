import OrdersTable from "./orders-table";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "My Orders",
};

export default async function OrdersPage({
	searchParams,
}: {
	searchParams: Promise<{ page: string }>;
}) {
	const { page } = await searchParams;

	return (
		<div className="space-y-4">
			<h2 className="h2-bold">Orders</h2>
			<OrdersTable page={page} />
		</div>
	);
}
