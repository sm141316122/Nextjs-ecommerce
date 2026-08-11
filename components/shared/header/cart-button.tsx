import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getMyCart } from "@/lib/actions/cart.actions";

export default async function CartButton() {
	const cart = await getMyCart();
	const totalQty = cart?.items.reduce((a, c) => a + c.qty, 0);

	if (totalQty) {
	}

	return (
		<Link
			href="/cart"
			className={buttonVariants({ variant: "ghost" }) + " relative"}
		>
			<ShoppingCart /> Cart
			{totalQty !== 0 && totalQty && (
				<span className="absolute right-0 top-0 text-red-500 font-bold">
					{totalQty}
				</span>
			)}
		</Link>
	);
}
