import { asNexusMethod } from "nexus";
import { GraphQLDateTime } from "graphql-scalars"; // pre-built custom scalar from the graphql-scalars library. It uses the ISO-8601 specification, which is also used by Prisma for its own DateTime type.

export const GQLDate = asNexusMethod(GraphQLDateTime, "dateTime"); // expose a custom scalar as a Nexus type. It takes two arguments: A custom scalar and the name for the Nexus type.
