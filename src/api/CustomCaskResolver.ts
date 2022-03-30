import "reflect-metadata";
import { Resolver, Query, Arg }  from "type-graphql";
import { Cask } from "@generated/type-graphql";
import { getCask } from "../controller/caskController";

/**
 * Custom resolver for the Cask entity. This resolver is used to get a Cask by its name. 
 * If the cask isn't found in the database, the cask will be fetched by the brew api.
 */
@Resolver()
export class CustomCaskResolver {
  @Query(() => Cask, { nullable: true })
  async cask(@Arg("title") title: string): Promise<Cask | null> {
    return await getCask(title);
  }
}