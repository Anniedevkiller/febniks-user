import { Header } from "@/components/layout/Header";

export default function MealDetailLoading() {
  return (
    <div className="min-h-screen bg-[#FCFAF6] flex flex-col font-sans text-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 max-w-5xl py-8 md:py-12">
        <div className="h-9 w-36 rounded-full animate-shimmer mb-8" />
        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-6 min-h-[340px] sm:min-h-[420px] animate-shimmer" />
          <div className="lg:col-span-6 p-6 sm:p-10 space-y-5">
            <div className="h-6 w-28 rounded-full animate-shimmer" />
            <div className="h-10 w-3/4 rounded-xl animate-shimmer" />
            <div className="h-9 w-1/3 rounded-xl animate-shimmer" />
            <div className="h-24 w-full rounded-xl animate-shimmer" />
            <div className="h-14 w-full rounded-2xl animate-shimmer mt-8" />
          </div>
        </div>
      </main>
    </div>
  );
}

