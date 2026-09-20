import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeftIcon, CheckIcon, ShieldCheckIcon, TruckIcon } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CheckoutAddress from "../components/Checkout/CheckoutAddress";
import CheckoutPayment from "../components/Checkout/CheckoutPayment";
import CheckoutReview from "../components/Checkout/CheckoutReview";
import EmptyState from "../components/ui/EmptyState";
import { EmptyCartArt } from "../components/illustrations";
import api from "../config/api";
import { getErrorMessage } from "../lib/errors";
import { FREE_DELIVERY_THRESHOLD, formatPrice, getOrderPricing, pluralize, TAX_RATE } from "../lib/format";

type Step = "address" | "payment" | "review";

const steps: { key: Step; label: string }[] = [
    { key: "address", label: "Address" },
    { key: "payment", label: "Payment" },
    { key: "review", label: "Review" },
];

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { items, cartTotal, cartCount, clearCart } = useCart();
    const { user } = useAuth();
    const addresses = user?.addresses ?? [];

    const [step, setStep] = useState<Step>("address");
    const [placing, setPlacing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [selectedId, setSelectedId] = useState<string | null>(() => {
        // Prefer an address that was just added from this flow, then the default one
        const preferred = (location.state as { selectAddressId?: string } | null)?.selectAddressId;
        const list = user?.addresses ?? [];
        return (list.find((a) => a.id === preferred) ?? list.find((a) => a.isDefault) ?? list[0])?.id ?? null;
    });

    const address = addresses.find((a) => a.id === selectedId) ?? null;
    const currentStep: Step = address ? step : "address";
    const currentIdx = steps.findIndex((s) => s.key === currentStep);
    const { deliveryFee, tax, total } = getOrderPricing(cartTotal);

    const goTo = (next: Step) => {
        setStep(next);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePlaceOrder = async () => {
        if (!address) return;
        setPlacing(true);
        try {
            const { label, address: street, city, state, zip, lat, lng } = address;
            const { data } = await api.post("/orders", {
                items: items.map((item) => ({ product: item.product.id, quantity: item.quantity })),
                shippingAddress: { label, address: street, city, state, zip, lat, lng },
                paymentMethod,
            });

            if (data.url) {
                // Keep the button locked while the browser leaves for Stripe
                window.location.href = data.url;
                return;
            }
            clearCart();
            toast.success("Order placed successfully!");
            navigate(`/orders/${data.order.id}`, { replace: true });
        } catch (error) {
            toast.error(getErrorMessage(error));
            setPlacing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <EmptyState
                    art={EmptyCartArt}
                    title="Your cart is empty"
                    description="Add a few fresh favourites to your cart before checking out."
                    action={
                        <Link to="/products" className="btn btn-primary">
                            Browse products
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-20 sm:px-6 lg:px-8">
            <Link to="/products" className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-app-text-light hover:text-app-green">
                <ArrowLeftIcon className="size-4" /> Continue shopping
            </Link>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-app-green">Checkout</h1>

            {/* Stepper */}
            <ol className="mt-6 flex max-w-xl items-center" aria-label="Checkout progress">
                {steps.map((s, i) => {
                    const done = i < currentIdx;
                    const current = i === currentIdx;
                    const reachable = i === 0 || Boolean(address);
                    return (
                        <li key={s.key} className="flex flex-1 items-center last:flex-none">
                            <button type="button" onClick={() => goTo(s.key)} disabled={!reachable || placing} aria-current={current ? "step" : undefined} className="flex items-center gap-2.5 rounded-full disabled:cursor-not-allowed">
                                <span className={`flex-center size-9 shrink-0 rounded-full text-sm font-semibold transition ${done ? "bg-app-green text-white" : current ? "bg-app-orange text-white ring-4 ring-orange-100" : "bg-white text-app-text-light ring-1 ring-app-border ring-inset"}`}>{done ? <CheckIcon className="size-4" strokeWidth={3} /> : i + 1}</span>
                                <span className={`text-sm font-medium ${current ? "text-app-green" : "text-app-text-light"}`}>{s.label}</span>
                            </button>
                            {i < steps.length - 1 && <span className={`mx-3 h-0.5 flex-1 rounded-full ${done ? "bg-app-green" : "bg-app-border"}`} />}
                        </li>
                    );
                })}
            </ol>

            <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
                <div>
                    {currentStep === "address" && <CheckoutAddress addresses={addresses} selectedId={selectedId} onSelect={(a) => setSelectedId(a.id)} onContinue={() => goTo("payment")} />}
                    {currentStep === "payment" && <CheckoutPayment paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} onBack={() => goTo("address")} onContinue={() => goTo("review")} />}
                    {currentStep === "review" && address && <CheckoutReview address={address} paymentMethod={paymentMethod} items={items} total={total} loading={placing} onPlaceOrder={handlePlaceOrder} onEditStep={goTo} />}
                </div>

                {/* Order summary */}
                <aside className="card p-5 sm:p-6 lg:sticky lg:top-28" aria-label="Order summary">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-app-green">Order summary</h2>
                        <span className="text-xs text-app-text-light">{pluralize(cartCount, "item")}</span>
                    </div>

                    <ul className="-mr-2 mt-3 max-h-64 space-y-3 overflow-y-auto pt-2 pr-2">
                        {items.map((item) => (
                            <li key={item.product.id} className="flex items-center gap-3">
                                <div className="relative size-12 shrink-0 rounded-xl bg-app-cream p-1.5">
                                    <img src={item.product.image} alt="" className="size-full object-contain mix-blend-multiply" />
                                    <span className="flex-center absolute -top-1.5 -right-1.5 h-5 min-w-5 rounded-full bg-app-green px-1 text-[10px] font-bold text-white">{item.quantity}</span>
                                </div>
                                <p className="min-w-0 flex-1 truncate text-sm text-app-text">{item.product.name}</p>
                                <span className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                            </li>
                        ))}
                    </ul>

                    <dl className="mt-5 space-y-2 border-t border-app-border pt-4 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-app-text-light">Subtotal</dt>
                            <dd>{formatPrice(cartTotal)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-app-text-light">Delivery</dt>
                            <dd>{deliveryFee === 0 ? <span className="font-medium text-app-success">Free</span> : formatPrice(deliveryFee)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-app-text-light">Tax ({TAX_RATE * 100}%)</dt>
                            <dd>{formatPrice(tax)}</dd>
                        </div>
                        <div className="flex items-baseline justify-between border-t border-app-border pt-3">
                            <dt className="font-semibold text-app-green">Total</dt>
                            <dd className="text-xl font-semibold text-app-green">{formatPrice(total)}</dd>
                        </div>
                    </dl>

                    {deliveryFee > 0 && (
                        <p className="mt-4 flex items-start gap-2 rounded-xl bg-orange-50 px-3 py-2.5 text-xs text-app-orange-dark">
                            <TruckIcon className="mt-px size-4 shrink-0" />
                            <span>
                                Add {cartTotal < FREE_DELIVERY_THRESHOLD ? formatPrice(FREE_DELIVERY_THRESHOLD - cartTotal) : "any item"} more for free delivery.{" "}
                                <Link to="/products" className="font-semibold underline underline-offset-2">
                                    Keep shopping
                                </Link>
                            </span>
                        </p>
                    )}

                    <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-app-text-light">
                        <ShieldCheckIcon className="size-4 text-app-success" /> Secure checkout
                    </p>
                </aside>
            </div>
        </div>
    );
};

export default Checkout;
