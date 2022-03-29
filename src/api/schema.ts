import { resolvers } from "@generated/type-graphql";
import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";

/**
 * Builds a GraphQL schema from the auto generated resolvers.
 * @returns The GraphQL schema
 */
export async function schema(): Promise<GraphQLSchema> {
    return buildSchema({
        resolvers,
        validate: false
    });
}