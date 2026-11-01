"use client";
import Link from "next/link";
import { ArrowLeft, AlertCircle, ShieldCheck } from "lucide-react";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const rawNext = searchParams.get("next") || "/home";
  const safeNext =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/home";
  const urlError = searchParams.get("error");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (urlError === "auth_failed") {
      setErrorMessage(
        "Google sign-in could not be completed. Please try again."
      );
    } else if (urlError) {
      setErrorMessage("Authentication failed. Please try signing in again.");
    }
  }, [urlError]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(safeNext);
    }
  }, [authLoading, isAuthenticated, router, safeNext]);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            safeNext
          )}`,
        },
      });

      if (error) {
        setErrorMessage(error.message || "Could not sign in with Google.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || "An unexpected error occurred during Google sign-in."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF6] flex flex-col justify-center items-center py-12 px-4 relative overflow-hidden font-sans text-gray-900">
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-red-50 to-transparent pointer-events-none" />

      <div className="w-full max-w-md animate-in slide-in-from-bottom-8 duration-500 fade-in z-10">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-bold text-gray-600 hover:text-[var(--color-primary)] transition-colors bg-white px-4 py-2 rounded-full shadow-2xs border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
          <Link
            href="/home"
            className="text-sm font-bold text-[var(--color-primary)] hover:underline"
          >
            Browse Menu →
          </Link>
        </div>

        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block text-2xl font-black tracking-tighter text-[var(--color-primary)] mb-3"
          >
            FEBNIKS KITCHEN
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">
            Sign in or create an account
          </h1>
          <p className="text-gray-500 font-medium text-sm sm:text-base">
            Continue with your Google account to place orders, track deliveries,
            and manage your profile in one tap.
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-red-900/5 border border-gray-100 space-y-6">
          {errorMessage && (
            <div
              role="alert"
              className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-3 border-2 transition-all active:scale-[0.98] ${
              isSubmitting
                ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-900 border-gray-900 text-white hover:bg-black shadow-lg shadow-gray-900/15"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 12.3s.6 3.3 1.6 5.3l3.7-2.8z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5L1.6 16c1.9 3.9 5.8 7 10.4 7z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs font-semibold text-gray-400">
            <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
            <span>One-click Google authentication — no password required</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FCFAF6] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
