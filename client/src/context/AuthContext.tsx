import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "../types";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import toast from "react-hot-toast";
import { getErrorMessage } from "../lib/errors";

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string, redirectTo?: string) => Promise<void>;
    register: (name: string, email: string, password: string, redirectTo?: string) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Read the saved session synchronously so the first render is already signed in (no logged-out flash)
function readSession(): { user: User | null; token: string | null } {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");
    if (!savedToken || !savedUser) return { user: null, token: null };
    try {
        return { user: JSON.parse(savedUser), token: savedToken };
    } catch {
        return { user: null, token: null };
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(() => readSession().user);
    const [token, setToken] = useState<string | null>(() => readSession().token);
    // Kept for consumers; the session is now restored synchronously
    const loading = false;

    const login = async (email: string, password: string, redirectTo = "/") => {
        try {
            const { data } = await api.post("/auth/login", { email, password });
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem("auth_token", data.token);
            localStorage.setItem("auth_user", JSON.stringify(data.user));
            toast.success("Login successful");
            navigate(redirectTo, { replace: true });
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const register = async (name: string, email: string, password: string, redirectTo = "/") => {
        try {
            const { data } = await api.post("/auth/register", { name, email, password });
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem("auth_token", data.token);
            localStorage.setItem("auth_user", JSON.stringify(data.user));
            toast.success("Registration successful");
            navigate(redirectTo, { replace: true });
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updated = { ...user, ...userData };
            setUser(updated);
            localStorage.setItem("auth_user", JSON.stringify(updated));
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
