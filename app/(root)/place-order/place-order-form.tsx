"use client";

import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order.actions";
import { Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function PlaceOrderForm() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		startTransition(async () => {
			const res = await createOrder();

			if (res.redirectTo) {
				router.push(res.redirectTo);
			}
		});
	};

	return (
		<form onSubmit={handleSubmit}>
			<Button type="submit" disabled={isPending} className="w-full">
				{isPending ? (
					<Loader className="w-4 h-4" />
				) : (
					<Check className="w-4 h-4" />
				)}{" "}
				Place Order
			</Button>
		</form>
	);
}
