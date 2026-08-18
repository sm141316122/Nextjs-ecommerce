import crypto from "crypto";

type EcpayParams = Record<string, string | number>;

export function generateMerchanTradeNo(orderId: string) {
	const merchanTradeNo = `${(orderId.replaceAll("-", "") + Date.now().toString().slice(-4)).substring(orderId.length - 20)}`;

	return merchanTradeNo;
}

function ecpayUrlEncode(value: string) {
	return encodeURIComponent(value)
		.replace(/%20/g, "+")
		.replace(/%2D/gi, "-")
		.replace(/%5F/gi, "_")
		.replace(/%2E/gi, ".")
		.replace(/%21/gi, "!")
		.replace(/%2A/gi, "*")
		.replace(/%28/gi, "(")
		.replace(/%29/gi, ")");
}

export function generateCheckMacValue(params: EcpayParams) {
	const hashKey = process.env.ECPAY_HASH_KEY;
	const hashIV = process.env.ECPAY_HASH_IV;

	if (!hashKey || !hashIV) {
		throw new Error("ECPAY_HASH_KEY or ECPAY_HASH_IV is missing");
	}

	const data = Object.entries(params)
		.filter(([key]) => key !== "CheckMacValue")
		.sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase()))
		.map(([key, value]) => `${key}=${value}`)
		.join("&");

	const raw = `HashKey=${hashKey}&${data}&HashIV=${hashIV}`;

	const encoded = ecpayUrlEncode(raw).toLowerCase();

	return crypto
		.createHash("sha256")
		.update(encoded)
		.digest("hex")
		.toUpperCase();
}

export function verifyCheckMacValue(
	params: EcpayParams,
	receivedCheckMacValue: string,
) {
	const calculated = generateCheckMacValue(params);
	return calculated === receivedCheckMacValue;
}

export function formatEcpayDate(date: Date) {
	const pad = (value: number) => value.toString().padStart(2, "0");

	return (
		`${date.getFullYear()}/` +
		`${pad(date.getMonth() + 1)}/` +
		`${pad(date.getDate())} ` +
		`${pad(date.getHours())}:` +
		`${pad(date.getMinutes())}:` +
		`${pad(date.getSeconds())}`
	);
}
