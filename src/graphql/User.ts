import { objectType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.list.nonNull.field("links", {
      // an array of all the links posted by the user
      type: "Link",
      // need to explicitly define the links resolver since it's non-trivial
      resolve(parent, args, context) {
        // parent contains all the fields of user
        return context.prisma.user // 3
          .findUnique({ where: { id: parent.id } })
          .links();
      },
    });
    t.nonNull.list.nonNull.field("votes", {
      type: "Link",
      resolve(parent, args, context) {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .votes();
      },
    });
  },
});
