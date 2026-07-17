import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { createRouter, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import {
  users,
  contacts,
  subscribers,
  researchArticles,
  news,
  events,
  researchers,
  partnerships,
  organizations,
  paperSubmissions,
  testimonials,
} from "@db/schema";

export const adminRouter = createRouter({
  stats: adminQuery.query(async () => {
    const db = getDb();
    const [userCount] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
    const [contactCount] = await db.select({ count: sql<number>`count(*)::int` }).from(contacts);
    const [subscriberCount] = await db.select({ count: sql<number>`count(*)::int` }).from(subscribers);
    const [researchArticleCount] = await db.select({ count: sql<number>`count(*)::int` }).from(researchArticles);
    const [newsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(news);
    const [eventCount] = await db.select({ count: sql<number>`count(*)::int` }).from(events);
    const [researcherCount] = await db.select({ count: sql<number>`count(*)::int` }).from(researchers);
    const [partnershipCount] = await db.select({ count: sql<number>`count(*)::int` }).from(partnerships);
    const [organizationCount] = await db.select({ count: sql<number>`count(*)::int` }).from(organizations);
    const [paperSubmissionCount] = await db.select({ count: sql<number>`count(*)::int` }).from(paperSubmissions);
    const [testimonialCount] = await db.select({ count: sql<number>`count(*)::int` }).from(testimonials);

    return {
      totalUsers: userCount?.count || 0,
      contacts: contactCount?.count || 0,
      subscribers: subscriberCount?.count || 0,
      researchArticles: researchArticleCount?.count || 0,
      news: newsCount?.count || 0,
      events: eventCount?.count || 0,
      researchers: researcherCount?.count || 0,
      partnerships: partnershipCount?.count || 0,
      organizations: organizationCount?.count || 0,
      paperSubmissions: paperSubmissionCount?.count || 0,
      testimonials: testimonialCount?.count || 0,
    };
  }),

  users: adminQuery
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page || 1;
      const limit = input?.limit || 20;

      const items = await db
        .select({
          id: users.id,
          username: users.username,
          name: users.displayName,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt,
        })
        .from(users)
        .limit(limit)
        .offset((page - 1) * limit);

      return { items };
    }),

  updateUserRole: adminQuery
    .input(
      z.object({
        id: z.number(),
        role: z.enum(["user", "admin"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(users).set({ role: input.role }).where(eq(users.id, input.id));
      return { success: true };
    }),
});
