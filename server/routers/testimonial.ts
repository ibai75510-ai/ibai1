import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { testimonials } from "@db/schema";

export const testimonialRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        featured: z.boolean().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      let query = db.select().from(testimonials);
      if (input?.featured) {
        query = query.where(eq(testimonials.isFeatured, true)) as typeof query;
      }
      const items = await query.orderBy(desc(testimonials.createdAt));
      return { items };
    }),

  create: adminQuery
    .input(
      z.object({
        authorName: z.string().min(1),
        authorTitle: z.string().optional(),
        authorInstitution: z.string().optional(),
        content: z.string().min(1),
        rating: z.number().min(1).max(5).default(5),
        isFeatured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(testimonials).values(input).returning({ id: testimonials.id });
      return { success: true, id: result[0].id };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(testimonials).where(eq(testimonials.id, input.id));
      return { success: true };
    }),
});
