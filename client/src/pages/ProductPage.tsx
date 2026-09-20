import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ClockIcon, LeafIcon, ShieldCheckIcon, ShoppingBagIcon, StarIcon, TruckIcon } from "lucide-react";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";
import { categoriesData } from "../assets/assets";
import DummyReviewsSection from "../assets/DummyReviewsSection";
import ProductCard from "../components/ProductCard";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import QuantityStepper from "../components/ui/QuantityStepper";
import SectionHeader from "../components/ui/SectionHeader";
import api from "../config/api";
import { categoryLabel, FREE_DELIVERY_THRESHOLD, formatPrice } from "../lib/format";

function ProductDetails({ product }: { product: Product }) {
    const { items, addToCart, updateQuantity, setIsCartOpen } = useCart();
    const [localQuantity, setLocalQuantity] = useState(1);

    const cartItem = items.find((item) => item.product.id === product.id);
    const outOfStock = product.stock <= 0;
    const category = categoriesData.find((c) => c.slug === product.category);
    const savings = product.originalPrice > product.price ? product.originalPrice - product.price : 0;

    const perks = [
        { icon: TruckIcon, title: "Free delivery", text: `On orders over ${formatPrice(FREE_DELIVERY_THRESHOLD)}` },
        { icon: ClockIcon, title: "Same day", text: "Express delivery" },
        { icon: ShieldCheckIcon, title: "Secure pay", text: "Card or cash" },
    ];

    return (
        <section className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            {/* Image */}
            <div className="relative flex-center aspect-square overflow-hidden rounded-3xl p-10 sm:p-14" style={{ backgroundColor: category?.tint ?? "#f0ebe3" }}>
                <img src={product.image} alt={product.name} className={`max-h-full w-auto object-contain mix-blend-multiply animate-fade-in ${outOfStock ? "opacity-60 grayscale" : ""}`} />
                <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                    {product.discount > 0 && <span className="rounded-lg bg-app-orange px-2.5 py-1 text-xs font-bold tracking-wide text-white uppercase">{product.discount}% off</span>}
                    {product.isOrganic && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                            <LeafIcon className="size-3.5" /> Organic
                        </span>
                    )}
                </div>
            </div>

            {/* Details */}
            <div className="flex flex-col lg:py-4">
                <Link to={`/products?category=${product.category}`} className="inline-flex w-fit items-center gap-2 rounded-full bg-white py-1 pr-3.5 pl-1 text-xs font-semibold text-app-green ring-1 ring-app-border ring-inset hover:ring-app-green/30">
                    {category && (
                        <span className="flex-center size-6 rounded-full p-0.5" style={{ backgroundColor: category.tint }}>
                            <img src={category.image} alt="" className="size-full rounded-full object-contain mix-blend-multiply" />
                        </span>
                    )}
                    {category?.name ?? categoryLabel(product.category)}
                </Link>

                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-app-green sm:text-4xl">{product.name}</h1>

                {product.rating > 0 && (
                    <a href="#reviews" className="mt-3 flex w-fit items-center gap-2 rounded text-sm">
                        <span className="flex items-center gap-0.5" aria-label={`Rated ${product.rating} out of 5`}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon key={star} className={`size-4 ${star <= Math.round(product.rating) ? "fill-app-warning text-app-warning" : "fill-app-border text-app-border"}`} />
                            ))}
                        </span>
                        <span className="font-semibold">{product.rating.toFixed(1)}</span>
                        <span className="text-app-text-light underline-offset-2 hover:underline">({product.reviewCount} reviews)</span>
                    </a>
                )}

                <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2">
                    <span className="text-4xl font-semibold tracking-tight text-app-green">{formatPrice(product.price)}</span>
                    {savings > 0 && (
                        <>
                            <span className="text-lg text-app-text-light line-through">{formatPrice(product.originalPrice)}</span>
                            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">You save {formatPrice(savings)}</span>
                        </>
                    )}
                </div>
                <p className="mt-1 text-sm text-app-text-light">Per {product.unit}</p>

                {product.description && <p className="mt-6 leading-relaxed text-zinc-600">{product.description}</p>}

                <p className={`mt-6 flex items-center gap-2 text-sm font-medium ${outOfStock ? "text-app-error" : "text-app-success"}`}>
                    <span className={`size-2 rounded-full ${outOfStock ? "bg-app-error" : "bg-emerald-500"}`} />
                    {outOfStock ? "Out of stock" : product.stock < 10 ? `Only ${product.stock} left in stock` : "In stock"}
                </p>

                {/* Quantity + cart */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                    {cartItem ? (
                        <>
                            <QuantityStepper quantity={cartItem.quantity} max={product.stock} label={product.name} variant="outline" size="lg" trashAtOne onChange={(q) => updateQuantity(product.id, q)} />
                            <button type="button" onClick={() => setIsCartOpen(true)} className="btn btn-dark h-12 flex-1 rounded-full text-base sm:flex-none sm:px-8">
                                <ShoppingBagIcon className="size-5" /> View cart
                            </button>
                        </>
                    ) : (
                        <>
                            <QuantityStepper quantity={localQuantity} min={1} max={Math.max(1, product.stock)} label={product.name} variant="outline" size="lg" onChange={setLocalQuantity} />
                            <button
                                type="button"
                                disabled={outOfStock}
                                onClick={() => {
                                    addToCart(product, Math.min(localQuantity, product.stock));
                                    toast.success(`${product.name} added to cart`);
                                }}
                                className="btn btn-primary h-12 flex-1 rounded-full text-base sm:flex-none sm:px-8"
                            >
                                <ShoppingBagIcon className="size-5" /> {outOfStock ? "Out of stock" : "Add to cart"}
                            </button>
                        </>
                    )}
                </div>
                {cartItem && <p className="mt-2.5 text-sm text-app-success">In your cart · {formatPrice(product.price * cartItem.quantity)}</p>}

                <ul className="mt-8 grid grid-cols-3 gap-2 border-t border-app-border pt-6 sm:gap-3">
                    {perks.map((perk) => (
                        <li key={perk.title} className="flex flex-col gap-2 rounded-2xl bg-white p-3 ring-1 ring-app-border/70 ring-inset sm:flex-row sm:items-center sm:p-3.5">
                            <span className="flex-center size-9 shrink-0 rounded-xl bg-app-cream text-app-green">
                                <perk.icon className="size-4" />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-xs font-semibold text-app-green sm:text-sm">{perk.title}</span>
                                <span className="block text-[11px] text-app-text-light sm:text-xs">{perk.text}</span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

function ProductPageSkeleton() {
    return (
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12" role="status" aria-label="Loading product">
            <div className="skeleton aspect-square rounded-3xl" />
            <div className="space-y-4 lg:py-4">
                <div className="skeleton h-7 w-32 rounded-full" />
                <div className="skeleton h-10 w-3/4" />
                <div className="skeleton h-5 w-40" />
                <div className="skeleton h-11 w-36" />
                <div className="skeleton h-20 w-full" />
                <div className="skeleton h-12 w-full rounded-full" />
            </div>
        </div>
    );
}

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<{ id: string; product: Product; related: Product[] } | null>(null);

    const loading = data?.id !== id;

    useEffect(() => {
        let ignore = false;
        api.get(`/products/${id}`)
            .then(async ({ data: res }) => {
                const product: Product = res.product;
                let related: Product[] = [];
                try {
                    const { data: rel } = await api.get(`/products?category=${encodeURIComponent(product.category)}`);
                    related = rel.products.filter((p: Product) => p.id !== product.id && p.stock > 0);
                } catch {
                    // Related products are optional — the page still works without them
                }
                if (!ignore && id) setData({ id, product, related });
            })
            .catch(() => {
                if (ignore) return;
                toast.error("That product could not be found");
                navigate("/products", { replace: true });
            });
        return () => {
            ignore = true;
        };
    }, [id, navigate]);

    const product = loading ? null : data?.product;
    const category = product ? categoriesData.find((c) => c.slug === product.category) : undefined;

    return (
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-20 sm:px-6 lg:px-8">
            <Breadcrumbs
                items={
                    product
                        ? [
                              { label: "Products", to: "/products" },
                              { label: category?.name ?? categoryLabel(product.category), to: `/products?category=${product.category}` },
                              { label: product.name },
                          ]
                        : [{ label: "Products", to: "/products" }]
                }
            />

            {!product || !data ? (
                <ProductPageSkeleton />
            ) : (
                <>
                    <ProductDetails key={product.id} product={product} />

                    {product.reviewCount > 0 && <DummyReviewsSection product={product} />}

                    {data.related.length > 0 && (
                        <section aria-labelledby="related-title" className="mt-16 sm:mt-20">
                            <SectionHeader id="related-title" eyebrow="You may also like" title={`More from ${category?.name ?? categoryLabel(product.category)}`} linkTo={`/products?category=${product.category}`} />
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 xl:gap-5">
                                {data.related.slice(0, 5).map((rp) => (
                                    <ProductCard key={rp.id} product={rp} />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductPage;
