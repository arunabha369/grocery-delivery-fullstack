import { Suspense } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { ArrowLeftIcon, LayoutDashboardIcon, PackageSearchIcon, PlusIcon, ShoppingBagIcon, TruckIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Loading";
import Logo from "../../components/Logo";

const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboardIcon, match: (p: string) => p === "/admin" },
    { to: "/admin/products", label: "Products", icon: PackageSearchIcon, match: (p: string) => p === "/admin/products" || p.endsWith("/edit") },
    { to: "/admin/products/new", label: "Add product", icon: PlusIcon, match: (p: string) => p === "/admin/products/new" },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBagIcon, match: (p: string) => p.startsWith("/admin/orders") },
    { to: "/admin/delivery-partners", label: "Delivery partners", icon: TruckIcon, match: (p: string) => p.startsWith("/admin/delivery-partners") },
];

export default function AdminLayout() {
    const { user, loading } = useAuth();
    const { pathname } = useLocation();

    if (loading) return <Loading fullScreen />;
    if (!user?.isAdmin) return <Navigate to="/" replace />;

    return (
        <div className="min-h-screen bg-app-cream lg:flex">
            {/* Sidebar - desktop */}
            <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-app-green px-4 py-6 text-white lg:flex">
                <Logo tone="light" to="/admin" label="Admin" className="px-2" />
                <nav aria-label="Admin" className="mt-10 flex flex-col gap-1">
                    {links.map((link) => {
                        const active = link.match(pathname);
                        return (
                            <Link key={link.to} to={link.to} aria-current={active ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${active ? "bg-white text-app-green" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
                                <link.icon className="size-4" /> {link.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="mt-auto space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                        <span className="flex-center size-9 shrink-0 rounded-full bg-app-orange text-sm font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{user.name}</p>
                            <p className="truncate text-xs text-white/50">{user.email}</p>
                        </div>
                    </div>
                    <Link to="/" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
                        <ArrowLeftIcon className="size-4" /> Back to store
                    </Link>
                </div>
            </aside>

            {/* Top bar - mobile/tablet */}
            <header className="sticky top-0 z-40 border-b border-app-border bg-white/95 backdrop-blur lg:hidden">
                <div className="flex h-14 items-center justify-between px-4">
                    <Logo to="/admin" label="Admin" />
                    <Link to="/" className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-app-text-light hover:text-app-green">
                        <ArrowLeftIcon className="size-4" /> Store
                    </Link>
                </div>
                <nav aria-label="Admin" className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2">
                    {links.map((link) => {
                        const active = link.match(pathname);
                        return (
                            <Link key={link.to} to={link.to} aria-current={active ? "page" : undefined} className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap ${active ? "bg-app-green text-white" : "text-zinc-600 hover:bg-app-cream"}`}>
                                <link.icon className="size-3.5" /> {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </header>

            <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
                <div className="mx-auto max-w-6xl animate-fade-in">
                    <Suspense fallback={<Loading />}>
                        <Outlet />
                    </Suspense>
                </div>
            </main>
        </div>
    );
}
