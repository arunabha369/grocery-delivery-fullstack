import { Link } from "react-router-dom";
import { LeafIcon, PlusIcon, StarIcon } from "lucide-react";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";
import QuantityStepper from "./ui/QuantityStepper";

const ProductCard = ({ product }: { product: Product }) => {
    const { items, addToCart, updateQuantity } = useCart();

    const quantity = items.find((item) => item.product.id === product.id)?.quantity ?? 0;
    const outOfStock = product.stock <= 0;

    return (
        <article className="group relative flex flex-col rounded-2xl border border-app-border/70 bg-white p-2 shadow-card transition duration-300 animate-fade-in hover:-translate-y-0.5 hover:shadow-card-hover">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-xl bg-app-cream/80">
                {/* multiply blends white product-photo backgrounds into the tile colour */}
                <img src={product.image} alt="" loading="lazy" className={`size-full object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105 ${outOfStock ? "opacity-50 grayscale" : ""}`} />

                <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
                    {product.discount > 0 && <span className="rounded-md bg-app-orange px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">{product.discount}% off</span>}
                    {product.isOrganic && (
                        <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-600/15 ring-inset">
                            <LeafIcon className="size-2.5" /> Organic
                        </span>
                    )}
                </div>

                {outOfStock && <span className="absolute inset-x-2 bottom-2 rounded-lg bg-white/90 py-1 text-center text-xs font-semibold text-app-text-light backdrop-blur-sm">Out of stock</span>}
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col px-1.5 pt-3 pb-1.5">
                <h3 className="line-clamp-2 min-h-10 text-sm leading-5 font-medium text-app-text">
                    {/* Stretched link: the whole card is clickable, the cart controls sit above it */}
                    <Link to={`/products/${product.id}`} className="rounded after:absolute after:inset-0 after:rounded-2xl after:content-[''] hover:text-app-green-lighter">
                        {product.name}
                    </Link>
                </h3>

                <div className="mt-1.5 flex h-4 items-center gap-1 text-xs">
                    <span className="text-app-text-light">{product.unit}</span>
                    {product.rating > 0 && (
                        <>
                            <span className="mx-0.5 text-zinc-300" aria-hidden="true">
                                ·
                            </span>
                            <StarIcon className="size-3.5 fill-app-warning text-app-warning" />
                            <span className="font-medium text-app-text">{product.rating.toFixed(1)}</span>
                            <span className="text-app-text-light">({product.reviewCount})</span>
                        </>
                    )}
                </div>

                <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                    <div className="min-w-0 leading-tight">
                        <p className="text-base font-semibold text-app-green">{formatPrice(product.price)}</p>
                        {product.originalPrice > product.price && <p className="text-xs text-app-text-light line-through">{formatPrice(product.originalPrice)}</p>}
                    </div>

                    <div className="relative z-10">
                        {outOfStock ? (
                            <span className="inline-flex h-9 items-center rounded-full bg-zinc-100 px-3 text-xs font-semibold text-zinc-500">Sold out</span>
                        ) : quantity > 0 ? (
                            <QuantityStepper quantity={quantity} max={product.stock} label={product.name} onChange={(q) => updateQuantity(product.id, q)} />
                        ) : (
                            <button
                                type="button"
                                onClick={() => addToCart(product)}
                                aria-label={`Add ${product.name} to cart`}
                                className="inline-flex h-9 w-[5.75rem] items-center justify-center gap-1 rounded-full border border-app-orange/40 bg-orange-50 text-sm font-semibold text-app-orange-dark hover:border-app-orange hover:bg-app-orange hover:text-white active:scale-95"
                            >
                                <PlusIcon className="size-4" /> Add
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
