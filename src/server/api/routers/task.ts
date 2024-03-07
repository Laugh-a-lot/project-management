import { string, union, z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const taskSchema = z.object({
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  tags: z.array(z.string()),
  assignedTo: z.array(z.string()),
});

const taskUpdateSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  tags: z.array(z.string()),
  assignedTo: z.array(z.string()),
});
export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(taskSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          title: input.title,
          description: input.description,
          due_date: input.dueDate,
          priority: input.priority,
          tags: input.tags,
          assigned_to: {
            connect: input.assignedTo.map((id) => ({
              id,
            })),
          },
          created_by: {
            connect: { email: ctx.session.user.email },
          },
        },
      });
    }),
  updateTask: protectedProcedure
    .input(taskUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description,
          due_date: input.dueDate,
          priority: input.priority,
          tags: input.tags,
          assigned_to: {
            connect: input.assignedTo.map((id) => ({
              id,
            })),
          },
          created_by: {
            connect: { email: ctx.session.user.email },
          },
        },
      });
    }),
  getAssignedTask: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.task.findMany({
      where: {
        assigned_to: {
          some: {
            id: ctx.session.user.id,
          },
        },
      },
      include: {
        assigned_to: {
          select: {
            email: true,
            image: true,
            name: true,
          },
        },
      },
    });
  }),
  getTaskByUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.task.findMany({
      where: {
        created_by_id: ctx.session.user.id,
      },
      include: {
        assigned_to: {
          select: {
            email: true,
            image: true,
            name: true,
          },
        },
      },
    });
  }),
});
