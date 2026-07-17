import { z } from "zod";
import { desc, eq, sql } from "drizzle-orm";
import { createRouter, publicQuery, authedQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { paperSubmissions } from "@db/schema";
import { uploadFile } from "../lib/storage";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15MB

export const paperSubmissionRouter = createRouter({
  uploadFile: publicQuery
    .input(
      z.object({
        filename: z.string().min(1),
        mimeType: z.string().optional(),
        base64Data: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.base64Data, "base64");
      if (buffer.byteLength > MAX_UPLOAD_BYTES) {
        throw new Error("File exceeds the 15MB upload limit");
      }
      const path = `submissions/${Date.now()}-${input.filename}`;
      const url = await uploadFile(path, buffer, input.mimeType);
      return { url };
    }),

  submit: publicQuery
    .input(
      z.object({
        authorName: z.string().min(1),
        affiliation: z.string().optional(),
        email: z.string().email(),
        title: z.string().min(1),
        abstract: z.string().min(1),
        keywords: z.string().optional(),
        manuscriptUrl: z.string().min(1),
        supportingFileUrls: z.array(z.string()).optional(),
        coverLetter: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const { supportingFileUrls, ...rest } = input;
      const result = await db
        .insert(paperSubmissions)
        .values({
          ...rest,
          supportingFileUrls: supportingFileUrls ? JSON.stringify(supportingFileUrls) : undefined,
          userId: ctx.user?.id,
        })
        .returning({ id: paperSubmissions.id });
      return { success: true, id: result[0].id };
    }),

  getMine: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(paperSubmissions)
      .where(eq(paperSubmissions.userId, ctx.user.id))
      .orderBy(desc(paperSubmissions.submittedAt));
  }),

  list: adminQuery
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        status: z.enum(["pending", "under_review", "accepted", "rejected", "published"]).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page || 1;
      const limit = input?.limit || 20;
      const offset = (page - 1) * limit;

      let query = db.select().from(paperSubmissions);
      if (input?.status) {
        query = query.where(eq(paperSubmissions.status, input.status)) as typeof query;
      }

      const items = await query.orderBy(desc(paperSubmissions.submittedAt)).limit(limit).offset(offset);
      const countResult = await db.select({ count: sql<number>`count(*)::int` }).from(paperSubmissions);
      return { items, total: countResult[0]?.count || 0, page, limit };
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "under_review", "accepted", "rejected", "published"]),
        adminNotes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(paperSubmissions)
        .set({ status: input.status, adminNotes: input.adminNotes, reviewedAt: new Date() })
        .where(eq(paperSubmissions.id, input.id));
      return { success: true };
    }),
});
