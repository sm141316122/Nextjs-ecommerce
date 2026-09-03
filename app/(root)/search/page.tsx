import Link from "next/link";
import ProductItem from "@/components/shared/product/product-item";
import {
	getAllProductCategory,
	getAllProducts,
} from "@/lib/actions/product.actions";
import { Button } from "@/components/ui/button";

const PRICE = [
	{ name: "$0 - $1000", value: "0-1000" },
	{ name: "$1001 - $2000", value: "1001-2000" },
	{ name: "$2001 - $3000", value: "2001-3000" },
	{ name: "$3001 - $4000", value: "3001-4000" },
	{ name: "$4001 - $5000", value: "4001-5000" },
];

const RATINGS = [4, 3, 2, 1];

const sortOrder = ["newest", "lowest", "highest", "rating"];

export async function generateMetadata() {
	return {
		title: "Search Product",
	};
}

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{
		q?: string;
		category?: string;
		price?: string;
		rating?: string;
		sort?: string;
		page?: string;
	}>;
}) {
	const {
		q = "all",
		category = "all",
		price = "all",
		rating = "all",
		sort = "newest",
		page = "1",
	} = await searchParams;

	const getFilterUrl = ({
		c,
		p,
		r,
		s,
		pg,
	}: {
		c?: string;
		p?: string;
		r?: string;
		s?: string;
		pg?: string;
	}) => {
		const params = { q, category, price, rating, sort, page };

		if (c) params.category = c;
		if (p) params.price = p;
		if (r) params.rating = r;
		if (s) params.sort = s;
		if (pg) params.page = pg;

		return `/search?${new URLSearchParams(params).toString()}`;
	};

	const products = await getAllProducts({
		query: q,
		category,
		price,
		rating,
		sort,
		page: Number(page),
	});

	const categories = await getAllProductCategory();

	return (
		<div className="grid md:grid-cols-5 md:gap-5">
			<div className="filter-links">
				<div className="text-xl mb-2 mt-3">Department</div>
				<div>
					<ul className="space-y-1">
						<li>
							<Link
								className={
									category === "all" || category === "" ? "font-bold" : ""
								}
								href={getFilterUrl({ c: "all" })}
							>
								Any
							</Link>
						</li>
						{categories.map((item) => (
							<li key={item.category}>
								<Link
									className={category === item.category ? "font-bold" : ""}
									href={getFilterUrl({ c: item.category })}
								>
									{item.category}
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div className="text-xl mb-2 mt-8">Price</div>
				<div>
					<ul className="space-y-1">
						<li>
							<Link
								className={price === "all" || price === "" ? "font-bold" : ""}
								href={getFilterUrl({ p: "all" })}
							>
								Any
							</Link>
						</li>
						{PRICE.map((searchPrice) => (
							<li key={searchPrice.value}>
								<Link
									className={price === searchPrice.value ? "font-bold" : ""}
									href={getFilterUrl({ p: searchPrice.value })}
								>
									{searchPrice.name}
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div className="text-xl mb-2 mt-8">Customus Review</div>
				<div>
					<ul className="space-y-1">
						<li>
							<Link
								className={rating === "all" || rating === "" ? "font-bold" : ""}
								href={getFilterUrl({ r: "all" })}
							>
								Any
							</Link>
						</li>
						{RATINGS.map((searchRating) => (
							<li key={searchRating}>
								<Link
									className={Number(rating) === searchRating ? "font-bold" : ""}
									href={getFilterUrl({ r: searchRating.toString() })}
								>
									{searchRating} stars & up
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className="md:col-span-4 space-y-4">
				<div className="flex flex-row-reverse items-center justify-between my-4">
					<div>
						Sort by{" "}
						{sortOrder.map((s) => (
							<Link
								key={s}
								className={`mx-2 ${s === sort && "font-bold"}`}
								href={getFilterUrl({ s })}
							>
								{s}
							</Link>
						))}
					</div>
					{((q !== "all" && q !== "") ||
						(category !== "all" && category !== "") ||
						(price !== "all" && price !== "") ||
						(rating !== "all" && rating !== "") ||
						(sort !== "newest" && sort !== "")) && (
						<Button nativeButton={false} render={<Link href="/search" />}>
							Clean All
						</Button>
					)}
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{products.allProducts.length === 0 && <div>No products found</div>}
					{products.allProducts.map((product) => (
						<ProductItem key={product.id} product={product} />
					))}
				</div>
			</div>
		</div>
	);
}
