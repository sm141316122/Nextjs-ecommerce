import Link from "next/link";
import ModeToggle from "./mode-toggle";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./user-button";
import CartButton from "./cart-button";

async function Menu() {
	return (
		<div className="flex justify-end gap-3">
			<nav className="hidden md:flex w-full max-w-xs gap-1">
				<ModeToggle />
				<CartButton />
				<UserButton />
			</nav>
			<nav className="md:hidden">
				<Sheet>
					<SheetTrigger
						className="align-middle"
						render={<Button variant="outline" />}
					>
						<EllipsisVertical />
					</SheetTrigger>
					<SheetContent className="flex flex-col items-start p-6">
						<SheetHeader>
							<SheetTitle>Menu</SheetTitle>
						</SheetHeader>
						<ModeToggle />
						<CartButton />
						<Link
							href="/sign-in"
							className={buttonVariants({ variant: "default" })}
						>
							<UserIcon /> Sign In
						</Link>
					</SheetContent>
				</Sheet>
			</nav>
		</div>
	);
}

export default Menu;
