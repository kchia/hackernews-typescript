import {
  extendType,
  nonNull,
  objectType,
  stringArg,
  intArg,
  inputObjectType,
  enumType,
  arg,
  list,
} from "nexus";
import { Prisma } from "@prisma/client";

import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
  // used to create a new type in your GraphQL schema
  name: "Link", // define the name of the type
  definition(t) {
    // add fields to the type
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
    t.nonNull.dateTime("createdAt"); // This field will get resolved automatically during queries as the Link model inside Prisma already has a createdAt field.
    t.field("postedBy", {
      // optional field
      type: "User",
      resolve(parent, args, context) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .postedBy();
      },
    });
    t.nonNull.list.nonNull.field("voters", {
      type: "User",
      resolve(parent, args, context) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .voters();
      },
    });
  },
});

// // Use the Link interface generated by Nexus to define the type of
// // the links variable as an array of Link objects.
// let links: NexusGenObjects["Link"][] = [
//   {
//     id: 1,
//     url: "www.howtographql.com",
//     description: "Fullstack tutorial for GraphQL",
//   },
//   {
//     id: 2,
//     url: "graphql.org",
//     description: "GraphQL official website",
//   },
// ];

export const LinkQuery = extendType({
  // extend the Query root type and add a new root field called feed
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      // define the return type of the feed query as a not nullable instance of the Feed type
      type: "Feed", //
      // resolve(parent, args, context, info) {
      //   // resolver function
      //   // the GraphQL server invokes all resolver functions for the fields that are contained in a query and then packages the response according to the query’s shape.
      //   return context.prisma.link.findMany();
      // },
      args: {
        filter: stringArg(),
        skip: intArg(), // the start index
        take: intArg(), // how many items to collect past skip index
        orderBy: arg({ type: list(nonNull(LinkOrderByInput)) }), // an array of input type LinkOrderByInput that defines createdAt, description, and url as the sorting criteria e.g., orderBy: [{ url: asc }, { createdAt: desc }]
      },
      async resolve(parent, { filter }, context) {
        const where = filter
          ? {
              OR: [
                { description: { contains: filter } },
                { url: { contains: filter } },
              ],
            }
          : {};

        const links = await context.prisma.link.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput>
            | undefined,
        });

        const count = await context.prisma.link.count({ where }); // return the number of records in the database that match the current filtering condition

        return {
          // the returned object should match the signature of the Feed type
          links,
          count,
        };
      },
    });
  },
});

/** 

query {
  feed {
    id
    url
    description
  }
}

Each level of nesting corresponds to one resolver execution level. The above query therefore has two of these execution levels. On the first level, it invokes the feed resolver and returns the entire data stored in links. For the second execution level, the GraphQL server is smart enough to invoke the resolvers of the Link type (because thanks to the schema, it knows that feed returns a list/array of Link elements) for each element inside the list that was returned on the previous resolver level.
*/

export const LinkMutation = extendType({
  // add a new root field to the Mutation type
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      // the mutation returns a non-nullable Link object
      type: "Link",
      args: {
        // pass arguments to your mutation
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },

      resolve(parent, args, context) {
        const { description, url } = args;
        const { userId } = context;

        if (!userId) {
          throw new Error("Cannot post without logging in.");
        }

        const newLink = context.prisma.link.create({
          data: {
            description,
            url,
            postedBy: { connect: { id: userId } }, // the connect operator is used by Prisma to specify which user the newly created link should be associated with
          },
        });

        return newLink;
      },
    });
  },
});

export const LinkOrderByInput = inputObjectType({
  name: "LinkOrderByInput",
  definition(t) {
    t.field("description", { type: Sort });
    t.field("url", { type: Sort });
    t.field("createdAt", { type: Sort });
  },
});

export const Sort = enumType({
  name: "Sort",
  members: ["asc", "desc"],
});

// used as the return type of the feed query
export const Feed = objectType({
  name: "Feed",
  definition(t) {
    t.nonNull.list.nonNull.field("links", { type: Link });
    t.nonNull.int("count"); // numbers of links available in the database
  },
});