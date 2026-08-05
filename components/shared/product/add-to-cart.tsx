"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "@/components/ui/toast";
import { Plus, Minus, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Cart, CartItem } from "@/types";
import { addCartItem, removeItemFromCart } from "@/lib/actions/cart.actions";

export default function AddToCart({
	cart,
	item,
}: {
	cart?: Cart;
	item: CartItem;
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleAddToCart = async () => {
		startTransition(async () => {
			const res = await addCartItem(item);

			toast.add({
				type: res.success ? "success" : "error",
				description: res.message,
				...(res.success && {
					actionProps: {
						children: "Go To Cart",
						onClick() {
							router.push("/cart");
						},
					},
				}),
			});

			return;
		});
	};

	const handleRemoveFromCart = async () => {
		startTransition(async () => {
			const res = await removeItemFromCart(item.productId);

			toast.add({
				type: res.success ? "success" : "error",
				description: res.message,
			});

			return;
		});
	};

	const existItem =
		cart && cart.items.find((i) => i.productId === item.productId);

	return existItem ? (
		<div>
			<Button type="button" variant="outline" onClick={handleRemoveFromCart}>
				{isPending ? (
					<Loader className="w-4 h-4 animate-spin" />
				) : (
					<Minus className="h-4 w-4" />
				)}
			</Button>
			<span className="px-2">{existItem.qty}</span>
			<Button type="button" variant="outline" onClick={handleAddToCart}>
				{isPending ? (
					<Loader className="w-4 h-4 animate-spin" />
				) : (
					<Plus className="h-4 w-4" />
				)}
			</Button>
		</div>
	) : (
		<Button
			className="w-full cursor-pointer"
			type="button"
			onClick={handleAddToCart}
		>
			{isPending ? (
				<Loader className="w-4 h-4 animate-spin" />
			) : (
				<Plus className="h-4 w-4" />
			)}
			Add To Cart
		</Button>
	);
}
