import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalThis["prisma"] = prisma; // Add prisma to the global object in non-production environments
}

export default prisma;

