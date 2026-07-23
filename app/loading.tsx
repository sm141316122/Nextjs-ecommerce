import Image from "next/image";
import loader from "@/assets/loader.gif";

function loading() {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				width: "100vw",
				height: "100vh",
			}}
		>
			<Image src={loader} width={50} height={50} alt="Loading..." />
		</div>
	);
}

export default loading;
