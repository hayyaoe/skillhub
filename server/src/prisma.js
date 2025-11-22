import { PrismaClient } from "@prisma/client";

// Singleton Approach on Prisma Client
const prisma = new PrismaClient();

export default prisma;
