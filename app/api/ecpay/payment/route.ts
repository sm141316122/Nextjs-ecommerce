import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import {
	formatEcpayDate,
	generateCheckMacValue,
	generateMerchanTradeNo,
} from "@/lib/ecpay";
import { formatError } from "@/lib/utils";
import { ecpayPaymentSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const session = await auth();
		if (!session)
			NextResponse.json(
				{ message: "User is not authenticated" },
				{ status: 401 },
			);

		if (!session?.user?.id)
			NextResponse.json({ message: "User not found" }, { status: 404 });

		const result = await request.json();

		const ecpayPayment = ecpayPaymentSchema.parse(result);

		const { orderId } = ecpayPayment;

		const order = await prisma.order.findFirst({
			where: { id: orderId, userId: session!.user.id },
		});
		if (!order)
			NextResponse.json({ message: "Order not found" }, { status: 404 });

		if (order!.isPaid)
			NextResponse.json({ message: "Order has been paid" }, { status: 400 });

		const totalAmount = Number(order!.totalPrice);
		if (!Number.isInteger(totalAmount))
			NextResponse.json(
				{ message: "Total price must be Integer" },
				{ status: 400 },
			);

		const merchantTradeNo = generateMerchanTradeNo(order!.id);

		const params = {
			MerchantID: process.env.ECPAY_MERCHANT_ID!,
			MerchantTradeNo: merchantTradeNo,
			MerchantTradeDate: formatEcpayDate(new Date()),
			PaymentType: "aio",
			TotalAmount: totalAmount,
			TradeDesc: "Online Shopping",
			ItemName: "Shopping product",
			ReturnURL: `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/api/ecpay/notify`,
			ChoosePayment: "ALL",
			EncryptType: 1,
			OrderResultURL: `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/payment-success?orderId=${order!.id}`,
		};

		const checkMacValue = generateCheckMacValue(params);

		const fields = {
			...params,
			TotalAmount: String(params.TotalAmount),
			EncryptType: String(params.EncryptType),
			CheckMacValue: checkMacValue,
		};

		await prisma.order.update({
			where: { id: orderId },
			data: { merchantTradeNo },
		});

		return NextResponse.json({
			action: process.env.ECPAY_PAYMENT_URL,
			fields,
		});
	} catch (error) {
		const Errorformated = formatError(error);

		return NextResponse.json(
			{
				message: Errorformated,
			},
			{ status: 500 },
		);
	}
}
