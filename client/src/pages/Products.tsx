import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
import type { Product } from "../types";
import { categoriesData } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import FilterPanel, { type FilterKey } from "../components/FilterPanel";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import EmptyState from "../components/ui/EmptyState";
import Modal from "../components/ui/Modal";
import { ProductGridSkeleton } from "../components/ui/Skeleton";
import { NoResultsArt } from "../components/illustrations";
import api from "../config/api";
import { getErrorMessage } from "../lib/errors";
import { currency, pluralize } from "../lib/format";

const PAGE_SIZE = 12;
const GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4 xl:gap-5";

const sortOptions = [
    { value: "", label: "Newest" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "rating", label: "Top rated" },
    { value: "name", label: "Name: A to Z" },
];

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [result, setResult] = useState<{ category: string; products: Product[] } | null>(null);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const category = searchParams.get("category") || "";
    const organic = searchParams.get("organic") === "true";
    const sort = searchParams.get("sort") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const requestedPage = Math.max(1, Number(searchParams.get("page")) || 1);

    // Only the category is filtered by the API; everything else is applied client-side
    const loading = result?.category !== category;

    useEffect(() => {
        let ignore = false;
        const query = category ? `?category=${encodeURIComponent(category)}` : "";
        api.get(`/products${query}`)
            .then(({ data }) => {
                if (!ignore) setResult({ category, products: data.products });
            })
            .catch((error) => {
                if (ignore) return;
                toast.error(getErrorMessage(error));
                setResult({ category, products: [] });
            });
        return () => {
            ignore = true;
        };
    }, [category]);

    const filtered = useMemo(() => {
        const min = minPrice ? Number(minPrice) : -Infinity;
        const max = maxPrice ? Number(maxPrice) : Infinity;
        // Out-of-stock products are hidden: the admin "remove" action sets stock to 0
        const list = (result?.products ?? []).filter((p) => p.stock > 0 && (!organic || p.isOrganic) && p.price >= min && p.price <= max);
        switch (sort) {
            case "price_asc":
                return list.sort((a, b) => a.price - b.price);
            case "price_desc":
                return list.sort((a, b) => b.price - a.price);
            case "rating":
                return list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
            case "name":
                return list.sort((a, b) => a.name.localeCompare(b.name));
            default:
                return list;
        }
    }, [result, organic, minPrice, maxPrice, sort]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const page = Math.min(requestedPage, totalPages);
    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const updateFilter = (key: FilterKey, value: string) => {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key !== "page") next.delete("page");
        // Typing a price shouldn't create a history entry per keystroke
        setSearchParams(next, { replace: key === "minPrice" || key === "maxPrice" });
    };

    const goToPage = (p: number) => {
        updateFilter("page", p === 1 ? "" : String(p));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Category and sort order aren't filters, so they survive "clear"
    const clearFilters = () => {
        const next = new URLSearchParams();
        if (category) next.set("category", category);
        if (sort) next.set("sort", sort);
        setSearchParams(next);
    };

    const activeCategory = categoriesData.find((c) => c.slug === category);
    const hasFilters = Boolean(organic || minPrice || maxPrice);
    const activeFilterCount = [organic, minPrice, maxPrice].filter(Boolean).length;

    const chips = [
        organic && { key: "organic" as const, label: "Organic only" },
        minPrice && { key: "minPrice" as const, label: `Min ${currency}${minPrice}` },
        maxPrice && { key: "maxPrice" as const, label: `Max ${currency}${maxPrice}` },
    ].filter(Boolean) as { key: FilterKey; label: string }[];

    const filterPanel = <FilterPanel category={category} organic={organic} minPrice={minPrice} maxPrice={maxPrice} updateFilter={updateFilter} clearFilters={clearFilters} hasFilters={hasFilters} />;

    return (
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-20 sm:px-6 lg:px-8">
            <Breadcrumbs items={activeCategory ? [{ label: "Products", to: "/products" }, { label: activeCategory.name }] : [{ label: "Products" }]} />

            {/* Page header */}
            <header className="relative mb-6 overflow-hidden rounded-3xl px-6 py-7 sm:px-8 sm:py-9" style={{ backgroundColor: activeCategory?.tint ?? "#f0ebe3" }}>
                <p className="eyebrow">{activeCategory ? "Category" : "Shop"}</p>
                <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-app-green sm:text-3xl">{activeCategory ? activeCategory.name : "All products"}</h1>
                <p className="mt-1 max-w-[60%] text-sm text-app-text-light">{loading ? "Loading products…" : `${pluralize(filtered.length, "product")} available`}</p>
                <div className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center sm:right-8">
                    {activeCategory ? (
                        <img src={activeCategory.image} alt="" className="size-24 object-contain mix-blend-multiply sm:size-32" />
                    ) : (
                        <>
                            {[categoriesData[2], categoriesData[0], categoriesData[1]].map((c, i) => (
                                <img key={c.slug} src={c.image} alt="" className={`object-contain mix-blend-multiply ${i === 1 ? "relative size-24 sm:size-32" : "-mx-4 hidden size-20 sm:block sm:size-24"}`} />
                            ))}
                        </>
                    )}
                </div>
            </header>

            {/* Quick category switcher (mobile/tablet) */}
            <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 lg:hidden">
                {[{ slug: "", name: "All" }, ...categoriesData].map((cat) => (
                    <button key={cat.slug || "all"} type="button" onClick={() => updateFilter("category", cat.slug)} aria-pressed={category === cat.slug} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${category === cat.slug ? "bg-app-green text-white" : "bg-white text-zinc-600 ring-1 ring-app-border ring-inset hover:text-app-green"}`}>
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="flex gap-8 xl:gap-10">
                {/* Sidebar - desktop */}
                <aside className="hidden w-64 shrink-0 lg:block" aria-label="Filters">
                    <div className="card sticky top-28 p-4">{filterPanel}</div>
                </aside>

                <section className="min-w-0 flex-1" aria-label="Products">
                    {/* Toolbar */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-app-text-light">{!loading && filtered.length > 0 && <>Showing <span className="font-medium text-app-text">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> of {filtered.length}</>}</p>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setFiltersOpen(true)} className="btn btn-outline h-10 rounded-xl px-3.5 lg:hidden">
                                <SlidersHorizontalIcon className="size-4" /> Filters
                                {activeFilterCount > 0 && <span className="flex-center size-5 rounded-full bg-app-orange text-[11px] text-white">{activeFilterCount}</span>}
                            </button>
                            <label className="relative">
                                <span className="sr-only">Sort products</span>
                                <select value={sort} onChange={(e) => updateFilter("sort", e.target.value)} className="field h-10 appearance-none py-0 pr-9 pl-3.5 font-medium">
                                    {sortOptions.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.value ? o.label : "Sort: Newest"}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-app-text-light" />
                            </label>
                        </div>
                    </div>

                    {/* Active filter chips */}
                    {chips.length > 0 && (
                        <div className="mb-5 flex flex-wrap items-center gap-2">
                            {chips.map((chip) => (
                                <button key={chip.key} type="button" onClick={() => updateFilter(chip.key, "")} className="inline-flex items-center gap-1.5 rounded-full bg-app-green/[0.07] py-1.5 pr-2.5 pl-3 text-xs font-medium text-app-green hover:bg-app-green/[0.12]" aria-label={`Remove filter: ${chip.label}`}>
                                    {chip.label} <XIcon className="size-3.5" />
                                </button>
                            ))}
                            <button type="button" onClick={clearFilters} className="rounded px-1 text-xs font-medium text-app-text-light underline-offset-2 hover:text-app-error hover:underline">
                                Clear all
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <ProductGridSkeleton count={8} className={GRID} />
                    ) : filtered.length === 0 ? (
                        <EmptyState
                            art={NoResultsArt}
                            title="No products match your filters"
                            description="Try widening the price range or switching off some filters to see more items."
                            action={
                                hasFilters ? (
                                    <button type="button" onClick={clearFilters} className="btn btn-dark">
                                        Clear filters
                                    </button>
                                ) : (
                                    <button type="button" onClick={() => updateFilter("category", "")} className="btn btn-dark">
                                        View all products
                                    </button>
                                )
                            }
                        />
                    ) : (
                        <div className={GRID}>
                            {pageItems.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1.5">
                            <button type="button" onClick={() => goToPage(page - 1)} disabled={page === 1} aria-label="Previous page" className="flex-center size-10 rounded-xl bg-white text-app-green ring-1 ring-app-border ring-inset hover:bg-app-cream disabled:opacity-40">
                                <ChevronLeftIcon className="size-4" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button key={p} type="button" onClick={() => goToPage(p)} aria-current={p === page ? "page" : undefined} className={`size-10 rounded-xl text-sm font-semibold ${p === page ? "bg-app-green text-white" : "bg-white text-app-text-light ring-1 ring-app-border ring-inset hover:bg-app-cream hover:text-app-green"}`}>
                                    {p}
                                </button>
                            ))}
                            <button type="button" onClick={() => goToPage(page + 1)} disabled={page === totalPages} aria-label="Next page" className="flex-center size-10 rounded-xl bg-white text-app-green ring-1 ring-app-border ring-inset hover:bg-app-cream disabled:opacity-40">
                                <ChevronRightIcon className="size-4" />
                            </button>
                        </nav>
                    )}
                </section>
            </div>

            {/* Filters - mobile bottom sheet */}
            <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
                {filterPanel}
                <button type="button" onClick={() => setFiltersOpen(false)} className="btn btn-primary mt-6 w-full py-3">
                    Show {pluralize(filtered.length, "product")}
                </button>
            </Modal>
        </div>
    );
};

export default Products;
