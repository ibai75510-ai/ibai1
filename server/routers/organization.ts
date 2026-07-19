import { z } from "zod";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { organizations, type Organization } from "@db/schema";
import { uniqueSlug } from "../lib/slug";
import { generateRecognitionCode } from "../lib/recognitionCode";

const typeEnum = z.enum(["institute", "university", "organization", "lab", "research_group", "journal", "partner"]);
const recognitionEnum = z.enum(["recognized", "partner", "affiliated"]);

// Orgs created before recognitionCode existed have a null code — assign one lazily,
// the first time such a row is read, instead of requiring a one-off migration script.
async function backfillRecognitionCode(org: Organization): Promise<Organization> {
  const db = getDb();
  const recognitionCode = generateRecognitionCode(org.type, org.id);
  await db.update(organizations).set({ recognitionCode }).where(eq(organizations.id, org.id));
  return { ...org, recognitionCode };
}

async function backfillMissingCodes(items: Organization[]): Promise<Organization[]> {
  return Promise.all(items.map((item) => (item.recognitionCode ? item : backfillRecognitionCode(item))));
}

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
      const rawItems = await (conditions.length ? query.where(and(...conditions)) : query)
        .orderBy(desc(organizations.isFeatured), desc(organizations.createdAt))
        .limit(limit)
        .offset(offset);
      const items = await backfillMissingCodes(rawItems);

      const countQuery = db.select({ count: sql<number>`count(*)::int` }).from(organizations);
      const [countResult] = await (conditions.length ? countQuery.where(and(...conditions)) : countQuery);

      return { items, total: countResult?.count || 0, page, limit };
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const items = await db.select().from(organizations).where(eq(organizations.slug, input.slug)).limit(1);
      const org = items[0];
      if (!org) return null;
      return org.recognitionCode ? org : await backfillRecognitionCode(org);
    }),

  // Public lookup used by /verify — anyone can confirm an institute's recognition
  // status by exact code or by searching its name, without needing to know the slug.
  verify: publicQuery
    .input(z.object({ query: z.string().min(1).max(255) }))
    .query(async ({ input }) => {
      const db = getDb();
      const query = input.query.trim();
      if (!query) return { exact: null, matches: [] };

      const exactRows = await db
        .select()
        .from(organizations)
        .where(or(sql`lower(${organizations.recognitionCode}) = lower(${query})`, eq(organizations.slug, query)))
        .limit(1);
      const exactRow = exactRows[0];
      const exact = exactRow ? (exactRow.recognitionCode ? exactRow : await backfillRecognitionCode(exactRow)) : null;

      const matchRows = await db
        .select()
        .from(organizations)
        .where(ilike(organizations.name, `%${query}%`))
        .orderBy(desc(organizations.isFeatured), organizations.name)
        .limit(10);
      const matches = await backfillMissingCodes(matchRows.filter((m) => m.id !== exact?.id));

      return { exact, matches };
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
      const id = result[0].id;
      const recognitionCode = generateRecognitionCode(input.type, id);
      await db.update(organizations).set({ recognitionCode }).where(eq(organizations.id, id));
      return { success: true, id, recognitionCode };
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
