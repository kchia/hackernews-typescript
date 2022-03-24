import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

// tell Apollo Server which API operations to support in the GraphQL API
import { schema } from "./schema";
import { context } from "./context";

export const server = new ApolloServer({
  schema,
  context,
  introspection: true, // so you can ask the GraphQL server what queries it supports; don't typically do in prod
  plugins: [ApolloServerPluginLandingPageLocalDefault()], // enable Apollo sandbox; dont typically do in prod
});

const port = process.env.PORT || 3000;
server.listen({ port }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
