"use client";

import { useTheme } from "next-themes";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, SunMoon } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

function ModeToggle() {
	const mounted = useSyncExternalStore(
		() => () => {},
		() => true,
		() => false,
	);

	const { theme, setTheme } = useTheme();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	if (!mounted) return null;

	let icon;
	if (theme === "system") {
		icon = <SunMoon />;
	} else if (theme === "light") {
		icon = <SunIcon />;
	} else if (theme === "dark") {
		icon = <MoonIcon />;
	}

	return (
		<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
			<DropdownMenuTrigger render={<Button variant="ghost" />}>
				{icon}
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuLabel>Appearance</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuCheckboxItem
					checked={theme === "system"}
					onCheckedChange={() => {
						setTheme("system");
						setIsDropdownOpen(false);
					}}
				>
					System
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={theme === "light"}
					onCheckedChange={() => {
						setTheme("light");
						setIsDropdownOpen(false);
					}}
				>
					Light
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={theme === "dark"}
					onCheckedChange={() => {
						setTheme("dark");
						setIsDropdownOpen(false);
					}}
				>
					Dark
				</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default ModeToggle;
