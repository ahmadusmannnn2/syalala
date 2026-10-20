"use server";

import { createAdminClient } from "@/lib/supabase/admin";

const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/pjpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/heic", "jpg"],
  ["image/heif", "jpg"],
]);

function getImageExtension(file: File): string {
  if (file.size === 0) {
    throw new Error("File gambar kosong");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Ukuran gambar maksimal 15MB");
  }

  const rawType = (file.type || "").toLowerCase().split(";")[0].trim();
  let extension = ALLOWED_IMAGE_TYPES.get(rawType);

  // Jika MIME type browser tidak cocok, periksa ekstensi nama file
  if (!extension && file.name) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext && ["jpg", "jpeg", "png", "webp", "gif", "heic", "heif"].includes(ext)) {
      extension = ext === "jpeg" || ext === "heic" || ext === "heif" ? "jpg" : ext;
    }
  }

  // Fallback aman untuk gambar
  if (!extension) {
    if (rawType.startsWith("image/")) {
      extension = "jpg";
    } else {
      throw new Error("Format gambar harus JPG, PNG, WEBP, atau GIF");
    }
  }

  return extension;
}

function createImageFileName(prefix: string, file: File): string {
  const extension = getImageExtension(file);
  const random = Math.random().toString(36).substring(2);

  return `${prefix}-${Date.now()}-${random}.${extension}`;
}

export async function uploadMenuImage(formData: FormData): Promise<string> {
  const file = formData.get("file") as File;
  if (!file) throw new Error("File tidak ditemukan");

  const supabase = await createAdminClient();
  const fileName = createImageFileName("menu", file);

  const { error } = await supabase.storage
    .from("menu-images")
    .upload(fileName, file, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("menu-images").getPublicUrl(fileName);
  return data.publicUrl;
}

export async function uploadBannerImage(formData: FormData): Promise<string> {
  const file = formData.get("file") as File;
  if (!file) throw new Error("File tidak ditemukan");

  const supabase = await createAdminClient();
  const fileName = createImageFileName("banner", file);

  const { error } = await supabase.storage
    .from("menu-images")
    .upload(fileName, file, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("menu-images").getPublicUrl(fileName);
  return data.publicUrl;
}

export async function uploadPromoImage(formData: FormData): Promise<string> {
  const file = formData.get("file") as File;
  if (!file) throw new Error("File tidak ditemukan");

  const supabase = await createAdminClient();
  const fileName = createImageFileName("promo", file);

  const { error } = await supabase.storage
    .from("menu-images")
    .upload(fileName, file, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("menu-images").getPublicUrl(fileName);
  return data.publicUrl;
}

export async function uploadLogoImage(formData: FormData): Promise<string> {
  const file = formData.get("file") as File;
  if (!file) throw new Error("File tidak ditemukan");

  const supabase = await createAdminClient();
  const fileName = createImageFileName("logo", file);

  const { error } = await supabase.storage
    .from("menu-images")
    .upload(fileName, file, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("menu-images").getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deleteStorageFile(url: string): Promise<void> {
  try {
    const supabase = await createAdminClient();
    const parts = url.split("/menu-images/");
    if (parts.length < 2) return;
    const fileName = decodeURIComponent(parts[1].split("?")[0]);
    if (!fileName) return;
    await supabase.storage.from("menu-images").remove([fileName]);
  } catch (e) {
    console.warn("Gagal menghapus file lama dari storage:", e);
  }
}
