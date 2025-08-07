"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  use,
} from "react";
import { useRouter } from "next/navigation";
import api_link from "@/components/api_link";

interface AuthContextType {
  token: string | null;
  setToken: (t: string | null) => void;
  getToken: () => string | null;
  logout: () => void;
  refresh: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  getToken: () => null,
  logout: () => {},
  refresh: () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await refresh();
      setIsLoading(false);
      tokenRef.current = token;
    })();
  }, []);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const logout = useCallback(async () => {
    const response = await fetch(api_link + "/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    router.push("/");
    location.reload();
  }, []);

  const refresh = useCallback(async () => {
    const res = await fetch(api_link + "/api/refresh", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (res.ok) {
      const { token: new_token } = await res.json();
      setToken(new_token);
    }
  }, []);

  const getToken = useCallback((): string | null => {
    return tokenRef.current;
  }, []);

  const value = useMemo(
    () => ({
      token,
      setToken,
      logout,
      refresh,
      getToken,
      isLoading,
    }),
    [token, logout, refresh, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
