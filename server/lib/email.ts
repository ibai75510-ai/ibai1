import { getSupabaseAdmin } from "./supabaseAdmin";
import { env } from "./env";

// Sends the registration confirmation email using Supabase's own built-in email
// sender (no third-party email provider needed). This creates a lightweight
// "shadow" user in Supabase Auth purely to trigger the email; our real user
// record is only created in our own `users` table once they complete the form
// (see completeRegistration), and the shadow user is deleted at that point.
export async function sendRegistrationInvite(email: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${env.appUrl}/register/complete`,
  });

  if (error) {
    throw new Error(error.message);
  }
}

// Resolves the Supabase access token from the confirmation link back to the
// email address it was issued for, proving the link is genuine and unexpired.
export async function resolveInvitedEmail(accessToken: string): Promise<{ email: string; supabaseUserId: string }> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user?.email) {
    throw new Error("This link is invalid or has expired. Please start registration again.");
  }
  return { email: data.user.email, supabaseUserId: data.user.id };
}

// Cleans up the shadow Supabase Auth user after our own account has been created.
export async function deleteShadowUser(supabaseUserId: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  await supabase.auth.admin.deleteUser(supabaseUserId).catch((err) => {
    console.error("[deleteShadowUser] Failed to clean up shadow Supabase user:", err);
  });
}
