import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ZapIcon } from "lucide-react";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/ui/EmptyState";
import { ProductGridSkeleton } from "../components/ui/Skeleton";
import { NoDealsArt } from "../components/illustrations";
import api from "../config/api";
import { getErrorMessage } from "../lib/errors";

const GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:gap-5";

const FlashDeals = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/products/flash-deals")
            .then(({ data }) => {
                const deals: Product[] = data.products.filter((p: Product) => p.stock > 0);
                // Biggest savings first
                setProducts(deals.sort((a, b) => b.discount - a.discount));
            })
            .catch((error) => toast.error(getErrorMessage(error)))
            .finally(() => setLoading(false));
    }, []);

    const bestDiscount = products.reduce((max, p) => Math.max(max, p.discount), 0);

    return (
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-20 sm:px-6 lg:px-8">
            {/* Banner */}
            <header className="relative mb-8 overflow-hidden rounded-[2rem] bg-linear-to-br from-app-orange to-app-orange-dark px-6 py-10 text-white sm:px-10 sm:py-12">
                <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="relative flex items-center justify-between gap-6">
                    <div className="max-w-lg">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/25 ring-inset">
                            <ZapIcon className="size-3.5 fill-current" /> Limited-time offers
                        </span>
                        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Flash deals</h1>
                        <p className="mt-3 text-white/85">
                            {bestDiscount > 0 ? `Save up to ${bestDiscount}% on your favourite products. ` : "Special prices on your favourite products. "}
                            Grab them before they're gone!
                        </p>
                    </div>
                    <NoDealsArt className="hidden h-auto w-56 shrink-0 sm:block lg:w-64" />
                </div>
            </header>

            {loading ? (
                <ProductGridSkeleton count={8} className={GRID} />
            ) : products.length === 0 ? (
                <EmptyState
                    art={NoDealsArt}
                    title="No deals right now"
                    description="Our next round of offers is on its way. Check back soon — or browse the full range in the meantime."
                    action={
                        <Link to="/products" className="btn btn-dark">
                            Browse products
                        </Link>
                    }
                />
            ) : (
                <div className={GRID}>
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FlashDeals;
