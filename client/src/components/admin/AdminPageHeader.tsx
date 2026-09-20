import type { ReactNode } from "react";

export default function AdminPageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
    return (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 lg:mb-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-app-green sm:text-3xl">{title}</h1>
                {description && <p className="mt-1 text-sm text-app-text-light">{description}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
    );
}
