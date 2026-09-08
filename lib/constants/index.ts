export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Porstore";
export const APP_DESCRIPTION =
	process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
	"A modern ecommerce platform built with Next.js";
export const SERVER_URL =
	process.env.NEXT_PUBLIC_APP_SERVER_URL || "http://localhost:3000";

export const LATEST_PRODUCTS_LIMIT =
	Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaltValues = {
	email: "admin@example.com",
	password: "123456",
};

export const signUpDefaltValues = {
	name: "",
	email: "",
	password: "",
	confirmPassword: "",
};

export const shippingAddressDefaultValues = {
	fullName: "Ben",
	streetAddress: "123 Main Street",
	city: "Anytown",
	postalCode: "12345",
	country: "TW",
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
	? process.env.PAYMENT_METHODS.split(", ")
	: ["ECPay", "Stripe", "CashOnDelivery"];
export const DEFAULT_PAYMENT_METHOD =
	process.env.DEFAULT_PAYMENT_METHOD || "ECPay";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 5;

export const productDefaultValues = {
	name: "",
	slug: "",
	category: "",
	images: [] as string[],
	brand: "",
	description: "",
	price: "0",
	stock: 0,
	rating: "0",
	numReviews: 0,
	isFeatured: false,
	banner: null as string | null,
};

export const USER_ROLES = process.env.USER_ROLES
	? process.env.USER_ROLES.split(", ")
	: ["admin", "user"];

export const reviewFormDefaultValues = {
	title: "",
	comment: "",
	rating: 0,
};

export const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev";
