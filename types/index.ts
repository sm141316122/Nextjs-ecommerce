import { z } from "zod";
import { inserProductSchema } from "@/lib/validators";

export type Product = z.infer<typeof inserProductSchema> & {
	id: string;
	rating: string;
	createdAt: Date;
};
