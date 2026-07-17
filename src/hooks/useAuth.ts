import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";

export type UnifiedUser = {
  id: number;
  username: string;
  name: string;
  email?: string | null;
  avatar?: string | null;
  role: string;
};

export function useAuth() {
  const utils = trpc.useUtils();

  const { data: user, isLoading } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logout = useCallback(() => {
    localStorage.removeItem("local_auth_token");
    utils.invalidate();
    window.location.reload();
  }, [utils]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return useMemo(
    () => ({
      user: (user as UnifiedUser | null) ?? null,
      isAuthenticated,
      isAdmin,
      isLoading,
      logout,
    }),
    [user, isAuthenticated, isAdmin, isLoading, logout]
  );
}
