import { makeSchema } from "nexus";
import { join } from "path";
import * as types from "./graphql";

export const schema = makeSchema({
  types, // types for your GraphQL schema
  outputs: {
    schema: join(process.cwd(), "schema.graphql"), // Nexus will generate the SDL from the types passed in
    typegen: join(process.cwd(), "nexus-typegen.ts"), // TypeScript type definitions for all types in GraphQL schema, keeps GraphQL schema definition in sync with schema implementation, don't have to worry about GraphQL types and TypeScript types going out of sync
  },
  contextType: {
    module: join(process.cwd(), "./src/context.ts"),
    export: "Context",
  },
});
