import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRightIcon, PartyPopperIcon, ShoppingBagIcon, TruckIcon, XIcon } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useOverlay } from "../hooks/useOverlay";
import { FREE_DELIVERY_THRESHOLD, formatPrice, getOrderPricing, pluralize } from "../lib/format";
import { EmptyCartArt } from "./illustrations";
import EmptyState from "./ui/EmptyState";
import QuantityStepper from "./ui/QuantityStepper";

const CartSidebar = () => {
    const { items, updateQuantity, removeFromCart, cartTotal, cartCount, isCartOpen, setIsCartOpen } = useCart();
    const navigate = useNavigate();
    const panelRef = useRef<HTMLElement>(null);

    const close = () => setIsCartOpen(false);
    useOverlay(isCartOpen, close);

    useEffect(() => {
        if (isCartOpen) panelRef.current?.focus();
    }, [isCartOpen]);

    const { deliveryFee } = getOrderPricing(cartTotal);
    const freeDelivery = deliveryFee === 0;
    const remaining = FREE_DELIVERY_THRESHOLD - cartTotal;
    const progress = Math.min(100, (cartTotal / FREE_DELIVERY_THRESHOLD) * 100);

    const goTo = (path: string) => {
        close();
        navigate(path);
    };

    return (
        <div className={`fixed inset-0 z-60 ${isCartOpen ? "" : "pointer-events-none"}`} inert={!isCartOpen}>
            {/* Overlay */}
            <div onClick={close} aria-hidden="true" className={`absolute inset-0 bg-app-green/40 backdrop-blur-[2px] transition-opacity duration-300 ${isCartOpen ? "opacity-100" : "opacity-0"}`} />

            {/* Panel */}
            <aside
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Shopping cart"
                tabIndex={-1}
                className={`absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl outline-none transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-app-border px-5 py-4">
                    <div className="flex items-center gap-2.5">
                        <ShoppingBagIcon className="size-5 text-app-green" />
                        <h2 className="text-lg font-semibold text-app-green">Your cart</h2>
                        {cartCount > 0 && <span className="rounded-full bg-app-cream px-2 py-0.5 text-xs font-semibold text-app-text-light">{pluralize(cartCount, "item")}</span>}
                    </div>
                    <button type="button" onClick={close} aria-label="Close cart" className="rounded-lg p-2 text-app-text-light hover:bg-app-cream hover:text-app-green">
                        <XIcon className="size-5" />
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center">
                        <EmptyState
                            art={EmptyCartArt}
                            title="Your cart is empty"
                            description="Looks like you haven't added anything yet. Explore fresh produce and daily essentials."
                            action={
                                <button type="button" onClick={() => goTo("/products")} className="btn btn-primary">
                                    Start shopping <ArrowRightIcon className="size-4" />
                                </button>
                            }
                        />
                    </div>
                ) : (
                    <>
                        {/* Free delivery progress */}
                        <div className="mx-5 mt-4 rounded-xl bg-app-cream px-4 py-3">
                            <p className="flex items-center gap-2 text-sm text-app-green">
                                {freeDelivery ? (
                                    <>
                                        <PartyPopperIcon className="size-4 shrink-0 text-app-orange" />
                                        <span className="font-medium">You've unlocked free delivery!</span>
                                    </>
                                ) : (
                                    <>
                                        <TruckIcon className="size-4 shrink-0 text-app-orange" />
                                        <span>{remaining > 0 ? <>Add <strong className="font-semibold">{formatPrice(remaining)}</strong> more for free delivery</> : "Add any item to get free delivery"}</span>
                                    </>
                                )}
                            </p>
                            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white" role="progressbar" aria-label="Progress to free delivery" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
                                <div className={`h-full rounded-full transition-[width] duration-500 ${freeDelivery ? "bg-app-success" : "bg-app-orange"}`} style={{ width: `${progress}%` }} />
                            </div>
                        </div>

                        {/* Items */}
                        <ul className="flex-1 divide-y divide-app-border/70 overflow-y-auto px-5">
                            {items.map(({ product, quantity }) => (
                                <li key={product.id} className="flex gap-3 py-4">
                                    <Link to={`/products/${product.id}`} onClick={close} className="size-20 shrink-0 rounded-xl bg-app-cream p-2">
                                        <img src={product.image} alt={product.name} className="size-full object-contain mix-blend-multiply" />
                                    </Link>
                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <div className="flex items-start justify-between gap-2">
                                            <Link to={`/products/${product.id}`} onClick={close} className="line-clamp-2 rounded text-sm font-medium text-app-text hover:text-app-green-lighter">
                                                {product.name}
                                            </Link>
                                            <button type="button" onClick={() => removeFromCart(product.id)} aria-label={`Remove ${product.name}`} className="-mt-1 -mr-1 rounded-md p-1 text-zinc-400 hover:bg-red-50 hover:text-app-error">
                                                <XIcon className="size-4" />
                                            </button>
                                        </div>
                                        <p className="mt-0.5 text-xs text-app-text-light">
                                            {product.unit} · {formatPrice(product.price)}
                                        </p>
                                        <div className="mt-auto flex items-center justify-between pt-2">
                                            <QuantityStepper quantity={quantity} max={product.stock} label={product.name} variant="outline" size="md" trashAtOne onChange={(q) => updateQuantity(product.id, q)} />
                                            <span className="text-sm font-semibold text-app-green">{formatPrice(product.price * quantity)}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Summary */}
                        <div className="space-y-3 border-t border-app-border px-5 pt-4 pb-5">
                            <dl className="space-y-1.5 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-app-text-light">Subtotal</dt>
                                    <dd className="font-medium">{formatPrice(cartTotal)}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-app-text-light">Delivery</dt>
                                    <dd className="font-medium">{freeDelivery ? <span className="text-app-success">Free</span> : formatPrice(deliveryFee)}</dd>
                                </div>
                            </dl>
                            <p className="text-xs text-app-text-light">Taxes are calculated at checkout.</p>
                            <button type="button" onClick={() => goTo("/checkout")} className="btn btn-primary w-full justify-between rounded-2xl px-5 py-3.5 text-base">
                                <span>Checkout</span>
                                <span className="flex items-center gap-2">
                                    {formatPrice(cartTotal + deliveryFee)} <ArrowRightIcon className="size-4" />
                                </span>
                            </button>
                        </div>
                    </>
                )}
            </aside>
        </div>
    );
};

export default CartSidebar;
