import { getSupabaseAdmin } from "./supabaseAdmin";

export const STORAGE_BUCKET = "uploads";

export async function uploadFile(
  path: string,
  file: Blob | ArrayBuffer | Uint8Array,
  contentType?: string
): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { contentType, upsert: true });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFile(path: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}
