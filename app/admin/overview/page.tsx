import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BadgeDollarSign, Barcode, CreditCard, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderSummary } from "@/lib/actions/order.actions";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import Charts from "./charts";

export const metadata: Metadata = {
	title: "Admin Dashboard",
};

export default async function AdminOverviewPage() {
	const session = await auth();
	if (!session) throw new Error("User not authorized");

	if (session.user.role !== "admin") redirect("/unauthorized");

	const summary = await getOrderSummary();

	return (
		<div className="space-y-2">
			<h1 className="h2-bold">Dashboard</h1>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<BadgeDollarSign />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							$ {summary.totalSales._sum.totalPrice!.toString()}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Sales</CardTitle>
						<CreditCard />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{Number(summary.ordersCount)}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">User</CardTitle>
						<Users />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{Number(summary.usersCount)}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Products</CardTitle>
						<Barcode />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{Number(summary.productsCount)}
						</div>
					</CardContent>
				</Card>
			</div>
			<div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
				<Card className="lg:col-span-4">
					<CardHeader>
						<CardTitle className="font-bold text-lg">Overview</CardTitle>
					</CardHeader>
					<CardContent>
						<Charts data={{ salesData: summary.salesData }} />
					</CardContent>
				</Card>
				<Card className="lg:col-span-3">
					<CardHeader>
						<CardTitle className="text-lg font-bold">Recent Sales</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableCell>BUYER</TableCell>
									<TableCell>DATE</TableCell>
									<TableCell>TOTAL</TableCell>
									<TableCell>ACTIONS</TableCell>
								</TableRow>
							</TableHeader>
							<TableBody>
								{summary.latestSales.map((order) => (
									<TableRow key={order.id}>
										<TableCell className="py-4">
											{order?.user?.name ? order.user.name : "Deleted User"}
										</TableCell>
										<TableCell className="py-2">
											{formatDateTime(order.createdAt).dateOnly}
										</TableCell>
										<TableCell className="py-2">$ {order.totalPrice}</TableCell>
										<TableCell className="py-2">
											<Link href={`/order/${order.id}`}>Details</Link>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
