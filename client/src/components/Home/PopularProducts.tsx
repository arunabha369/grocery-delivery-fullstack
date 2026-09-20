import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Product } from "../../types";
import ProductCard from "../ProductCard";
import SectionHeader from "../ui/SectionHeader";
import { ProductGridSkeleton } from "../ui/Skeleton";
import api from "../../config/api";
import { getErrorMessage } from "../../lib/errors";

const GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 xl:gap-5";

const PopularProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/products")
            .then(({ data }) => {
                const inStock: Product[] = data.products.filter((p: Product) => p.stock > 0);
                // The API has no rating sort, so rank by rating, then by review count
                inStock.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
                setProducts(inStock.slice(0, 10));
            })
            .catch((error) => toast.error(getErrorMessage(error)))
            .finally(() => setLoading(false));
    }, []);

    if (!loading && products.length === 0) return null;

    return (
        <section aria-labelledby="popular-title" className="pt-16 sm:pt-20">
            <SectionHeader id="popular-title" eyebrow="Top rated" title="Popular right now" description="Customer favourites, loved for freshness and value." linkTo="/products" />
            {loading ? (
                <ProductGridSkeleton count={10} className={GRID} />
            ) : (
                <div className={GRID}>
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default PopularProducts;
