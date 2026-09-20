import type { ComponentType, ReactNode } from "react";

interface EmptyStateProps {
    art: ComponentType<{ className?: string }>;
    title: string;
    description?: ReactNode;
    action?: ReactNode;
    className?: string;
}

export default function EmptyState({ art: Art, title, description, action, className = "" }: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center px-4 py-10 text-center animate-fade-in ${className}`}>
            <Art className="h-auto w-52 sm:w-60" />
            <h2 className="mt-4 text-xl font-semibold text-app-green">{title}</h2>
            {description && <p className="mt-2 max-w-sm text-sm leading-relaxed text-app-text-light">{description}</p>}
            {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
        </div>
    );
}
