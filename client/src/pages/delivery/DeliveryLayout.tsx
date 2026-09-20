import { Suspense, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { LogOutIcon } from "lucide-react";
import type { DeliveryPartner } from "../../types";
import Logo from "../../components/Logo";
import Loading from "../../components/Loading";

const readPartner = (): DeliveryPartner | null => {
    const saved = localStorage.getItem("delivery_partner");
    const token = localStorage.getItem("delivery_token");
    if (!saved || !token) return null;
    try {
        return JSON.parse(saved);
    } catch {
        return null;
    }
};

export default function DeliveryLayout() {
    const navigate = useNavigate();
    const [partner] = useState(readPartner);

    if (!partner) return <Navigate to="/delivery/login" replace />;

    const handleLogout = () => {
        localStorage.removeItem("delivery_partner");
        localStorage.removeItem("delivery_token");
        navigate("/delivery/login", { replace: true });
    };

    return (
        <div className="min-h-screen bg-app-cream">
            <header className="sticky top-0 z-40 border-b border-app-border/70 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
                    <Logo to="/delivery" label="Partner" />
                    <div className="flex items-center gap-2">
                        <div className="hidden items-center gap-2.5 sm:flex">
                            <span className="flex-center size-8 rounded-full bg-app-green text-sm font-semibold text-white">{partner.name.charAt(0)}</span>
                            <span className="text-sm font-medium text-app-text">{partner.name}</span>
                        </div>
                        <button type="button" onClick={handleLogout} aria-label="Log out" className="btn btn-sm btn-ghost hover:bg-red-50 hover:text-app-error">
                            <LogOutIcon className="size-4" /> <span className="hidden sm:inline">Log out</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
                <Suspense fallback={<Loading />}>
                    <Outlet context={partner} />
                </Suspense>
            </main>
        </div>
    );
}
