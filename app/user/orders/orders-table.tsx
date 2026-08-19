import Link from "next/link";
import { getMyOrders } from "@/lib/actions/order.actions";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatId } from "@/lib/utils";
import Pagination from "@/components/shared/pagination";

export default async function OrdersTable({ page }: { page: string }) {
	const { orders, totalPage } = await getMyOrders({ page: Number(page) || 1 });

	return (
		<>
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
					{orders.map((order) => (
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
							<TableCell>
								<Link href={`/order/${order.id}`}>
									<span className="px-2">Details</span>
								</Link>
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
		</>
	);
}
