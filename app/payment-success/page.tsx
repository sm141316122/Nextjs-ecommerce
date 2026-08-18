import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export default async function PaymentSuccessPage({
	searchParams,
}: {
	searchParams: Promise<{ orderId: string }>;
}) {
	const { orderId } = await searchParams;

	return (
		<div className="flex flex-col justify-center items-center w-full">
			<header className="w-full border-b">
				<div className="wrapper flex-between">
					<div className="flex-start">
						<Link href="/" className="flex-start">
							<Image
								src="/images/logo.svg"
								alt={`${APP_NAME}`}
								height={48}
								width={48}
								priority={true}
							/>
							<span className="hidden lg:block font-bold text-2xl ml-3">
								{APP_NAME}
							</span>
						</Link>
					</div>
				</div>
			</header>
			<div className="w-fit pt-20">
				<h1 className="py-4 text-2xl">Payment successful</h1>
				<p className="mb-4">Order Number : {orderId}</p>
				<Link href={`/order/${orderId}`}>
					<Button>Go to order page</Button>
				</Link>
			</div>
		</div>
	);
}
