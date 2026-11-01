"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  role?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loginWithGoogle: (nextPath?: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loginWithGoogle: async () => ({ error: null }),
  logout: async () => {},
  refreshProfile: async () => {},
  isAuthenticated: false,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrEnsureProfile = useCallback(async (sbUser: SupabaseUser): Promise<UserProfile> => {
    const supabase = createClient();

    const metaName =
      sbUser.user_metadata?.full_name ||
      sbUser.user_metadata?.name ||
      sbUser.email?.split("@")[0] ||
      "Diner";
    const metaAvatar =
      sbUser.user_metadata?.avatar_url ||
      sbUser.user_metadata?.picture ||
      null;

    const { data: profileRow, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone, avatar_url, role")
      .eq("id", sbUser.id)
      .maybeSingle();

    if (!error && profileRow) {
      return {
        id: sbUser.id,
        name: profileRow.full_name || metaName,
        email: profileRow.email || sbUser.email || "",
        phone: profileRow.phone || "",
        avatar_url: profileRow.avatar_url || metaAvatar,
        role: profileRow.role,
      };
    }

    // If trigger hasn't populated the row yet, attempt a non-blocking upsert
    const fallbackProfile = {
      id: sbUser.id,
      full_name: metaName,
      email: sbUser.email || "",
      avatar_url: metaAvatar,
    };
    await supabase.from("profiles").upsert(fallbackProfile, { onConflict: "id" });

    return {
      id: sbUser.id,
      name: metaName,
      email: sbUser.email || "",
      phone: sbUser.phone || "",
      avatar_url: metaAvatar,
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      return;
    }
    try {
      const supabase = createClient();
      const {
        data: { user: sbUser },
      } = await supabase.auth.getUser();

      if (sbUser) {
        const profile = await fetchOrEnsureProfile(sbUser);
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, [fetchOrEnsureProfile]);

  useEffect(() => {
    let mounted = true;

    // Clean up any legacy mock localStorage session key
    if (typeof window !== "undefined") {
      localStorage.removeItem("febniks_user");
    }

    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    let supabase: ReturnType<typeof createClient>;
    try {
      supabase = createClient();
    } catch {
      setIsLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        const {
          data: { user: sbUser },
        } = await supabase.auth.getUser();
        if (mounted) {
          if (sbUser) {
            const profile = await fetchOrEnsureProfile(sbUser);
            if (mounted) setUser(profile);
          } else {
            setUser(null);
          }
        }
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const profile = await fetchOrEnsureProfile(session.user);
        if (mounted) {
          setUser(profile);
          setIsLoading(false);
        }
      } else if (event === "SIGNED_OUT" || !session) {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchOrEnsureProfile]);

  const loginWithGoogle = async (nextPath = "/home"): Promise<{ error: string | null }> => {
    try {
      const supabase = createClient();
      const safeNext = nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/home";
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
        },
      });

      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err: any) {
      return { error: err?.message || "Failed to start Google sign-in." };
    }
  };

  const logout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore if client is not configured
    }
    setUser(null);
    toast.success("Signed out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithGoogle,
        logout,
        refreshProfile,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
