import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function convertToPlainObject<T>(value: T): T {
	return JSON.parse(JSON.stringify(value));
}

export function formatNumberWithDecimal(num: number): string {
	const [int, decimal] = num.toString().split(".");
	return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
	if (error.name === "ZodError") {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const fieldErrors = error.issues.map((field: any) => field.message);

		return fieldErrors.join("\n");
	} else if (
		error.name === "PrismaClientKnownRequestError" &&
		error.code === "P2002"
	) {
		const field =
			error.meta?.driverAdapterError?.cause?.constraint?.fields[0] || "Field";

		return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
	} else {
		return typeof error.message === "string"
			? error.message
			: JSON.stringify(error.message);
	}
}

// Round number to 2 decimal places
export function round2(value: number | string) {
	if (typeof value === "number") {
		return Math.round((value + Number.EPSILON) * 100) / 100;
	} else if (typeof value === "string") {
		return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
	} else {
		throw new Error("Value is not a number or string");
	}
}
