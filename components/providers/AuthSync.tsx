"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { usersApi } from "@/lib/api";
import { useStore } from "@/store/useStore";
import type { User } from "@/types";

/** Synchronise le profil backend avec le store Zustand après connexion Clerk. */
export function AuthSync() {
  const { isLoaded, isSignedIn } = useAuth();
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setCurrentUser(null);
      return;
    }

    let cancelled = false;

    usersApi
      .getMe()
      .then((response) => {
        if (!cancelled) {
          setCurrentUser(response.data.data as User);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCurrentUser(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, setCurrentUser]);

  return null;
}
