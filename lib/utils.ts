import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function convertToPlainObject<T>(value: T): T {
	return JSON.parse(JSON.stringify(value));
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

export function round(value: number | string) {
	if (typeof value === "number") {
		return Math.round(value + Number.EPSILON);
	} else if (typeof value === "string") {
		return Math.round(Number(value) + Number.EPSILON);
	} else {
		throw new Error("Value is not a number or string");
	}
}

// Shorten UUID
export function formatId(id: string) {
	return `..${id.substring(id.length - 6)}`;
}

// Format date and times
export const formatDateTime = (dateString: Date) => {
	const dateTimeOptions: Intl.DateTimeFormatOptions = {
		month: "short", // abbreviated month name (e.g., 'Oct')
		year: "numeric", // abbreviated month name (e.g., 'Oct')
		day: "numeric", // numeric day of the month (e.g., '25')
		hour: "numeric", // numeric hour (e.g., '8')
		minute: "numeric", // numeric minute (e.g., '30')
		hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
	};
	const dateOptions: Intl.DateTimeFormatOptions = {
		weekday: "short", // abbreviated weekday name (e.g., 'Mon')
		month: "short", // abbreviated month name (e.g., 'Oct')
		year: "numeric", // numeric year (e.g., '2023')
		day: "numeric", // numeric day of the month (e.g., '25')
	};
	const timeOptions: Intl.DateTimeFormatOptions = {
		hour: "numeric", // numeric hour (e.g., '8')
		minute: "numeric", // numeric minute (e.g., '30')
		hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
	};
	const formattedDateTime: string = new Date(dateString).toLocaleString(
		"en-US",
		dateTimeOptions,
	);
	const formattedDate: string = new Date(dateString).toLocaleString(
		"en-US",
		dateOptions,
	);
	const formattedTime: string = new Date(dateString).toLocaleString(
		"en-US",
		timeOptions,
	);
	return {
		dateTime: formattedDateTime,
		dateOnly: formattedDate,
		timeOnly: formattedTime,
	};
};
