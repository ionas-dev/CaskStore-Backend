import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export type GraphQLContext = {
  prisma: PrismaClient
}

/**
 * Creates a context object for the GraphQL server.
 * 
 * @returns The GraphQL context
 */
export async function createContext(): Promise<GraphQLContext> {
  return {
    prisma
  }
}