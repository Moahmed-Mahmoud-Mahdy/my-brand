import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaInstance: PrismaClient

const url = process.env.TURSO_DATABASE_URL
const token = process.env.TURSO_AUTH_TOKEN

if (url && url !== 'undefined' && token && token !== 'undefined') {
  const adapter = new PrismaLibSql({
    url: url,
    authToken: token,
  })
  prismaInstance = new PrismaClient({ adapter, log: ['query'] })
} else {
  prismaInstance = new PrismaClient({
    log: ['query'],
  })
}

export const db = globalForPrisma.prisma ?? prismaInstance

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db