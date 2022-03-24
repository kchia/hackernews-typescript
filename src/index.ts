import { ApolloServer } from "apollo-server";

// tell Apollo Server which API operations to support in the GraphQL API
import { schema } from "./schema";
import { context } from "./context";

export const server = new ApolloServer({
  schema,
  context,
});

const port = 3000;
server.listen({ port }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
