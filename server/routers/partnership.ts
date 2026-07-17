import { z } from "zod";
import { desc, eq, sql } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { partnerships, organizations } from "@db/schema";
import { uniqueSlug } from "../lib/slug";

const orgTypeByPartnershipType: Record<string, "institute" | "university" | "organization" | "lab" | "research_group" | "journal" | "partner"> = {
  institutional: "institute",
  industry: "partner",
  government: "organization",
  ngo: "organization",
  startup: "partner",
};

export const partnershipRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        organizationName: z.string().min(1),
        contactName: z.string().optional(),
        email: z.string().email(),
        partnershipType: z.enum(["institutional", "industry", "government", "ngo", "startup"]),
        description: z.string().optional(),
        website: z.string().optional(),
        logoUrl: z.string().optional(),
        country: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(partnerships).values(input).returning({ id: partnerships.id });
      return { success: true, id: result[0].id };
    }),

  list: adminQuery
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        status: z.enum(["pending", "approved", "rejected", "active"]).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page || 1;
      const limit = input?.limit || 20;
      const offset = (page - 1) * limit;

      let query = db.select().from(partnerships);
      if (input?.status) {
        query = query.where(eq(partnerships.status, input.status)) as typeof query;
      }

      const items = await query.orderBy(desc(partnerships.createdAt)).limit(limit).offset(offset);
      const countResult = await db.select({ count: sql<number>`count(*)::int` }).from(partnerships);
      return { items, total: countResult[0]?.count || 0, page, limit };
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "approved", "rejected", "active"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(partnerships)
        .set({ status: input.status })
        .where(eq(partnerships.id, input.id));
      return { success: true };
    }),

  promoteToNetwork: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const rows = await db.select().from(partnerships).where(eq(partnerships.id, input.id)).limit(1);
      const partner = rows[0];
      if (!partner) throw new Error("Partnership not found");

      const slug = await uniqueSlug(partner.organizationName, async (candidate) => {
        const existing = await db.select({ id: organizations.id }).from(organizations).where(eq(organizations.slug, candidate)).limit(1);
        return existing.length > 0;
      });

      const result = await db
        .insert(organizations)
        .values({
          name: partner.organizationName,
          slug,
          logoUrl: partner.logoUrl,
          description: partner.description,
          website: partner.website,
          type: orgTypeByPartnershipType[partner.partnershipType] ?? "organization",
          recognitionStatus: "recognized",
        })
        .returning({ id: organizations.id });

      await db.update(partnerships).set({ status: "active" }).where(eq(partnerships.id, input.id));

      return { success: true, organizationId: result[0].id };
    }),
});
