import { z } from "zod";
import { desc, eq, sql } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { researchers } from "@db/schema";

export const researcherRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        featured: z.boolean().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page || 1;
      const limit = input?.limit || 20;
      const offset = (page - 1) * limit;

      let query = db.select().from(researchers);
      if (input?.featured) {
        query = query.where(eq(researchers.isFeatured, true)) as typeof query;
      }

      const items = await query.orderBy(desc(researchers.createdAt)).limit(limit).offset(offset);
      const countResult = await db.select({ count: sql<number>`count(*)::int` }).from(researchers);
      return { items, total: countResult[0]?.count || 0, page, limit };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const items = await db
        .select()
        .from(researchers)
        .where(eq(researchers.id, input.id))
        .limit(1);
      return items[0] || null;
    }),

  create: adminQuery
    .input(
      z.object({
        fullName: z.string().min(1),
        title: z.string().optional(),
        institution: z.string().optional(),
        country: z.string().optional(),
        bio: z.string().optional(),
        researchAreas: z.string().optional(),
        email: z.string().optional(),
        website: z.string().optional(),
        profileImage: z.string().optional(),
        publications: z.number().default(0),
        citations: z.number().default(0),
        isFeatured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(researchers).values(input).returning({ id: researchers.id });
      return { success: true, id: result[0].id };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        fullName: z.string().optional(),
        title: z.string().optional(),
        institution: z.string().optional(),
        country: z.string().optional(),
        bio: z.string().optional(),
        researchAreas: z.string().optional(),
        email: z.string().optional(),
        website: z.string().optional(),
        profileImage: z.string().optional(),
        publications: z.number().optional(),
        citations: z.number().optional(),
        isFeatured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(researchers).set(data).where(eq(researchers.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(researchers).where(eq(researchers.id, input.id));
      return { success: true };
    }),
});
