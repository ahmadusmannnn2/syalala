"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { RestaurantSettingsForm } from "@/types";

export async function updateRestaurantSettings(id: string, data: Partial<RestaurantSettingsForm>) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("restaurant_settings")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/home");
}
