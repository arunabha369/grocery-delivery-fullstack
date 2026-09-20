import { Link } from "react-router-dom";

export function LogoMark({ className = "size-8" }: { className?: string }) {
    return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
            <rect width="32" height="32" rx="9" fill="#f97316" />
            <path d="M9.5 12.5H22.5L21.4 23.6C21.3 24.9 20.2 26 18.9 26H13.1C11.8 26 10.7 24.9 10.6 23.6Z" fill="#fff" />
            <path d="M13 12.5V11A3 3 0 0 1 19 11V12.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M15.9 23C13.6 22.8 12.6 21 13 18.8C15.3 18.9 16.6 20.5 15.9 23Z" fill="#3d6b4a" />
            <path d="M16.2 23C16.1 20.8 17.3 19.2 19.4 19C19.6 21.2 18.3 22.8 16.2 23Z" fill="#6fb26a" />
        </svg>
    );
}

interface LogoProps {
    tone?: "dark" | "light";
    to?: string;
    className?: string;
    label?: string;
}

export default function Logo({ tone = "dark", to = "/", className = "", label }: LogoProps) {
    return (
        <Link to={to} className={`inline-flex items-center gap-2.5 shrink-0 ${className}`} aria-label="Instacart home">
            <LogoMark />
            <span className={`text-xl font-semibold tracking-tight ${tone === "dark" ? "text-app-green" : "text-white"}`}>
                Insta<span className="text-app-orange">cart</span>
                {label && <span className={`ml-2 align-middle text-xs font-medium px-2 py-0.5 rounded-full ${tone === "dark" ? "bg-app-green/5 text-app-green/70" : "bg-white/10 text-white/80"}`}>{label}</span>}
            </span>
        </Link>
    );
}
