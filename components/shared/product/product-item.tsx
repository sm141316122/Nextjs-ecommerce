import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import ProductPrice from "./product-price";
import { Product } from "@/types";

function ProductItem({ product }: { product: Product }) {
	return (
		<Card className="w-full max-x-sm">
			<Link href={`/product/${product.slug}`}>
				<Image
					src={product.images[0]}
					width={300}
					height={300}
					alt={product.name}
					priority
				/>
			</Link>
			<CardHeader className="items-center">
				<CardTitle className="text-xs">{product.brand}</CardTitle>
				<CardAction>
					<Badge variant="secondary">Featured</Badge>
				</CardAction>
			</CardHeader>
			<CardContent>
				<Link href={`/product/${product.slug}`}>
					<h2 className="text-sm font-medium py-4">{product.name}</h2>
				</Link>
				<div className="flex-between gap-4">
					<p>{product.rating} Stars</p>
					{product.stock > 0 ? (
						<ProductPrice value={Number(product.price)} />
					) : (
						<p className="text-destructive">Out Of Stock</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

export default ProductItem;
