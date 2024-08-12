import { PrismaClient } from '@prisma/client';

// Extend the global object to include the prisma property
declare global {
  var prisma: PrismaClient | undefined;
}

// Use a conditional declaration to avoid redeclaring prisma
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
