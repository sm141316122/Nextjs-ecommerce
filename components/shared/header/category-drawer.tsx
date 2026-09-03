import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { getAllProductCategory } from "@/lib/actions/product.actions";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

export default async function CategoryDrawer() {
	const categories = await getAllProductCategory();

	return (
		<Drawer swipeDirection="left">
			<DrawerTrigger render={<Button variant="outline" />}>
				<MenuIcon />
			</DrawerTrigger>
			<DrawerContent className="h-full max-w-sm">
				<DrawerHeader>
					<DrawerTitle>Select a category</DrawerTitle>
				</DrawerHeader>
				<div className="space-y-1">
					{categories.map((item) => (
						<DrawerClose
							key={item.category}
							nativeButton={false}
							render={
								<Button
									nativeButton={false}
									className="w-full justify-start mt-4"
									variant="ghost"
									render={<Link href={`/search?category=${item.category}`} />}
								>
									{item.category} ({item._count})
								</Button>
							}
						/>
					))}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
