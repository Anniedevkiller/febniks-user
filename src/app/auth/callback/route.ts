import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/home";

  // Strictly allow only relative internal paths to prevent open redirects
  const safeNext =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/home";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // Confirm a row exists in the profiles table (created by DB trigger, with safe fallback)
  const sbUser = data.user;
  const fullName =
    sbUser.user_metadata?.full_name ||
    sbUser.user_metadata?.name ||
    sbUser.email?.split("@")[0] ||
    "Diner";
  const avatarUrl =
    sbUser.user_metadata?.avatar_url ||
    sbUser.user_metadata?.picture ||
    null;

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .eq("id", sbUser.id)
    .maybeSingle();

  if (!existingProfile) {
    await supabase.from("profiles").upsert(
      {
        id: sbUser.id,
        email: sbUser.email || "",
        full_name: fullName,
        avatar_url: avatarUrl,
      },
      { onConflict: "id" }
    );
  } else if (!existingProfile.full_name || !existingProfile.avatar_url) {
    await supabase
      .from("profiles")
      .update({
        full_name: existingProfile.full_name || fullName,
        avatar_url: existingProfile.avatar_url || avatarUrl,
      })
      .eq("id", sbUser.id);
  }

  return NextResponse.redirect(`${origin}${safeNext}`);
}
