"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatId, round2 } from "@/lib/utils";
import { Order } from "@/types";

export default function OrderDetailsTable({ order }: { order: Order }) {
	const {
		id,
		shippingAddress,
		orderItems,
		itemsPrice,
		shippingPrice,
		taxPrice,
		totalPrice,
		paymentMethod,
		isDelivered,
		isPaid,
		paidAt,
		deliveredAt,
	} = order;

	return (
		<>
			<h1 className="py-4 text-2xl">Order {formatId(id)}</h1>
			<div className="grid md:grid-cols-3 md:gap-5">
				<div className="col-span-2 space-y-4">
					<Card>
						<CardContent className="p-4 gap-4">
							<h2 className="text-xl pb-4">Payment Method</h2>
							<p className="mb-2">{paymentMethod}</p>
							{isPaid ? (
								<Badge variant="secondary">
									Paid at {formatDateTime(paidAt!).dateTime}
								</Badge>
							) : (
								<Badge variant="destructive">Not paid</Badge>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4 gap-4">
							<h2 className="text-xl pb-4">Shipping Address</h2>
							<p>{shippingAddress.fullName}</p>
							<p className="mb-2">
								{shippingAddress.streetAddress}, {shippingAddress.city}
								{shippingAddress.postalCode}, {shippingAddress.country}
							</p>
							{isDelivered ? (
								<Badge variant="secondary">
									Delivered at {formatDateTime(deliveredAt!).dateTime}
								</Badge>
							) : (
								<Badge variant="destructive">Not delivered</Badge>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardContent>
							<h2 className="text-xl pb-4">Order Items</h2>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Item</TableHead>
										<TableHead>Quantity</TableHead>
										<TableHead className="text-right">Price</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{orderItems.map((item) => (
										<TableRow key={item.slug}>
											<TableCell>
												<Link
													href={`/product/${item.slug}`}
													className="flex items-center"
												>
													<Image
														src={item.image}
														alt={item.name}
														width={50}
														height={50}
													/>
													<span className="px-2">{item.name}</span>
												</Link>
											</TableCell>
											<TableCell>
												<span className="px-2">{item.qty}</span>
											</TableCell>
											<TableCell className="text-right">
												<span className="px-2">
													{round2(Number(item.price) * item.qty)}
												</span>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>

				<div>
					<Card>
						<CardContent className=" gap-4 space-y-4">
							<div className="flex justify-between">
								<div>Items</div>
								<div>${itemsPrice}</div>
							</div>
							<div className="flex justify-between">
								<div>Tax</div>
								<div>${taxPrice}</div>
							</div>
							<div className="flex justify-between">
								<div>Shipping</div>
								<div>${shippingPrice}</div>
							</div>
							<div className="flex justify-between">
								<div>Total</div>
								<div>${totalPrice}</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
}
