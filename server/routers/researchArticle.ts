import { z } from "zod";
import { and, desc, eq, ne, sql } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { researchArticles } from "@db/schema";
import { uniqueSlug } from "../lib/slug";

const categoryEnum = z.enum(["genomics", "bioinformatics", "biotechnology", "clinical_trials", "ai_life_sciences", "synthetic_biology", "cell_biology", "structural_biology", "other"]);

export const researchArticleRouter = createRouter({
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

      const conditions = [eq(researchArticles.status, "published")];
      if (input?.category) conditions.push(eq(researchArticles.category, input.category));
      if (input?.featured) conditions.push(eq(researchArticles.isFeatured, true));

      // Single round-trip: selects only the columns the list cards actually
      // render (skipping the heavy content/abstract/references text) and
      // gets the total count via a window function instead of a second
      // query, which matters a lot on a high-latency DB connection.
      const rows = await db
        .select({
          id: researchArticles.id,
          slug: researchArticles.slug,
          title: researchArticles.title,
          authors: researchArticles.authors,
          journal: researchArticles.journal,
          category: researchArticles.category,
          publishDate: researchArticles.publishDate,
          downloadCount: researchArticles.downloadCount,
          total: sql<number>`count(*) over()::int`,
        })
        .from(researchArticles)
        .where(and(...conditions))
        .orderBy(desc(researchArticles.createdAt))
        .limit(limit)
        .offset(offset);

      const total = rows[0]?.total ?? 0;
      const items = rows.map(({ total: _total, ...rest }) => rest);

      return { items, total, page, limit };
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const items = await db
        .select()
        .from(researchArticles)
        .where(and(eq(researchArticles.slug, input.slug), eq(researchArticles.status, "published")))
        .limit(1);
      return items[0] || null;
    }),

  getRelated: publicQuery
    .input(z.object({ id: z.number(), category: categoryEnum, limit: z.number().default(3) }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(researchArticles)
        .where(
          and(
            eq(researchArticles.category, input.category),
            eq(researchArticles.status, "published"),
            ne(researchArticles.id, input.id)
          )
        )
        .orderBy(desc(researchArticles.createdAt))
        .limit(input.limit);
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
      if (input?.status) conditions.push(eq(researchArticles.status, input.status));
      if (input?.search) conditions.push(sql`${researchArticles.title} ilike ${"%" + input.search + "%"}`);

      const query = db.select().from(researchArticles);
      const itemsQuery = (conditions.length ? query.where(and(...conditions)) : query)
        .orderBy(desc(researchArticles.createdAt))
        .limit(limit)
        .offset(offset);

      const countQuery = db.select({ count: sql<number>`count(*)::int` }).from(researchArticles);
      const countQueryFinal = conditions.length ? countQuery.where(and(...conditions)) : countQuery;

      const [items, [countResult]] = await Promise.all([itemsQuery, countQueryFinal]);

      return { items, total: countResult?.count || 0, page, limit };
    }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(1),
        authors: z.string().min(1),
        abstract: z.string().optional(),
        content: z.string().optional(),
        references: z.string().optional(),
        journal: z.string().optional(),
        doi: z.string().optional(),
        publishDate: z.string().optional(),
        category: categoryEnum.default("other"),
        status: z.enum(["draft", "published"]).default("draft"),
        pdfUrl: z.string().optional(),
        coverImage: z.string().optional(),
        isFeatured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const slug = await uniqueSlug(input.title, async (candidate) => {
        const rows = await db.select({ id: researchArticles.id }).from(researchArticles).where(eq(researchArticles.slug, candidate)).limit(1);
        return rows.length > 0;
      });
      const result = await db
        .insert(researchArticles)
        .values({ ...input, slug })
        .returning({ id: researchArticles.id, slug: researchArticles.slug });
      return { success: true, id: result[0].id, slug: result[0].slug };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        authors: z.string().optional(),
        abstract: z.string().optional(),
        content: z.string().optional(),
        references: z.string().optional(),
        journal: z.string().optional(),
        doi: z.string().optional(),
        publishDate: z.string().optional(),
        category: categoryEnum.optional(),
        status: z.enum(["draft", "published"]).optional(),
        pdfUrl: z.string().optional(),
        coverImage: z.string().optional(),
        isFeatured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(researchArticles).set(data).where(eq(researchArticles.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(researchArticles).where(eq(researchArticles.id, input.id));
      return { success: true };
    }),
});
