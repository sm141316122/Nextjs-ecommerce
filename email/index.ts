import { APP_NAME, SENDER_EMAIL } from "@/lib/constants";
import { Order } from "@/types";
import { Resend } from "resend";
import PurchaseReceiptEmail from "./purchase-receipt";
import { jsx } from "react/jsx-runtime";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
	await resend.emails.send({
		from: `${APP_NAME} <${SENDER_EMAIL}>`,
		to: order.user.email,
		replyTo: SENDER_EMAIL,
		subject: `Order Confirmation ${order.id}`,
		react: jsx(PurchaseReceiptEmail, { order: order }),
	});
};
