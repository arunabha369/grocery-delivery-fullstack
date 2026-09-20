import { CheckIcon, LayoutGridIcon, LeafIcon } from "lucide-react";
import { categoriesData } from "../assets/assets";
import { currency } from "../lib/format";

export type FilterKey = "category" | "organic" | "minPrice" | "maxPrice" | "sort" | "page";

interface FilterPanelProps {
    category: string;
    organic: boolean;
    minPrice: string;
    maxPrice: string;
    updateFilter: (key: FilterKey, value: string) => void;
    clearFilters: () => void;
    hasFilters: boolean;
}

const FilterPanel = ({ category, organic, minPrice, maxPrice, updateFilter, clearFilters, hasFilters }: FilterPanelProps) => {
    const invalidRange = minPrice !== "" && maxPrice !== "" && Number(minPrice) > Number(maxPrice);

    return (
        <div className="space-y-7">
            {/* Categories */}
            <fieldset>
                <legend className="mb-3 text-xs font-semibold tracking-[0.12em] text-app-text-light uppercase">Categories</legend>
                <div className="space-y-0.5">
                    {[{ slug: "", name: "All categories", image: "", tint: "" }, ...categoriesData].map((cat) => {
                        const active = category === cat.slug;
                        return (
                            <button
                                key={cat.slug || "all"}
                                type="button"
                                onClick={() => updateFilter("category", cat.slug)}
                                aria-pressed={active}
                                className={`flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left text-sm ${active ? "bg-app-green/[0.07] font-semibold text-app-green" : "text-zinc-600 hover:bg-app-cream hover:text-app-green"}`}
                            >
                                <span className="flex-center size-8 shrink-0 rounded-lg p-1" style={{ backgroundColor: cat.tint || "#f0ebe3" }}>
                                    {cat.image ? <img src={cat.image} alt="" loading="lazy" className="size-full object-contain mix-blend-multiply" /> : <LayoutGridIcon className="size-4 text-app-green" />}
                                </span>
                                <span className="flex-1">{cat.name}</span>
                                {active && <CheckIcon className="size-4 text-app-green" />}
                            </button>
                        );
                    })}
                </div>
            </fieldset>

            {/* Price range */}
            <fieldset>
                <legend className="mb-3 text-xs font-semibold tracking-[0.12em] text-app-text-light uppercase">Price range</legend>
                <div className="flex items-center gap-2">
                    {(["minPrice", "maxPrice"] as const).map((key, i) => (
                        <div key={key} className="contents">
                            {i === 1 && <span className="text-app-text-light">–</span>}
                            <label className="relative flex-1">
                                <span className="sr-only">{key === "minPrice" ? "Minimum price" : "Maximum price"}</span>
                                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-app-text-light">{currency}</span>
                                <input type="number" inputMode="numeric" min="0" placeholder={key === "minPrice" ? "Min" : "Max"} value={key === "minPrice" ? minPrice : maxPrice} onChange={(e) => updateFilter(key, e.target.value)} aria-invalid={invalidRange} className="field h-10 pr-2 pl-7" />
                            </label>
                        </div>
                    ))}
                </div>
                {invalidRange && <p className="mt-2 text-xs text-app-error">Minimum price is higher than the maximum.</p>}
            </fieldset>

            {/* Organic */}
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-emerald-50/60 px-3 py-3">
                <span className="flex items-center gap-2 text-sm font-medium text-app-green">
                    <LeafIcon className="size-4 text-emerald-600" /> Organic only
                </span>
                <input type="checkbox" role="switch" checked={organic} onChange={(e) => updateFilter("organic", e.target.checked ? "true" : "")} className="peer sr-only" />
                <span className="relative h-6 w-11 shrink-0 rounded-full bg-zinc-300 transition-colors peer-checked:bg-app-green peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-app-orange after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:content-[''] peer-checked:after:translate-x-5" />
            </label>

            {hasFilters && (
                <button type="button" onClick={clearFilters} className="btn btn-ghost w-full text-app-error hover:bg-red-50 hover:text-app-error">
                    Clear all filters
                </button>
            )}
        </div>
    );
};

export default FilterPanel;
