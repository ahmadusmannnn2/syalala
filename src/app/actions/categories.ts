"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { CategoryForm } from "@/types";

export async function createCategory(data: CategoryForm) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("categories").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/menu");
  revalidatePath("/admin/categories");
}

export async function updateCategory(id: string, data: Partial<CategoryForm>) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("categories")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/menu");
  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/menu");
  revalidatePath("/admin/categories");
}
