import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getAllProductCategory } from "@/lib/actions/product.actions";
import { SearchIcon } from "lucide-react";

export default async function Search() {
	const categories = await getAllProductCategory();
	const items = [
		{ label: "All", value: "all" },
		...categories.map((category) => ({
			label: category.category,
			value: category.category,
		})),
	];

	return (
		<form method="GET" action="/search">
			<div className="flex w-full mx-w-sm items-center space-x-2">
				<Select name="category" items={items} defaultValue="all">
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent alignItemWithTrigger={false}>
						{items.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Input
					name="q"
					type="text"
					placeholder="Search..."
					className="md:w-[100[px] lg:w-[300px]"
				/>
				<Button type="submit">
					<SearchIcon />
				</Button>
			</div>
		</form>
	);
}
