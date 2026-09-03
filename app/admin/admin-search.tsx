"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AdminSearch() {
	const pathname = usePathname();

	const formActionUrl = pathname.includes("/admin/orders")
		? "/admin/orders"
		: pathname.includes("/admin/users")
			? "/admin/users"
			: "/admin/products";

	const searcParams = useSearchParams();

	const currentQuery = searcParams.get("query") || "";

	const [preQuery, setPreQuery] = useState(currentQuery);
	const [queryValue, setQueryValue] = useState(currentQuery);

	if (currentQuery !== preQuery) {
		setPreQuery(currentQuery);
		setQueryValue(currentQuery);
	}

	return (
		<form action={formActionUrl} method="GET">
			<Input
				type="search"
				placeholder="Search..."
				name="query"
				value={queryValue}
				onChange={(e) => setQueryValue(e.target.value)}
				className="md:w-[100px] lg:w-[300px]"
			/>
			<button type="submit" className="sr-only">
				Search
			</button>
		</form>
	);
}
