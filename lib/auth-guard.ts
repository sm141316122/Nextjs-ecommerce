import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requiredAdmin(isOrderOwner = true) {
	const session = await auth();

	if (isOrderOwner && session?.user?.role !== "admin") {
		redirect("/unauthorized");
	}
}
