import { PrismaClient } from '../../prisma/generated/client'
const prisma = new PrismaClient()

type GraphQLContext = {
  prisma: PrismaClient
}

/**
 * Creates a context object for the GraphQL server.
 * 
 * @returns The GraphQL context
 */
export default async function createContext(): Promise<GraphQLContext> {
  return {
    prisma
  }
}