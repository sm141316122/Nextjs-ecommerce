import { z } from "zod";
import { PAYMENT_METHODS } from "./constants";

// Schema for inserting products
export const insertProductSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters"),
	slug: z.string().min(3, "Slug must be at least 3 characters"),
	category: z.string().min(3, "Category must be at least 3 characters"),
	brand: z.string().min(3, "Brand must be at least 3 characters"),
	description: z.string().min(3, "Description must be at least 3 characters"),
	stock: z.coerce.number(),
	images: z.array(z.string()).min(1, "product must have at least one image"),
	isFeatured: z.boolean(),
	banner: z.string().nullable(),
	price: z.string(),
});

export const signInFormSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpFormSchema = z
	.object({
		name: z.string().min(3, "Name must be at least 3 characters"),
		email: z.email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z
			.string()
			.min(6, "Confirm password must be at least 6 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Password not match",
		path: ["confirmPassword"],
	});

export const cartItemSchema = z.object({
	productId: z.string().min(1, "Product is required"),
	name: z.string().min(1, "Name is required"),
	slug: z.string().min(1, "Slug is required"),
	qty: z.number().int().nonnegative("Quantity must be a positive number"),
	image: z.string().min(1, "Image is required"),
	price: z.string(),
});

export const insertCartSchema = z.object({
	items: z.array(cartItemSchema),
	itemsPrice: z.string(),
	totalPrice: z.string(),
	shippingPrice: z.string(),
	taxPrice: z.string(),
	sessionCartId: z.string().min(1, "Session cart id is required"),
	userId: z.string().optional().nullable(),
});

export const shippingAddressSchema = z.object({
	fullName: z.string().min(3, "Name must be at least 3 characters"),
	streetAddress: z.string().min(3, "Address must be at least 3 characters"),
	city: z.string().min(3, "City must be at least 3 characters"),
	postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
	country: z.string().min(2, "Country must be at least 2 characters"),
	lat: z.number().optional(),
	lng: z.number().optional(),
});

export const paymentMethodSchema = z
	.object({
		type: z.string().min(1, "Payment method is required"),
	})
	.refine((data) => PAYMENT_METHODS.includes(data.type), {
		path: ["type"],
		message: "Invalid payment method",
	});

export const orderItemSchema = z.object({
	productId: z.string(),
	slug: z.string(),
	name: z.string(),
	image: z.string(),
	price: z.string(),
	qty: z.number(),
});

export const insertOrderSchema = z.object({
	userId: z.string().min(1, "User is required"),
	itemsPrice: z.string(),
	shippingPrice: z.string(),
	taxPrice: z.string(),
	totalPrice: z.string(),
	paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
		message: "Invalid payment method",
	}),
	shippingAddress: shippingAddressSchema,
});

export const ecpayPaymentSchema = z.object({
	orderId: z.string().min(1, "Oder id is required"),
});

export const ecpayNotificationSchema = z.object({
	MerchantID: z.string(),
	MerchantTradeNo: z.string(),
	RtnCode: z.string(),
	RtnMsg: z.string(),
	TradeAmt: z.string(),
	PaymentDate: z.string(),
	PaymentType: z.string(),
	CheckMacValue: z.string(),
	SimulatePaid: z.string(),
});
