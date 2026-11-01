import { createClient } from "@/lib/supabase/server";
import { Category, Meal } from "@/lib/supabase/meals";

export async function getActiveCategoriesServer(): Promise<{
  data: Category[];
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, sort_order, is_active")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      return { data: [], error: error.message };
    }
    return { data: data ?? [], error: null };
  } catch (err: any) {
    return { data: [], error: err?.message || "Failed to fetch categories." };
  }
}

export async function getFeaturedMealsServer(limit = 4): Promise<{
  data: Meal[];
  error: string | null;
}> {
  try {
    const supabase = await createClient();
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
      return { data: [], error: error.message };
    }
    return { data: (data as unknown as Meal[]) ?? [], error: null };
  } catch (err: any) {
    return { data: [], error: err?.message || "Failed to fetch featured meals." };
  }
}

export async function getAvailableMealsServer(): Promise<{
  data: Meal[];
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("meals")
      .select(
        "id, name, slug, description, price, image_url, category_id, is_available, is_featured, categories(id, name, slug)"
      )
      .eq("is_available", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }
    return { data: (data as unknown as Meal[]) ?? [], error: null };
  } catch (err: any) {
    return { data: [], error: err?.message || "Failed to fetch meals." };
  }
}

export async function getMealBySlugServer(slugOrId: string): Promise<{
  data: Meal | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data: bySlug, error: slugErr } = await supabase
      .from("meals")
      .select(
        "id, name, slug, description, price, image_url, category_id, is_available, is_featured, categories(id, name, slug)"
      )
      .eq("is_available", true)
      .eq("slug", slugOrId)
      .maybeSingle();

    if (slugErr) {
      return { data: null, error: slugErr.message };
    }
    if (bySlug) {
      return { data: bySlug as unknown as Meal, error: null };
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
        return { data: null, error: idErr.message };
      }
      return { data: (byId as unknown as Meal) ?? null, error: null };
    }

    return { data: null, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || "Failed to fetch meal details." };
  }
}

