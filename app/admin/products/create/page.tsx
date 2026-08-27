import { Metadata } from "next";
import ProductForm from "../../../../components/admin/product-form";
import { requireAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = {
	title: "Create Product",
};

export default async function ProductCreatePage() {
	await requireAdmin();

	return (
		<div className="spave-y-4">
			<h2 className="h2-bold">Create Product</h2>
			<div className="my-8">
				<ProductForm type="Create" />
			</div>
		</div>
	);
}
