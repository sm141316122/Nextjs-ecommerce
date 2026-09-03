import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserById } from "@/lib/actions/user.actions";
import UpdateUserForm from "../update-user-form";

export const metadata: Metadata = {
	title: "Update User",
};

export default async function AdminUserUpdatePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const user = await getUserById(id);

	if (!user) notFound();

	return (
		<div className="space-y-4 max-w-lg mx-auto">
			<h1 className="h2-bold">Update User</h1>
			<UpdateUserForm user={user} />
		</div>
	);
}
