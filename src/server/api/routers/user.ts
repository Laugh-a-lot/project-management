import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const userUpdateSchema = z.object({
  name: z.string(),
  image: z.string(),
});
export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    return user;
  }),
  updateDetails: protectedProcedure
    .input(userUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: userUpdateSchema.parse(input),
      });
      return user;
    }),
  getAllUser: protectedProcedure.query(async ({ ctx, input }) => {
    const getAllUser = await ctx.db.user.findMany();
    return getAllUser;
  }),
});
