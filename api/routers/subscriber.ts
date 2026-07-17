import { z } from "zod";
import { desc, eq, sql } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { subscribers } from "@db/schema";

export const subscriberRouter = createRouter({
  subscribe: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        firstName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      try {
        await db.insert(subscribers).values({
          email: input.email,
          firstName: input.firstName,
        });
        return { success: true, message: "Subscribed successfully" };
      } catch {
        await db
          .update(subscribers)
          .set({ isActive: true })
          .where(eq(subscribers.email, input.email));
        return { success: true, message: "Resubscribed successfully" };
      }
    }),

  unsubscribe: publicQuery
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(subscribers)
        .set({ isActive: false })
        .where(eq(subscribers.email, input.email));
      return { success: true };
    }),

  list: adminQuery
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(50),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page || 1;
      const limit = input?.limit || 50;
      const offset = (page - 1) * limit;

      const items = await db
        .select()
        .from(subscribers)
        .orderBy(desc(subscribers.createdAt))
        .limit(limit)
        .offset(offset);

      const countResult = await db.select({ count: sql<number>`count(*)::int` }).from(subscribers);
      return { items, total: countResult[0]?.count || 0 };
    }),
});
