import { z } from "zod";
import { and, desc, eq, sql } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { events } from "@db/schema";

const eventTypeEnum = z.enum(["conference", "workshop", "webinar", "summit", "symposium", "networking"]);
const statusEnum = z.enum(["upcoming", "ongoing", "past", "cancelled"]);

export const eventRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        status: statusEnum.optional(),
        eventType: eventTypeEnum.optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page || 1;
      const limit = input?.limit || 10;
      const offset = (page - 1) * limit;

      const conditions = [eq(events.publishStatus, "published")];
      if (input?.status) conditions.push(eq(events.status, input.status));
      if (input?.eventType) conditions.push(eq(events.eventType, input.eventType));

      const items = await db
        .select()
        .from(events)
        .where(and(...conditions))
        .orderBy(desc(events.startDate))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db.select({ count: sql<number>`count(*)::int` }).from(events).where(and(...conditions));
      return { items, total: countResult?.count || 0, page, limit };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const items = await db
        .select()
        .from(events)
        .where(and(eq(events.id, input.id), eq(events.publishStatus, "published")))
        .limit(1);
      return items[0] || null;
    }),

  adminList: adminQuery
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        publishStatus: z.enum(["draft", "published"]).optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page || 1;
      const limit = input?.limit || 20;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (input?.publishStatus) conditions.push(eq(events.publishStatus, input.publishStatus));
      if (input?.search) conditions.push(sql`${events.title} ilike ${"%" + input.search + "%"}`);

      const query = db.select().from(events);
      const items = await (conditions.length ? query.where(and(...conditions)) : query)
        .orderBy(desc(events.createdAt))
        .limit(limit)
        .offset(offset);

      const countQuery = db.select({ count: sql<number>`count(*)::int` }).from(events);
      const [countResult] = await (conditions.length ? countQuery.where(and(...conditions)) : countQuery);

      return { items, total: countResult?.count || 0, page, limit };
    }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        eventType: eventTypeEnum.default("conference"),
        startDate: z.string(),
        endDate: z.string().optional(),
        location: z.string().optional(),
        isVirtual: z.boolean().default(false),
        registrationUrl: z.string().optional(),
        coverImage: z.string().optional(),
        publishStatus: z.enum(["draft", "published"]).default("draft"),
        maxAttendees: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const values = {
        ...input,
        startDate: new Date(input.startDate),
        endDate: input.endDate ? new Date(input.endDate) : undefined,
      };
      const result = await db.insert(events).values(values).returning({ id: events.id });
      return { success: true, id: result[0].id };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        eventType: eventTypeEnum.optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        location: z.string().optional(),
        isVirtual: z.boolean().optional(),
        registrationUrl: z.string().optional(),
        coverImage: z.string().optional(),
        status: statusEnum.optional(),
        publishStatus: z.enum(["draft", "published"]).optional(),
        maxAttendees: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const values: Record<string, unknown> = { ...data };
      if (data.startDate) values.startDate = new Date(data.startDate);
      if (data.endDate) values.endDate = new Date(data.endDate);
      await db.update(events).set(values).where(eq(events.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(events).where(eq(events.id, input.id));
      return { success: true };
    }),
});
