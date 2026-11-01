import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { CheckCircle2, XCircle, Database, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SupabaseDebugPage() {
  const hasSupabaseUrl = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL.trim().length > 0
  );
  const hasSupabaseAnonKey = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim().length > 0
  );
  const hasSiteUrl = Boolean(
    process.env.NEXT_PUBLIC_SITE_URL &&
      process.env.NEXT_PUBLIC_SITE_URL.trim().length > 0
  );

  let categoriesSuccess = false;
  let categoriesCount = 0;
  let categoriesError: string | null = null;

  let mealsSuccess = false;
  let mealsCount = 0;
  let mealsError: string | null = null;

  if (hasSupabaseUrl && hasSupabaseAnonKey) {
    try {
      const supabase = await createClient();

      const { data: catData, error: catErr } = await supabase
        .from("categories")
        .select("id, name, slug, sort_order, is_active")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (catErr) {
        categoriesError = catErr.message;
      } else {
        categoriesSuccess = true;
        categoriesCount = catData?.length ?? 0;
      }

      const { data: mealData, error: mealErr } = await supabase
        .from("meals")
        .select("id")
        .eq("is_available", true);

      if (mealErr) {
        mealsError = mealErr.message;
      } else {
        mealsSuccess = true;
        mealsCount = mealData?.length ?? 0;
      }
    } catch (err: any) {
      categoriesError = err?.message || "Unexpected connection error";
    }
  } else {
    categoriesError = "Missing required Supabase environment variables.";
  }

  const envVars = [
    { name: "NEXT_PUBLIC_SUPABASE_URL", present: hasSupabaseUrl },
    { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", present: hasSupabaseAnonKey },
    { name: "NEXT_PUBLIC_SITE_URL", present: hasSiteUrl },
  ];

  return (
    <div className="min-h-screen bg-[#FCFAF6] flex flex-col font-sans text-gray-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 max-w-3xl py-10 md:py-14">
        <div className="mb-6">
          <Link
            href="/home"
            className="inline-flex items-center text-sm font-bold text-gray-600 hover:text-[var(--color-primary)] transition-colors bg-white px-4 py-2 rounded-full shadow-2xs border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[var(--color-primary)] flex items-center justify-center">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  Supabase Connectivity Check
                </h1>
                <p className="text-xs font-semibold text-gray-500">
                  Route: <code>/debug/supabase</code> (Remove before public launch)
                </p>
              </div>
            </div>
          </div>

          {/* 1. Environment Variables Presence (Boolean Only) */}
          <section>
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-400 mb-4">
              1. Environment Variables (Boolean Only — Values Never Shown)
            </h2>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
              {envVars.map((env) => (
                <div
                  key={env.name}
                  className="flex items-center justify-between px-5 py-3.5 bg-gray-50/50"
                >
                  <code className="text-xs sm:text-sm font-bold text-gray-800">
                    {env.name}
                  </code>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                      env.present
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {env.present ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    {String(env.present)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Categories Query Status & Row Count */}
          <section>
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-400 mb-4">
              2. Live Database Query: <code>categories</code>
            </h2>
            <div className="p-5 rounded-2xl border border-gray-100 bg-[#FCFAF6] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">
                  Query Succeeded
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                    categoriesSuccess
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {categoriesSuccess ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {String(categoriesSuccess)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">
                  Categories Row Count Returned
                </span>
                <span className="text-lg font-black text-gray-900">
                  {categoriesCount}
                </span>
              </div>

              {categoriesError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                  Error: {categoriesError}
                </div>
              )}
            </div>
          </section>

          {/* 3. Meals Query Status & Row Count */}
          <section>
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-400 mb-4">
              3. Live Database Query: <code>meals</code> (is_available = true)
            </h2>
            <div className="p-5 rounded-2xl border border-gray-100 bg-[#FCFAF6] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">
                  Query Succeeded
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                    mealsSuccess
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {mealsSuccess ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {String(mealsSuccess)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">
                  Available Meals Row Count Returned
                </span>
                <span className="text-lg font-black text-gray-900">
                  {mealsCount}
                </span>
              </div>

              {mealsError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                  Error: {mealsError}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

