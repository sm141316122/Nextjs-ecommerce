import { prisma } from "@/db/prisma";
import { generateCheckMacValue } from "@/lib/ecpay";
import { ecpayNotificationSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const formData = await request.formData();

		const rawParams = Object.fromEntries(formData.entries()) as Record<
			string,
			string
		>;

		const ecpayResponse = ecpayNotificationSchema.parse(rawParams);

		if (ecpayResponse.MerchantID !== process.env.ECPAY_MERCHANT_ID)
			return new NextResponse("0|FAIL", { status: 200 });

		const receivedCheckMacValue = ecpayResponse.CheckMacValue;

		const needCheckParams = {
			...rawParams,
		};
		delete needCheckParams.checkMacValue;

		const calculatedCheckMacValue = generateCheckMacValue(needCheckParams);

		if (receivedCheckMacValue !== calculatedCheckMacValue)
			return new NextResponse("0|FAIL", { status: 200 });

		const order = await prisma.order.findFirst({
			where: { merchantTradeNo: ecpayResponse.MerchantTradeNo },
		});
		if (!order) return new NextResponse("0|FAIL", { status: 200 });

		if (Number(order.totalPrice) !== Number(ecpayResponse.TradeAmt))
			return new NextResponse("0|FAIL", { status: 200 });

		if (order.isPaid) return new NextResponse("1|OK", { status: 200 });

		if (ecpayResponse.RtnCode !== "1")
			return new NextResponse("1|OK", { status: 200 });

		await prisma.$transaction(async (tx) => {
			const currentOrder = await tx.order.findFirst({
				where: { id: order.id },
			});

			if (!currentOrder) throw new Error("Order not found in transaction");

			if (currentOrder.isPaid) return;

			await tx.order.update({
				where: { id: currentOrder.id },
				data: {
					isPaid: true,
					paidAt: new Date(),
				},
			});
		});

		return new NextResponse("1|OK", { status: 200 });
	} catch (error) {
		return new NextResponse("0|FAIL", { status: 500 });
	}
}
