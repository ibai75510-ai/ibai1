import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { users } from "@db/schema";
import { signSessionToken } from "../lib/jwt";
import { sendRegistrationInvite, resolveInvitedEmail, deleteShadowUser } from "../lib/email";

export const authRouter = createRouter({
  // Step 1: user submits their email; Supabase sends them a confirmation link.
  startRegistration: publicQuery
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (existing.length > 0) {
        throw new Error("An account with this email already exists");
      }

      try {
        await sendRegistrationInvite(input.email);
      } catch (err) {
        console.error("[auth.startRegistration] Failed to send registration email:", err);
        throw new Error("We're unable to send emails right now. Please try again later.");
      }

      return { success: true, email: input.email };
    }),

  // Used by the /register/complete page on load, to validate the link before showing the form.
  checkRegistrationToken: publicQuery
    .input(z.object({ token: z.string().min(1) }))
    .query(async ({ input }) => {
      const { email } = await resolveInvitedEmail(input.token);
      return { email };
    }),

  // Step 2: user fills in username/password/display name; account is created only now.
  completeRegistration: publicQuery
    .input(
      z.object({
        token: z.string().min(1),
        username: z.string().min(3).max(255),
        password: z.string().min(6).max(255),
        displayName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { email, supabaseUserId } = await resolveInvitedEmail(input.token);

      const db = getDb();
      const existingEmail = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existingEmail.length > 0) {
        throw new Error("An account with this email already exists");
      }
      const existingUsername = await db.select().from(users).where(eq(users.username, input.username)).limit(1);
      if (existingUsername.length > 0) {
        throw new Error("Username already exists");
      }

      const passwordHash = await bcrypt.hash(input.password, 12);
      const name = input.displayName || input.username;
      const result = await db
        .insert(users)
        .values({
          username: input.username,
          passwordHash,
          displayName: name,
          email,
        })
        .returning({ id: users.id });

      await deleteShadowUser(supabaseUserId);

      const token = signSessionToken({ userId: result[0].id, username: input.username });

      return {
        token,
        user: { id: result[0].id, username: input.username, name, email },
      };
    }),

  login: publicQuery
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.username, input.username))
        .limit(1);

      if (rows.length === 0) {
        throw new Error("Invalid credentials");
      }

      const user = rows[0];
      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) {
        throw new Error("Invalid credentials");
      }

      const token = signSessionToken({ userId: user.id, username: user.username });

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.displayName || user.username,
          displayName: user.displayName,
          email: user.email,
          role: user.role,
        },
      };
    }),

  me: publicQuery.query(({ ctx }) => {
    if (!ctx.user) return null;
    return {
      id: ctx.user.id,
      username: ctx.user.username,
      name: ctx.user.displayName || ctx.user.username,
      displayName: ctx.user.displayName,
      email: ctx.user.email,
      role: ctx.user.role,
      avatar: null as string | null,
    };
  }),

  logout: authedQuery.mutation(() => ({ success: true })),
});
