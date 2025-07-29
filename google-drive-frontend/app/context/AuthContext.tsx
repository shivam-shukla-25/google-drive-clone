import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type UserCredential,
  getIdToken,
} from "firebase/auth";

interface AuthContextProps {
  user: User | null;
  token: string;
  loading: boolean;
  signup: (email: string, password: string) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const AuthContext = createContext<AuthContextProps | null>(null);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const idToken = await getIdToken(firebaseUser);
        console.log("Token: ", idToken);
        setToken(idToken);
      } else {
        setToken("");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string) => { 
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      const res = await fetch(`${BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });

      console.log(res)
      localStorage.setItem('token', token);
    } catch (err: any) {
      console.log(err.message || 'SignUp failed');
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      const res = await fetch(`${BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });

      console.log(res)
      localStorage.setItem('token', token);
    } catch (err: any) {
      console.log(err.message || 'Login failed');
    }
    setLoading(false);
  }

  const logout = () => { 
    signOut(auth);
    setUser(null);
    setToken("");
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
