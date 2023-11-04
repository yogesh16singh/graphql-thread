import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
export const prismaClient = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });