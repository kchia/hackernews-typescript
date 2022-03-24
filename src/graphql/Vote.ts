import { objectType, extendType, nonNull, intArg } from "nexus";

export const Vote = objectType({
  name: "Vote",
  definition(t) {
    t.nonNull.field("link", { type: "Link" });
    t.nonNull.field("user", { type: "User" });
  },
});

export const VoteMutation = extendType({
  // return an instance of Vote type
  type: "Mutation",
  definition(t) {
    t.field("vote", {
      type: "Vote",
      args: {
        linkId: nonNull(intArg()), // identifies the link being voted on
      },
      async resolve(parent, args, context) {
        const { userId } = context;
        const { linkId } = args;

        if (!userId) {
          throw new Error("Cannot vote without logging in.");
        }

        // The voters field for the link needs to be updated with a new user.
        const link = await context.prisma.link.update({
          where: {
            id: linkId, // specifies which link to update,
          },
          data: {
            // specifies the update payload
            voters: {
              connect: {
                // attach new user to the many-to-many relation of the voters field
                id: userId,
              },
            },
          },
        });

        const user = await context.prisma.user.findUnique({
          where: { id: userId },
        });

        return {
          link,
          user: user as User,
        };
      },
    });
  },
});
