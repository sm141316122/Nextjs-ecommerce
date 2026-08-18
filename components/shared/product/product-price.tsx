import { cn } from "@/lib/utils";

function ProductPrice({
	value,
	className,
}: {
	value: number;
	className?: string;
}) {
	return (
		<p className={cn("text-2xl", className)}>
			<span className="text-xs align-super">$</span>
			{value}
		</p>
	);
}

export default ProductPrice;
