import { Metadata } from "next";
import ProductForm from "../../../../components/admin/product-form";
import { requireAdmin } from "@/lib/auth-guard";
import { getProductById } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: "Edit Product",
};

export default async function ProductUpdatePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	await requireAdmin();

	const { id } = await params;

	const productExists = await getProductById(id);
	if (!productExists) notFound();

	return (
		<div className="spave-y-4">
			<h2 className="h2-bold">Edit Product</h2>
			<div className="my-8">
				<ProductForm type="Update" product={productExists} productId={id} />
			</div>
		</div>
	);
}
