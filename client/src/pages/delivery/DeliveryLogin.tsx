import { useState, type SubmitEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeftIcon, CircleCheckIcon, EyeIcon, EyeOffIcon, Loader2Icon, LockIcon, MailIcon } from "lucide-react";
import Logo from "../../components/Logo";
import { ScooterArt } from "../../components/illustrations";
import { heroSectionData } from "../../assets/assets";
import api from "../../config/api";
import { getErrorMessage } from "../../lib/errors";

const perks = ["See every assigned delivery in one place", "Share your live location with customers", "Confirm drop-offs securely with an OTP"];

export default function DeliveryLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    if (localStorage.getItem("delivery_token") && localStorage.getItem("delivery_partner")) return <Navigate to="/delivery" replace />;

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post("/delivery/login", { email, password });
            localStorage.setItem("delivery_token", data.token);
            localStorage.setItem("delivery_partner", JSON.stringify(data.partner));
            toast.success(`Welcome back, ${data.partner?.name?.split(" ")[0] ?? "partner"}!`);
            navigate("/delivery", { replace: true });
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-app-cream">
            {/* Brand panel */}
            <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-app-green p-12 text-white lg:flex xl:p-16">
                <img src={heroSectionData.hero_image} alt="" className="pointer-events-none absolute inset-0 size-full object-cover opacity-10" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(249,115,22,0.18),transparent_40%)]" />
                <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:22px_22px]" />
                <Logo tone="light" label="Partner" className="relative" />
                <ScooterArt className="relative mx-auto h-auto w-full max-w-lg" />
                <div className="relative">
                    <h2 className="font-serif text-4xl leading-tight">
                        Deliver freshness, <span className="text-orange-300 italic">on time.</span>
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
                    <Logo label="Partner" className="lg:hidden" />
                </div>

                <div className="flex flex-1 items-center justify-center py-10">
                    <div className="w-full max-w-md animate-fade-in">
                        <ScooterArt className="mx-auto mb-6 h-auto w-56 lg:hidden" />
                        <h1 className="text-3xl font-semibold tracking-tight text-app-green">Partner sign in</h1>
                        <p className="mt-2 text-app-text-light">Sign in to see your assigned deliveries.</p>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                            <div>
                                <label htmlFor="dl-email" className="field-label">
                                    Email address
                                </label>
                                <div className="relative">
                                    <MailIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-400" />
                                    <input id="dl-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="partner@example.com" className="field h-12 pl-11" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="dl-password" className="field-label">
                                    Password
                                </label>
                                <div className="relative">
                                    <LockIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-400" />
                                    <input id="dl-password" type={showPassword ? "text" : "password"} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="field h-12 pr-12 pl-11" />
                                    <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-2 text-zinc-400 hover:bg-app-cream hover:text-app-green">
                                        {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-dark mt-2 h-12 w-full rounded-xl text-base">
                                {loading && <Loader2Icon className="size-5 animate-spin" />}
                                {loading ? "Signing in…" : "Sign in"}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-app-text-light">Accounts are created by your store admin. Contact them if you can't sign in.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
