import Link from "next/link";
import { Button } from "./ui/button";

export default function ViewAllProducts() {
	return (
		<div className="flex justify-center items-center my-8">
			<Button
				className="px-8 py-4 text-lg font-semibold"
				nativeButton={false}
				render={<Link href="/search" />}
			>
				View All Products
			</Button>
		</div>
	);
}
