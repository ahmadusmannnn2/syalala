"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { MenuItemForm } from "@/types";

export async function createMenuItem(data: MenuItemForm) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("menu_items").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export async function updateMenuItem(id: string, data: Partial<MenuItemForm>) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("menu_items")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export async function deleteMenuItem(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export async function toggleMenuAvailability(id: string, isAvailable: boolean) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("menu_items")
    .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}
