import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { MealDetailClient } from "@/components/menu/MealDetailClient";
import { getMealBySlugServer } from "@/lib/supabase/queries";
import { AlertCircle, ArrowLeft, UtensilsCrossed } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MealDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const { data: meal, error } = await getMealBySlugServer(decodedSlug);

  if (error) {
    return (
      <div className="min-h-screen bg-[#FCFAF6] flex flex-col font-sans text-gray-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 max-w-3xl py-16">
          <div className="bg-white rounded-3xl p-10 border border-red-100 text-center shadow-xs">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-gray-900 mb-2">
              Error loading meal details
            </h1>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm hover:bg-red-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Menu
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen bg-[#FCFAF6] flex flex-col font-sans text-gray-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 max-w-3xl py-16">
          <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-[var(--color-primary)] flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">
              Meal not found
            </h1>
            <p className="text-sm text-gray-500 font-medium mb-8">
              This dish may be unavailable or has not been uploaded to the menu yet.
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm hover:bg-red-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse Full Menu
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return <MealDetailClient meal={meal} />;
}

