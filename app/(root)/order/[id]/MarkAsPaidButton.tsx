"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updateOrderToPaidCOD } from "@/lib/actions/order.actions";
import { toast } from "@/components/ui/toast";

export default function MarkAsPaidButton({ orderId }: { orderId: string }) {
	const [isPending, startTranition] = useTransition();

	const handleClick = () => {
		startTranition(async () => {
			const res = await updateOrderToPaidCOD(orderId);

			toast.add({
				type: res.success ? "success" : "error",
				description: res.message,
			});
		});
	};

	return (
		<Button disabled={isPending} onClick={handleClick}>
			{isPending ? "Processing..." : "Mark As Paid"}
		</Button>
	);
}
