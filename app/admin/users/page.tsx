import Link from "next/link";
import { Metadata } from "next";
import Pagination from "@/components/shared/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { requireAdmin } from "@/lib/auth-guard";
import { formatId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import DeleteDialog from "../../../components/shared/delete-dialog";
import { getAllUsers } from "@/lib/actions/user.actions";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
	title: "Admin Users",
};

export default async function AdminUsersPage({
	searchParams,
}: {
	searchParams: Promise<{ page: string; query: string; category: string }>;
}) {
	await requireAdmin();

	const params = await searchParams;

	const page = Number(params.page) || 1;
	const searchText = params.query || "";
	const category = params.category || "";

	const { allUsers, totalPage } = await getAllUsers({
		page,
		query: searchText,
	});

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center w-full">
				<div className="flex items-center gap-3">
					<h1 className="h2-bold">Users</h1>
					{searchText && (
						<div>
							Filter By <i>&quot;{searchText}&quot;</i>
							<Link href="/admin/users">
								<Button variant="outline" size="sm" className="ml-4">
									Remove Filter
								</Button>
							</Link>
						</div>
					)}
				</div>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>NAME</TableHead>
						<TableHead>EMAIL</TableHead>
						<TableHead>ROLE</TableHead>
						<TableHead className="w-[100px]">ACTIONS</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{allUsers.map((user) => (
						<TableRow key={user.id}>
							<TableCell>{formatId(user.id)}</TableCell>
							<TableCell>{user.name}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>
								{user.role === "admin" ? (
									<Badge>Admin</Badge>
								) : (
									<Badge variant="secondary">User</Badge>
								)}
							</TableCell>
							<TableCell className="flex gap-2">
								<Button variant="outline">
									<Link href={`/admin/users/${user.id}`}>Edit</Link>
								</Button>
								<DeleteDialog id={user.id} deleteType="user" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{totalPage > 1 && (
				<div className="flex justify-center items-center">
					<Pagination page={Number(page)} totalPage={totalPage} />
				</div>
			)}
		</div>
	);
}
