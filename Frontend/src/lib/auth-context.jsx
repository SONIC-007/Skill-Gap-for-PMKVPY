"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiFetch, getApiBaseUrl, getAuthToken, setAuthToken } from "@/lib/api";

const AuthContext = createContext({
    data: null,
    status: "loading",
    signInWithCredentials: async () => ({ error: "Not initialized" }),
    signOutUser: async () => {},
    refreshSession: async () => {},
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState("loading");

    const refreshSession = useCallback(async () => {
        const token = getAuthToken();
        if (!token) {
            setUser(null);
            setStatus("unauthenticated");
            return;
        }

        try {
            const res = await apiFetch("/api/auth/me");
            if (res.ok) {
                const payload = await res.json();
                if (payload?.user) {
                    setUser(payload.user);
                    setStatus("authenticated");
                    return;
                }
            }
            setAuthToken(null);
            setUser(null);
            setStatus("unauthenticated");
        } catch {
            setUser(null);
            setStatus("unauthenticated");
        }
    }, []);

    useEffect(() => {
        refreshSession();
    }, [refreshSession]);

    const signInWithCredentials = useCallback(async ({ email, password }) => {
        try {
            const res = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });
            const payload = await res.json();
            if (!res.ok || !payload?.token || !payload?.user) {
                return { error: payload?.error || "Invalid credentials" };
            }
            setAuthToken(payload.token);
            setUser(payload.user);
            setStatus("authenticated");
            return { ok: true, user: payload.user };
        } catch {
            return { error: "Could not reach backend API server" };
        }
    }, []);

    const signOutUser = useCallback(async () => {
        try {
            await fetch(`${getApiBaseUrl()}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch {
            // Ignore network errors on sign out
        }
        setAuthToken(null);
        setUser(null);
        setStatus("unauthenticated");
    }, []);

    return (
        <AuthContext.Provider
            value={{
                data: user ? { user } : null,
                status,
                signInWithCredentials,
                signOutUser,
                refreshSession,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useSession() {
    return useContext(AuthContext);
}
