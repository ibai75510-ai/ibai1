import { z } from "zod";
import { and, desc, eq, sql } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { organizations } from "@db/schema";
import { uniqueSlug } from "../lib/slug";

const typeEnum = z.enum(["institute", "university", "organization", "lab", "research_group", "journal", "partner"]);
const recognitionEnum = z.enum(["recognized", "partner", "affiliated"]);

export const organizationRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(50),
        type: typeEnum.optional(),
        featured: z.boolean().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page || 1;
      const limit = input?.limit || 50;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (input?.type) conditions.push(eq(organizations.type, input.type));
      if (input?.featured) conditions.push(eq(organizations.isFeatured, true));

      const query = db.select().from(organizations);
      const items = await (conditions.length ? query.where(and(...conditions)) : query)
        .orderBy(desc(organizations.isFeatured), desc(organizations.createdAt))
        .limit(limit)
        .offset(offset);

      const countQuery = db.select({ count: sql<number>`count(*)::int` }).from(organizations);
      const [countResult] = await (conditions.length ? countQuery.where(and(...conditions)) : countQuery);

      return { items, total: countResult?.count || 0, page, limit };
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const items = await db.select().from(organizations).where(eq(organizations.slug, input.slug)).limit(1);
      return items[0] || null;
    }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        logoUrl: z.string().optional(),
        description: z.string().optional(),
        website: z.string().optional(),
        type: typeEnum.default("organization"),
        collaborationDetails: z.string().optional(),
        recognitionStatus: recognitionEnum.default("affiliated"),
        isFeatured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const slug = await uniqueSlug(input.name, async (candidate) => {
        const rows = await db.select({ id: organizations.id }).from(organizations).where(eq(organizations.slug, candidate)).limit(1);
        return rows.length > 0;
      });
      const result = await db
        .insert(organizations)
        .values({ ...input, slug })
        .returning({ id: organizations.id });
      return { success: true, id: result[0].id };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        logoUrl: z.string().optional(),
        description: z.string().optional(),
        website: z.string().optional(),
        type: typeEnum.optional(),
        collaborationDetails: z.string().optional(),
        recognitionStatus: recognitionEnum.optional(),
        isFeatured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(organizations).set(data).where(eq(organizations.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(organizations).where(eq(organizations.id, input.id));
      return { success: true };
    }),
});
