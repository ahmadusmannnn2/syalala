"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { PromotionForm } from "@/types";

export async function createPromotion(data: PromotionForm) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("promotions").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/promo");
  revalidatePath("/admin/promos");
}

export async function updatePromotion(id: string, data: Partial<PromotionForm>) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("promotions")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/promo");
  revalidatePath("/admin/promos");
}

export async function deletePromotion(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("promotions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/promo");
  revalidatePath("/admin/promos");
}
