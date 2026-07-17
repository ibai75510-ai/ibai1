import { z } from "zod";
import { and, desc, eq, sql } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { news } from "@db/schema";

const categoryEnum = z.enum(["research", "industry", "events", "policy", "funding", "announcement"]);

export const newsRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        category: categoryEnum.optional(),
        featured: z.boolean().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page || 1;
      const limit = input?.limit || 10;
      const offset = (page - 1) * limit;

      const conditions = [eq(news.status, "published")];
      if (input?.category) conditions.push(eq(news.category, input.category));
      if (input?.featured) conditions.push(eq(news.isFeatured, true));

      const items = await db
        .select()
        .from(news)
        .where(and(...conditions))
        .orderBy(desc(news.publishedAt))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db.select({ count: sql<number>`count(*)::int` }).from(news).where(and(...conditions));
      return { items, total: countResult?.count || 0, page, limit };
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const items = await db
        .select()
        .from(news)
        .where(and(eq(news.slug, input.slug), eq(news.status, "published")))
        .limit(1);
      return items[0] || null;
    }),

  adminList: adminQuery
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        status: z.enum(["draft", "published"]).optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page || 1;
      const limit = input?.limit || 20;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (input?.status) conditions.push(eq(news.status, input.status));
      if (input?.search) conditions.push(sql`${news.title} ilike ${"%" + input.search + "%"}`);

      const query = db.select().from(news);
      const items = await (conditions.length ? query.where(and(...conditions)) : query)
        .orderBy(desc(news.createdAt))
        .limit(limit)
        .offset(offset);

      const countQuery = db.select({ count: sql<number>`count(*)::int` }).from(news);
      const [countResult] = await (conditions.length ? countQuery.where(and(...conditions)) : countQuery);

      return { items, total: countResult?.count || 0, page, limit };
    }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        excerpt: z.string().optional(),
        content: z.string().min(1),
        coverImage: z.string().optional(),
        category: categoryEnum.default("announcement"),
        status: z.enum(["draft", "published"]).default("draft"),
        author: z.string().optional(),
        isFeatured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(news).values(input).returning({ id: news.id });
      return { success: true, id: result[0].id };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        coverImage: z.string().optional(),
        category: categoryEnum.optional(),
        status: z.enum(["draft", "published"]).optional(),
        author: z.string().optional(),
        isFeatured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(news).set(data).where(eq(news.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(news).where(eq(news.id, input.id));
      return { success: true };
    }),
});
