// Database types for Syalala Digital Menu

export interface RestaurantSettings {
  id: string;
  name: string;
  tagline: string;
  hero_text: string | null;
  take_away_additional_fee: number;
  jumbo_size_upgrade_fee: number;
  tax_percentage: number;
  tax_status: string;
  whatsapp_link: string | null;
  google_maps_link: string | null;
  instagram_link: string | null;
  banner_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface HomeButton {
  id: string;
  label: string;
  url: string;
  icon: string | null;
  variant: "primary" | "secondary" | "outline" | "ghost";
  order_number: number;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order_number: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category?: Category;
  price: number;
  description: string | null;
  image_url: string | null;
  is_available: boolean;
  is_best_seller: boolean;
  is_chef_choice: boolean;
  supports_jumbo: boolean;
  order_number: number;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string | null;
  min_transaction: number | null;
  reward: string | null;
  start_date: string | null;
  end_date: string | null;
  valid_days: string[] | null;
  valid_time_start: string | null;
  valid_time_end: string | null;
  valid_time_start_2: string | null;
  valid_time_end_2: string | null;
  is_active: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// Form types
export type MenuItemForm = Omit<MenuItem, "id" | "created_at" | "updated_at" | "category">;
export type CategoryForm = Omit<Category, "id" | "created_at" | "updated_at">;
export type PromotionForm = Omit<Promotion, "id" | "created_at" | "updated_at">;
export type RestaurantSettingsForm = Omit<RestaurantSettings, "id" | "created_at" | "updated_at">;
