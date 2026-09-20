import { Link } from "react-router-dom";
import { ChevronRightIcon, HomeIcon } from "lucide-react";

export default function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-app-text-light">
                <li>
                    <Link to="/" aria-label="Home" className="flex items-center rounded hover:text-app-green">
                        <HomeIcon className="size-4" />
                    </Link>
                </li>
                {items.map((item) => (
                    <li key={item.label} className="flex min-w-0 items-center gap-1.5">
                        <ChevronRightIcon className="size-3.5 shrink-0 text-zinc-300" />
                        {item.to ? (
                            <Link to={item.to} className="rounded hover:text-app-green">
                                {item.label}
                            </Link>
                        ) : (
                            <span aria-current="page" className="max-w-[16rem] truncate font-medium text-app-green">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
