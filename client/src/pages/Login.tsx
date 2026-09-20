import { useState, type SubmitEvent } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { ArrowLeftIcon, CircleCheckIcon, EyeIcon, EyeOffIcon, Loader2Icon, LockIcon, MailIcon, UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import { HeroArt } from "../components/illustrations";
import { heroSectionData } from "../assets/assets";
import { FREE_DELIVERY_THRESHOLD, formatPrice } from "../lib/format";

const perks = ["Farm-fresh produce from local growers", `Free delivery on orders over ${formatPrice(FREE_DELIVERY_THRESHOLD)}`, "Live tracking from store to doorstep"];

const Login = () => {
    const [isLoginState, setIsLoginState] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const { user, loading, login, register } = useAuth();
    const location = useLocation();
    const redirectTo = (location.state as { from?: string } | null)?.from || "/";

    if (!loading && user) return <Navigate to={redirectTo} replace />;

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // AuthContext shows its own error toasts
            if (isLoginState) await login(email, password, redirectTo);
            else await register(name, email, password, redirectTo);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-app-cream">
            {/* Brand panel */}
            <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-app-green p-12 text-white lg:flex xl:p-16">
                <img src={heroSectionData.hero_image} alt="" className="pointer-events-none absolute inset-0 size-full object-cover opacity-10" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(249,115,22,0.16),transparent_40%),radial-gradient(circle_at_80%_90%,rgba(111,178,106,0.2),transparent_45%)]" />
                <Logo tone="light" className="relative" />
                <div className="relative mx-auto w-full max-w-md">
                    <HeroArt className="h-auto w-full" />
                </div>
                <div className="relative">
                    <h2 className="font-serif text-4xl leading-tight">
                        Fresh groceries, <span className="text-orange-300 italic">delivered.</span>
                    </h2>
                    <ul className="mt-6 space-y-3 text-white/75">
                        {perks.map((perk) => (
                            <li key={perk} className="flex items-center gap-3">
                                <CircleCheckIcon className="size-5 text-emerald-300" /> {perk}
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Form */}
            <main className="flex flex-1 flex-col px-4 py-8 sm:px-8">
                <div className="flex items-center justify-between">
                    <Link to="/" className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-app-text-light hover:text-app-green">
                        <ArrowLeftIcon className="size-4" /> Back to store
                    </Link>
                    <Logo className="lg:hidden" />
                </div>

                <div className="flex flex-1 items-center justify-center py-10">
                    <div className="w-full max-w-md animate-fade-in">
                        <h1 className="text-3xl font-semibold tracking-tight text-app-green">{isLoginState ? "Welcome back" : "Create your account"}</h1>
                        <p className="mt-2 text-app-text-light">{isLoginState ? "Sign in to continue shopping and track your orders." : "Join in seconds and get groceries delivered today."}</p>

                        <div className="mt-8 grid grid-cols-2 rounded-2xl bg-app-cream-dark p-1" role="tablist" aria-label="Account">
                            {[
                                { label: "Sign in", active: isLoginState, value: true },
                                { label: "Create account", active: !isLoginState, value: false },
                            ].map((tab) => (
                                <button key={tab.label} type="button" role="tab" aria-selected={tab.active} onClick={() => setIsLoginState(tab.value)} className={`rounded-xl py-2.5 text-sm font-semibold ${tab.active ? "bg-white text-app-green shadow-sm" : "text-app-text-light hover:text-app-green"}`}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            {!isLoginState && (
                                <div>
                                    <label htmlFor="name" className="field-label">
                                        Full name
                                    </label>
                                    <div className="relative">
                                        <UserIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-400" />
                                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder="Your name" className="field h-12 pl-11" />
                                    </div>
                                </div>
                            )}
                            <div>
                                <label htmlFor="email" className="field-label">
                                    Email address
                                </label>
                                <div className="relative">
                                    <MailIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-400" />
                                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" className="field h-12 pl-11" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="field-label">
                                    Password
                                </label>
                                <div className="relative">
                                    <LockIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={isLoginState ? undefined : 6}
                                        autoComplete={isLoginState ? "current-password" : "new-password"}
                                        placeholder="••••••••"
                                        className="field h-12 pr-12 pl-11"
                                    />
                                    <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-2 text-zinc-400 hover:bg-app-cream hover:text-app-green">
                                        {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                                    </button>
                                </div>
                                {!isLoginState && <p className="mt-1.5 text-xs text-app-text-light">Use at least 6 characters.</p>}
                            </div>

                            <button type="submit" disabled={submitting} className="btn btn-dark mt-2 h-12 w-full rounded-xl text-base">
                                {submitting && <Loader2Icon className="size-5 animate-spin" />}
                                {isLoginState ? "Sign in" : "Create account"}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-app-text-light">
                            Delivering for us?{" "}
                            <Link to="/delivery/login" className="rounded font-semibold text-app-orange-dark hover:underline">
                                Partner sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
