import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
  interface Window {
    prisma: PrismaClient;
  }
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!window.prisma) {
    window.prisma = new PrismaClient();
  }
  prisma = window.prisma;
}

export default prisma;
