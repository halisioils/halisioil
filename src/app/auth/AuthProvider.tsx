"use client";

import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
import { type ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return <KindeProvider>{children}</KindeProvider>;
};
