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
import { getAllProducts } from "@/lib/actions/product.actions";
import { requireAdmin } from "@/lib/auth-guard";
import { formatId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import OrderDeleteDialog from "../../../components/shared/delete-dialog";

export const metadata: Metadata = {
	title: "Admin Products",
};

export default async function AdminProductsPage({
	searchParams,
}: {
	searchParams: Promise<{ page: string; query: string; category: string }>;
}) {
	await requireAdmin();

	const params = await searchParams;

	const page = Number(params.page) || 1;
	const searchText = params.query || "";
	const category = params.category || "";

	const { allProducts, totalPage } = await getAllProducts({
		page,
		query: searchText,
		category,
	});

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center w-full">
				<h2 className="h2-bold">Products</h2>
				<Button>
					<Link href="/admin/products/create">Create Product</Link>
				</Button>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>NAME</TableHead>
						<TableHead className="text-right">PRICE</TableHead>
						<TableHead>CATEGORY</TableHead>
						<TableHead>STOCK</TableHead>
						<TableHead>RATING</TableHead>
						<TableHead className="w-[100px]">ACTIONS</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{allProducts.map((product) => (
						<TableRow key={product.id}>
							<TableCell>{formatId(product.id)}</TableCell>
							<TableCell>{product.name}</TableCell>
							<TableCell className="text-right">${product.price}</TableCell>
							<TableCell>{product.category}</TableCell>
							<TableCell>{product.stock}</TableCell>
							<TableCell>{product.rating}</TableCell>
							<TableCell className="flex gap-2">
								<Button variant="outline">
									<Link href={`/admin/products/${product.id}`}>Edit</Link>
								</Button>
								<OrderDeleteDialog id={product.id} deleteType="product" />
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
