import Link from "next/link";
import { Metadata } from "next";
import Pagination from "@/components/shared/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getAllOrders } from "@/lib/actions/order.actions";
import { requiredAdmin } from "@/lib/auth-guard";
import { formatDateTime, formatId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import OrderDeleteDialog from "./order-delete-dialog";

export const metadata: Metadata = {
	title: "Admin Orders",
};

export default async function AdminOrdersPage({
	searchParams,
}: {
	searchParams: Promise<{ page: string }>;
}) {
	await requiredAdmin();

	const { page } = await searchParams;

	const { allOrders, totalPage } = await getAllOrders({
		page: Number(page) || 1,
	});

	return (
		<div className="space-y-4">
			<h2 className="h2-bold">Orders</h2>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>DATE</TableHead>
						<TableHead>TOTAL</TableHead>
						<TableHead>PAID</TableHead>
						<TableHead>DELIVERED</TableHead>
						<TableHead>ACTIONS</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{allOrders.map((order) => (
						<TableRow key={order.id}>
							<TableCell>{formatId(order.id)}</TableCell>
							<TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
							<TableCell>${order.totalPrice}</TableCell>
							<TableCell>
								{order.isPaid && order.paidAt
									? formatDateTime(order.paidAt).dateTime
									: "Not Paid"}
							</TableCell>
							<TableCell>
								{order.isDelivered && order.deliveredAt
									? formatDateTime(order.deliveredAt).dateTime
									: "Not Delivered"}
							</TableCell>
							<TableCell className="flex justify-content gap-2">
								<Button variant="outline">
									<Link href={`/order/${order.id}`}>Details</Link>
								</Button>
								<OrderDeleteDialog id={order.id} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{totalPage > 1 && (
				<div className="flex justify-center items-center">
					<Pagination page={Number(page)} totalPage={totalPage} />
				</div>
			)}
		</div>
	);
}
