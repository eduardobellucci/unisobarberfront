import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login-barbeiro" replace />;
  }
  return children;
}

