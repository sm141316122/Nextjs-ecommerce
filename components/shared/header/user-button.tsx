import { UserIcon } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { auth } from "@/auth";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.actions";

export default async function UserButton() {
	const session = await auth();

	if (!session) {
		return (
			<Link href="/sign-in" className={buttonVariants({ variant: "default" })}>
				<UserIcon /> Sign In
			</Link>
		);
	}

	const userNameButton =
		session.user?.name?.charAt(0).toLocaleUpperCase() ?? "U";

	return (
		<div className="flex gap-2 items-center">
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							variant="ghost"
							className="relative w-9 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200 cursor-pointer"
						>
							{userNameButton}
						</Button>
					}
				></DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end">
					<DropdownMenuGroup>
						<DropdownMenuLabel className="font-normal">
							<div className="flex flex-col space-y-1">
								<div className="text-sm font-medium leading-none">
									{session.user?.name}
								</div>
								<div className="text-sm text-muted-foreground leading-none">
									{session.user?.email}
								</div>
							</div>
						</DropdownMenuLabel>

						<DropdownMenuItem>
							<Link href="/user/profile" className="w-full">
								User Profile
							</Link>
						</DropdownMenuItem>

						<DropdownMenuItem>
							<Link href="/user/orders" className="w-full">
								Order History
							</Link>
						</DropdownMenuItem>

						<DropdownMenuItem className="p-0 mb-1">
							<form action={signOutUser} className="w-full">
								<Button
									className="w-full py-4 px-2 h-4 justify-start cursor-pointer"
									variant="ghost"
									type="submit"
								>
									Sign Out
								</Button>
							</form>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
