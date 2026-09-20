import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

interface SectionHeaderProps {
    eyebrow?: string;
    title: ReactNode;
    description?: ReactNode;
    linkTo?: string;
    linkLabel?: string;
    id?: string;
}

export default function SectionHeader({ eyebrow, title, description, linkTo, linkLabel = "View all", id }: SectionHeaderProps) {
    return (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 sm:mb-8">
            <div>
                {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
                <h2 id={id} className="section-title">
                    {title}
                </h2>
                {description && <p className="mt-1.5 text-sm text-app-text-light">{description}</p>}
            </div>
            {linkTo && (
                <Link to={linkTo} className="group inline-flex items-center gap-1 rounded text-sm font-semibold text-app-orange hover:text-app-orange-dark">
                    {linkLabel}
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
            )}
        </div>
    );
}
