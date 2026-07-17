import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { createRouter, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { media } from "@db/schema";
import { uploadFile, deleteFile } from "../lib/storage";

export const mediaRouter = createRouter({
  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(media).orderBy(desc(media.uploadedAt));
  }),

  upload: adminQuery
    .input(
      z.object({
        filename: z.string().min(1),
        mimeType: z.string().optional(),
        altText: z.string().optional(),
        base64Data: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const buffer = Buffer.from(input.base64Data, "base64");
      const path = `${Date.now()}-${input.filename}`;
      const url = await uploadFile(path, buffer, input.mimeType);

      const result = await db
        .insert(media)
        .values({ url, filename: input.filename, mimeType: input.mimeType, altText: input.altText })
        .returning({ id: media.id });

      return { success: true, id: result[0].id, url };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const rows = await db.select().from(media).where(eq(media.id, input.id)).limit(1);
      const item = rows[0];
      if (item) {
        const path = item.url.split("/").pop();
        if (path) await deleteFile(path).catch(() => {});
      }
      await db.delete(media).where(eq(media.id, input.id));
      return { success: true };
    }),
});
