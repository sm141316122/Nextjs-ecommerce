import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function PaymentSuccessPage({
	searchParams,
}: {
	searchParams: Promise<{ orderId: string }>;
}) {
	const { orderId } = await searchParams;

	return (
		<>
			<h1 className="py-4 text-2xl">Payment successful</h1>
			<p className="mb-4">Order Number : {orderId}</p>
			<Link href={`/order/${orderId}`}>
				<Button>Go to order page</Button>
			</Link>
		</>
	);
}
