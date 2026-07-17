import { z } from "zod";
import { desc, eq, sql } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { contacts } from "@db/schema";

export const contactRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        firstName: z.string().min(1).max(255),
        lastName: z.string().min(1).max(255),
        email: z.string().email(),
        organization: z.string().optional(),
        subject: z.string().min(1).max(255),
        message: z.string().min(1),
        type: z.enum([
          "general",
          "collaboration",
          "research_partnership",
          "publication_support",
          "recognition_request",
          "technical_support",
          "paper_submission",
        ]).default("general"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(contacts).values(input).returning({ id: contacts.id });
      return { success: true, id: result[0].id };
    }),

  list: adminQuery
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        status: z.enum(["new", "read", "replied", "archived"]).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page || 1;
      const limit = input?.limit || 20;
      const offset = (page - 1) * limit;

      let query = db.select().from(contacts);
      if (input?.status) {
        query = query.where(eq(contacts.status, input.status)) as typeof query;
      }

      const items = await query.orderBy(desc(contacts.createdAt)).limit(limit).offset(offset);
      const countResult = await db.select({ count: sql<number>`count(*)::int` }).from(contacts);
      const total = countResult[0]?.count || 0;

      return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "read", "replied", "archived"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(contacts)
        .set({ status: input.status })
        .where(eq(contacts.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(contacts).where(eq(contacts.id, input.id));
      return { success: true };
    }),

  stats: adminQuery.query(async () => {
    const db = getDb();
    const total = await db.select({ count: sql<number>`count(*)::int` }).from(contacts);
    const new_count = await db.select({ count: sql<number>`count(*)::int` }).from(contacts).where(eq(contacts.status, "new"));
    return { total: total[0]?.count || 0, new: new_count[0]?.count || 0 };
  }),
});
