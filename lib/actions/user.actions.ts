"use server";

import {
	paymentMethodSchema,
	shippingAddressSchema,
	signInFormSchema,
	signUpFormSchema,
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/db/prisma";
import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";
import { getMyCart } from "./cart.actions";
import z from "zod";

//  Sign in with credentials
export async function signInWithCredentials(
	preState: unknown,
	formData: FormData,
) {
	try {
		const user = signInFormSchema.parse({
			email: formData.get("email"),
			password: formData.get("password"),
		});

		await signIn("credentials", user);

		return {
			success: true,
			message: "Sign in sucessfully",
		};
	} catch (error) {
		if (isRedirectError(error)) {
			throw error;
		}

		return {
			success: false,
			message: "Invalid email or password",
		};
	}
}

// Sign user out
export async function signOutUser() {
	// get current users cart and delete it so it does not persist to next user
	const currentCart = await getMyCart();

	if (currentCart?.id) {
		await prisma.cart.delete({ where: { id: currentCart.id } });
	} else {
		console.warn("No cart found for deletion.");
	}
	await signOut();
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
	try {
		const user = signUpFormSchema.parse({
			name: formData.get("name"),
			email: formData.get("email"),
			password: formData.get("password"),
			confirmPassword: formData.get("confirmPassword"),
		});

		const plainPassword = user.password;

		user.password = hashSync(plainPassword, 10);

		await prisma.user.create({
			data: {
				name: user.name,
				email: user.email,
				password: user.password,
			},
		});

		await signIn("credentials", {
			email: user.email,
			password: plainPassword,
		});

		return {
			success: true,
			message: "User registered successfully",
		};
	} catch (error) {
		if (isRedirectError(error)) {
			throw error;
		}

		return {
			success: false,
			message: formatError(error),
		};
	}
}

export async function getUserById(userId: string) {
	const user = await prisma.user.findFirst({
		where: { id: userId },
	});

	if (!user) throw new Error("User not found");

	return user;
}

export async function updateUserAddress(data: ShippingAddress) {
	try {
		const session = await auth();

		const currentUser = await prisma.user.findFirst({
			where: { id: session?.user?.id },
		});
		if (!currentUser) throw new Error("User not found");

		const address = shippingAddressSchema.parse(data);

		await prisma.user.update({
			where: { id: currentUser.id },
			data: { address },
		});

		return {
			success: true,
			message: "User update successfully",
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}

export async function updateUserPaymentMethod(
	data: z.infer<typeof paymentMethodSchema>,
) {
	try {
		const session = await auth();
		const currentUser = await prisma.user.findFirst({
			where: { id: session?.user?.id },
		});

		if (!currentUser) throw new Error("User not found");

		const paymentMethod = paymentMethodSchema.parse(data);

		await prisma.user.update({
			where: { id: currentUser.id },
			data: { paymentMethod: paymentMethod.type },
		});

		return { success: true, message: "Payment method update successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}

export async function updateProfile(user: { name: string; email: string }) {
	try {
		const session = await auth();
		if (!session) throw new Error("User not authorized");

		const currentUser = await prisma.user.findFirst({
			where: { id: session?.user?.id },
		});
		if (!currentUser) throw new Error("User not found");

		await prisma.user.update({
			where: { id: currentUser.id },
			data: { name: user.name },
		});

		return { success: true, message: "User update successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
