import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
	const session = await auth();
	if (session?.user?.role !== "admin") {
		redirect("/unauthorized");
	}
}

export async function requireOwnerOrAdmin(orderUserId: string) {
	const session = await auth();
	const isOwner = session?.user?.id === orderUserId;
	const isAdmin = session?.user?.role === "admin";
	if (!isOwner && !isAdmin) {
		redirect("/unauthorized");
	}
}
