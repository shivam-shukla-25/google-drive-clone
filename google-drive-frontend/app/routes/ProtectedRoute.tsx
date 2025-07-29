import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};
