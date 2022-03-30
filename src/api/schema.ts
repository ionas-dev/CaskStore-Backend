import { FindUniqueCaskResolver, FindFirstCaskResolver, FindManyCaskResolver, CaskRelationsResolver } from "@generated/type-graphql";
import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { CustomCaskResolver } from "./CustomCaskResolver";

/**
 * Builds a GraphQL schema from the auto generated resolvers.
 * @returns The GraphQL schema
 */
export async function schema(): Promise<GraphQLSchema> {
    return buildSchema({
        resolvers: [
            FindManyCaskResolver,
            FindFirstCaskResolver,
            FindUniqueCaskResolver,
            CaskRelationsResolver,
            CustomCaskResolver
        ],
        validate: false
    });
}