import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProducts from "@/components/view-all-products";
import {
	getFeaturedProducts,
	getLatestProducts,
} from "@/lib/actions/product.actions";

async function HomePage() {
	const products = await getLatestProducts();
	const featuredProducts = await getFeaturedProducts();

	return (
		<>
			{featuredProducts && featuredProducts.length > 0 && (
				<ProductCarousel data={featuredProducts} />
			)}
			<ProductList data={products} title="Newest Arrivals" limit={4} />
			<ViewAllProducts />
		</>
	);
}

export default HomePage;
