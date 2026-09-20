import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import type { Product } from "../types";
import { categoriesData } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import EmptyState from "../components/ui/EmptyState";
import { ProductGridSkeleton } from "../components/ui/Skeleton";
import { NoResultsArt } from "../components/illustrations";
import api from "../config/api";
import { getErrorMessage } from "../lib/errors";
import { pluralize } from "../lib/format";

const GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 xl:gap-5";

const CategoryChips = () => (
    <div className="mt-2 flex max-w-xl flex-wrap justify-center gap-2">
        {categoriesData.slice(0, 6).map((cat) => (
            <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 pr-3.5 pl-1.5 text-sm font-medium text-zinc-700 ring-1 ring-app-border ring-inset hover:text-app-green hover:ring-app-green/30">
                <span className="flex-center size-7 rounded-full p-0.5" style={{ backgroundColor: cat.tint }}>
                    <img src={cat.image} alt="" loading="lazy" className="size-full rounded-full object-contain mix-blend-multiply" />
                </span>
                {cat.name}
            </Link>
        ))}
    </div>
);

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = (searchParams.get("q") || "").trim();
    const [result, setResult] = useState<{ query: string; products: Product[] } | null>(null);

    const loading = Boolean(query) && result?.query !== query;
    const products = result?.query === query ? result.products : [];

    useEffect(() => {
        if (!query) return;
        let ignore = false;
        api.get(`/products?search=${encodeURIComponent(query)}`)
            .then(({ data }) => {
                // Out-of-stock products are delisted (the admin "remove" action sets stock to 0)
                if (!ignore) setResult({ query, products: data.products.filter((p: Product) => p.stock > 0) });
            })
            .catch((error) => {
                if (ignore) return;
                toast.error(getErrorMessage(error));
                setResult({ query, products: [] });
            });
        return () => {
            ignore = true;
        };
    }, [query]);

    return (
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-20 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ label: "Search" }]} />

            {!query ? (
                <EmptyState art={NoResultsArt} title="What are you looking for?" description="Use the search bar to find fruits, vegetables, dairy, snacks and more — or start with a popular category." action={<CategoryChips />} />
            ) : (
                <>
                    <div className="mb-8">
                        <p className="eyebrow">Search results</p>
                        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight break-words text-app-green sm:text-3xl">“{query}”</h1>
                        <p className="mt-1 text-sm text-app-text-light">{loading ? "Searching…" : `${pluralize(products.length, "item")} found`}</p>
                    </div>

                    {loading ? (
                        <ProductGridSkeleton count={10} className={GRID} />
                    ) : products.length === 0 ? (
                        <EmptyState
                            art={NoResultsArt}
                            title={`No results for “${query}”`}
                            description="Check the spelling or try a more general term. You can also browse one of these categories:"
                            action={
                                <div className="flex flex-col items-center gap-5">
                                    <CategoryChips />
                                    <Link to="/products" className="btn btn-dark">
                                        Browse all products
                                    </Link>
                                </div>
                            }
                        />
                    ) : (
                        <div className={GRID}>
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SearchResults;
