import { useEffect, useState, type SubmitEvent } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronDownIcon, HomeIcon, LogOutIcon, MapPinIcon, MenuIcon, PackageIcon, SearchIcon, ShieldIcon, ShoppingBagIcon, StoreIcon, UserIcon, XIcon, ZapIcon } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../lib/format";
import Logo from "./Logo";

const navLinks = [
    { to: "/", label: "Home", icon: HomeIcon },
    { to: "/products", label: "Shop", icon: StoreIcon },
    { to: "/deals", label: "Deals", icon: ZapIcon },
];

function SearchForm({ className = "", idSuffix }: { className?: string; idSuffix?: string }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const urlQuery = pathname === "/search" ? (searchParams.get("q") ?? "") : "";

    // Keep the field in sync when the URL query changes (e.g. back/forward navigation)
    const [query, setQuery] = useState(urlQuery);
    const [syncedQuery, setSyncedQuery] = useState(urlQuery);
    if (urlQuery !== syncedQuery) {
        setSyncedQuery(urlQuery);
        setQuery(urlQuery);
    }

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const q = query.trim();
        if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
    };

    return (
        <form role="search" onSubmit={handleSubmit} className={className}>
            <label htmlFor={`search-${idSuffix}`} className="sr-only">
                Search groceries
            </label>
            <div className="relative">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-400" />
                <input
                    id={`search-${idSuffix}`}
                    type="search"
                    enterKeyHint="search"
                    placeholder="Search for fruits, dairy, bread…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-11 w-full rounded-full border border-transparent bg-app-cream pr-4 pl-10 text-sm text-app-text transition outline-none placeholder:text-zinc-400 hover:border-app-border focus:border-app-green-lighter/40 focus:bg-white focus:ring-4 focus:ring-app-green/10 [&::-webkit-search-cancel-button]:hidden"
                />
            </div>
        </form>
    );
}

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount, cartTotal, setIsCartOpen } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // Close the menu whenever the route changes
    const [menuPath, setMenuPath] = useState(pathname);
    if (pathname !== menuPath) {
        setMenuPath(pathname);
        setMenuOpen(false);
    }

    useEffect(() => {
        if (!menuOpen) return;
        const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [menuOpen]);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-50 border-b border-app-border/70 bg-white/90 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:h-[72px] lg:gap-8 lg:px-8">
                <Logo />

                <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === "/"}
                            className={({ isActive }) => `flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium ${isActive ? "bg-app-cream text-app-green" : link.to === "/deals" ? "text-app-orange-dark hover:bg-orange-50" : "text-zinc-600 hover:text-app-green"}`}
                        >
                            {link.to === "/deals" && <ZapIcon className="size-3.5 fill-current" />}
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <SearchForm idSuffix="desktop" className="ml-auto hidden max-w-md flex-1 sm:block" />

                <div className="ml-auto flex items-center gap-1.5 sm:ml-0 sm:gap-2">
                    {/* Cart */}
                    <button
                        type="button"
                        data-testid="cart-button"
                        onClick={() => setIsCartOpen(true)}
                        aria-label={`Open cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
                        className="relative flex h-11 items-center gap-2 rounded-full px-3 text-app-green hover:bg-app-cream md:bg-app-green md:pr-4 md:pl-3.5 md:text-white md:hover:bg-app-green-light"
                    >
                        <ShoppingBagIcon className="size-5" />
                        <span className="hidden text-sm font-semibold tabular-nums md:inline">{cartCount > 0 ? formatPrice(cartTotal) : "Cart"}</span>
                        {cartCount > 0 && (
                            <span key={cartCount} className="flex-center absolute -top-0.5 -right-0.5 h-5 min-w-5 animate-pop rounded-full bg-app-orange px-1 text-[11px] font-bold text-white ring-2 ring-white">
                                {cartCount > 99 ? "99+" : cartCount}
                            </span>
                        )}
                    </button>

                    {/* Account */}
                    <div className="relative">
                        {user ? (
                            <button type="button" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-haspopup="menu" aria-label="Account menu" className="flex items-center gap-1.5 rounded-full p-1 pr-2 hover:bg-app-cream">
                                <span className="flex-center size-9 rounded-full bg-app-green text-sm font-semibold text-white">{user.name.charAt(0).toUpperCase()}</span>
                                <ChevronDownIcon className={`size-4 text-zinc-500 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                            </button>
                        ) : (
                            <div className="flex items-center gap-1">
                                <Link to="/login" className="btn btn-outline hidden rounded-full md:inline-flex">
                                    <UserIcon className="size-4" /> Sign in
                                </Link>
                                <button type="button" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-label="Menu" className="rounded-full p-2.5 text-app-green hover:bg-app-cream md:hidden">
                                    {menuOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
                                </button>
                            </div>
                        )}

                        {menuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} aria-hidden="true" />
                                <div role="menu" className="absolute top-full right-0 z-50 mt-2 w-64 animate-fade overflow-hidden rounded-2xl border border-app-border bg-white py-2 shadow-float">
                                    {user && (
                                        <div className="mb-1 flex items-center gap-3 border-b border-app-border px-4 pt-2 pb-3">
                                            <span className="flex-center size-10 shrink-0 rounded-full bg-app-green font-semibold text-white">{user.name.charAt(0).toUpperCase()}</span>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-app-green">{user.name}</p>
                                                <p className="truncate text-xs text-app-text-light">{user.email}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="border-b border-app-border pb-1 md:hidden">
                                        {navLinks.map((link) => (
                                            <Link key={link.to} to={link.to} role="menuitem" className="dropdown-link">
                                                <link.icon className="size-4" /> {link.label}
                                            </Link>
                                        ))}
                                    </div>

                                    {user ? (
                                        <>
                                            <Link to="/orders" role="menuitem" className="dropdown-link">
                                                <PackageIcon className="size-4" /> My orders
                                            </Link>
                                            <Link to="/addresses" role="menuitem" className="dropdown-link">
                                                <MapPinIcon className="size-4" /> Saved addresses
                                            </Link>
                                            {user.isAdmin && (
                                                <Link to="/admin" role="menuitem" className="dropdown-link text-app-orange-dark">
                                                    <ShieldIcon className="size-4" /> Admin panel
                                                </Link>
                                            )}
                                            <div className="mt-1 border-t border-app-border pt-1">
                                                <button type="button" role="menuitem" onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-app-error hover:bg-red-50">
                                                    <LogOutIcon className="size-4" /> Log out
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="px-3 pt-2">
                                            <Link to="/login" role="menuitem" className="btn btn-dark w-full">
                                                <UserIcon className="size-4" /> Sign in
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile search */}
            <SearchForm idSuffix="mobile" className="px-4 pb-3 sm:hidden" />
        </header>
    );
};

export default Navbar;
