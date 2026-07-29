import "dotenv/config";

import { neonConfig } from "@neondatabase/serverless";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import sampleData from "./sample-data";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

export const adapter = new PrismaNeon({ connectionString });

const main = async () => {
	const prisma = new PrismaClient({ adapter });
	await prisma.product.deleteMany();
	await prisma.user.deleteMany();
	await prisma.account.deleteMany();
	await prisma.session.deleteMany();
	await prisma.verificationToken.deleteMany();

	await prisma.product.createMany({ data: sampleData.products });
	await prisma.user.createMany({ data: sampleData.users });

	console.log(`Database seeded successfully`);
};

main();
