import { createClient } from "@/lib/supabase/client";

export const FALLBACK_MEAL_IMAGE = "/croaker-dish.jpg";
export const MEAL_IMAGES_BUCKET = "meal-images";

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
}

export interface Meal {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  is_available: boolean;
  is_featured: boolean;
  categories?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export function formatNaira(amount: number | string | null | undefined): string {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : Number(amount ?? 0);
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(Number.isFinite(numericAmount) ? numericAmount : 0);
}

export function getMealImageUrl(imageUrl?: string | null): string {
  if (!imageUrl || typeof imageUrl !== "string" || imageUrl.trim() === "") {
    return FALLBACK_MEAL_IMAGE;
  }
  const trimmed = imageUrl.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    const cleanPath = trimmed.replace(/^meal-images\//, "");
    return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${MEAL_IMAGES_BUCKET}/${cleanPath}`;
  }
  return FALLBACK_MEAL_IMAGE;
}

export function getCategoryIcon(slugOrName: string): string {
  const key = slugOrName.toLowerCase();
  if (key.includes("fish")) return "🐟";
  if (key.includes("grill")) return "🔥";
  if (key.includes("pepper") || key.includes("soup")) return "🥣";
  if (key.includes("fried")) return "🍤";
  if (key.includes("side")) return "🍌";
  if (key.includes("drink")) return "🥤";
  if (key.includes("special")) return "⭐";
  return "🍽️";
}

export async function fetchActiveCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, sort_order, is_active")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function fetchFeaturedMeals(limit = 4): Promise<Meal[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("meals")
    .select(
      "id, name, slug, description, price, image_url, category_id, is_available, is_featured, categories(id, name, slug)"
    )
    .eq("is_available", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data as unknown as Meal[]) ?? [];
}

export async function fetchAvailableMeals(): Promise<Meal[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("meals")
    .select(
      "id, name, slug, description, price, image_url, category_id, is_available, is_featured, categories(id, name, slug)"
    )
    .eq("is_available", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as unknown as Meal[]) ?? [];
}

export async function fetchMealBySlug(slugOrId: string): Promise<Meal | null> {
  const supabase = createClient();
  const { data: bySlug, error: slugErr } = await supabase
    .from("meals")
    .select(
      "id, name, slug, description, price, image_url, category_id, is_available, is_featured, categories(id, name, slug)"
    )
    .eq("is_available", true)
    .eq("slug", slugOrId)
    .maybeSingle();

  if (slugErr) {
    throw new Error(slugErr.message);
  }
  if (bySlug) {
    return bySlug as unknown as Meal;
  }

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      slugOrId
    );
  if (isUuid) {
    const { data: byId, error: idErr } = await supabase
      .from("meals")
      .select(
        "id, name, slug, description, price, image_url, category_id, is_available, is_featured, categories(id, name, slug)"
      )
      .eq("is_available", true)
      .eq("id", slugOrId)
      .maybeSingle();

    if (idErr) {
      throw new Error(idErr.message);
    }
    return (byId as unknown as Meal) ?? null;
  }

  return null;
}
