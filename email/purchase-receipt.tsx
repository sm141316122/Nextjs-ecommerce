import {
	Body,
	Column,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import { randomUUID } from "crypto";
import { Order } from "@/types";
import { formatDateTime } from "@/lib/utils";
import "dotenv/config";
import sampleData from "@/db/sample-data";

PurchaseReceiptEmail.PreviewProps = {
	order: {
		id: randomUUID(),
		userId: "123",
		user: {
			name: "John Doe",
			email: "test@test.com",
		},
		paymentMethod: "Stripe",
		shippingAddress: {
			fullName: "John Doe",
			streetAddress: "123 Main st",
			city: "New York",
			postalCode: "10001",
			country: "US",
		},
		createdAt: new Date(),
		totalPrice: "100",
		taxPrice: "10",
		shippingPrice: "10",
		itemsPrice: "80",
		orderItems: sampleData.products.map((x) => ({
			name: x.name,
			orderId: "123",
			productId: "123",
			slug: x.slug,
			qty: x.stock,
			image: x.images[0],
			price: x.price.toString(),
		})),
		isDelivered: true,
		deliveredAt: new Date(),
		isPaid: true,
		paidAt: new Date(),
	},
} satisfies OrderInformationProps;

type OrderInformationProps = {
	order: Order;
};

export default function PurchaseReceiptEmail({ order }: { order: Order }) {
	return (
		<Html>
			<Preview>View order receipt</Preview>
			<Tailwind>
				<Head />
				<Body className="fonts-sans bg-white">
					<Container className="max-x-xl">
						<Heading>Purchase Receipt</Heading>
						<Section>
							<Row>
								<Column>
									<Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
										Order ID
									</Text>
									<Text className="mb-0 mr-4">{order.id.toString()}</Text>
								</Column>
								<Column>
									<Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
										Purchase Date
									</Text>
									<Text className="mb-0 mr-4">
										{formatDateTime(order.createdAt).dateTime}
									</Text>
								</Column>
								<Column>
									<Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
										Price Paid
									</Text>
									<Text className="mb-0 mr-4">{order.totalPrice}</Text>
								</Column>
							</Row>
						</Section>
						<Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6">
							{order.orderItems.map((item) => (
								<Row key={item.productId} className="mt-8">
									<Column className="w-20">
										<Img
											src={
												item.image.startsWith("/")
													? `${process.env.NEXT_PUBLIC_APP_SERVER_URL}${item.image}`
													: `${item.image}`
											}
											alt={item.name}
											width="80"
											className="rounded"
										/>
									</Column>
									<Column className="align-top">
										{item.name} x {item.qty}
									</Column>
									<Column align="right" className="align-top">
										{item.price}
									</Column>
								</Row>
							))}
							{[
								{ name: "Items", price: order.itemsPrice },
								{ name: "Tax", price: order.taxPrice },
								{ name: "Shipping", price: order.shippingPrice },
								{ name: "Total", price: order.totalPrice },
							].map(({ name, price }) => (
								<Row key={name} className="py-1">
									<Column align="right">{name}</Column>
									<Column align="right" width={70} className="align-top">
										<Text className="m-0">{price}</Text>
									</Column>
								</Row>
							))}
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
