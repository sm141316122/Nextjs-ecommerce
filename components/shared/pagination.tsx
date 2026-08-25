"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Pagination({
	page,
	totalPage,
}: {
	page: number;
	totalPage: number;
}) {
	const router = useRouter();
	const pathname = usePathname();
	console.log(pathname);

	const handleClick = (clickPage: number) => {
		router.push(`${pathname}?page=${clickPage}`);
	};

	return (
		<div className="flex justify-center items-center gap-2">
			{Array.from({ length: totalPage }, (_, index) => (
				<Button
					variant={
						page === index + 1 || (!page && index === 0) ? "default" : "outline"
					}
					onClick={() => handleClick(index + 1)}
					key={index}
				>
					{index + 1}
				</Button>
			))}
		</div>
	);
}
