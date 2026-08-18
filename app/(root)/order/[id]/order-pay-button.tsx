"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type PaymentResponse = {
	action: string;
	fields: Record<string, string>;
};

export default function OrderPayButton({ orderId }: { orderId: string }) {
	const [isPending, setIsPending] = useState(false);
	const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);

	const formRef = useRef<HTMLFormElement>(null);

	const handlePayment = async () => {
		try {
			setIsPending(true);

			const response = await fetch("/api/ecpay/payment", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ orderId }),
			});

			const data = await response.json();
			if (!response.ok)
				throw new Error(data.message || "Failed to create payment");
			setPaymentData(data);
		} catch (error) {
			setIsPending(false);
		}
	};

	useEffect(() => {
		if (paymentData && formRef.current) {
			setIsPending(false);

			formRef.current.submit();
		}
	}, [paymentData]);

	return (
		<>
			<Button disabled={isPending} className="w-full" onClick={handlePayment}>
				{isPending ? <Loader className="w-4 h-4" /> : "Pay"}
			</Button>

			{paymentData && (
				<form
					ref={formRef}
					action={paymentData.action}
					method="POST"
					style={{ display: "none" }}
				>
					{Object.entries(paymentData.fields).map(([key, value]) => (
						<input key={key} type="hidden" name={key} value={value} />
					))}
				</form>
			)}
		</>
	);
}
