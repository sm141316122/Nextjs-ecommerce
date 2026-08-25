import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requiredAdmin(orderUserId?: string) {
	const session = await auth();

	if (orderUserId !== session?.user?.id && session?.user?.role !== "admin") {
		redirect("/unauthorized");
	}
}
