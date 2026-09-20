import { ArrowLeftIcon, BanknoteIcon, CircleCheckIcon, CreditCardIcon, Loader2Icon, LockIcon, MapPinIcon } from "lucide-react";
import type { Address, CartItem } from "../../types";
import { formatPrice } from "../../lib/format";

interface CheckoutReviewProps {
    address: Address;
    paymentMethod: string;
    items: CartItem[];
    total: number;
    loading: boolean;
    onPlaceOrder: () => void;
    onEditStep: (step: "address" | "payment") => void;
}

export default function CheckoutReview({ address, paymentMethod, items, total, loading, onPlaceOrder, onEditStep }: CheckoutReviewProps) {
    const isCard = paymentMethod === "card";

    return (
        <div className="card animate-fade-in p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-app-green">
                <CircleCheckIcon className="size-5" /> Review your order
            </h2>
            <p className="mt-1 text-sm text-app-text-light">Please confirm the details below before placing your order.</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-app-cream p-4">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs font-semibold tracking-wide text-app-text-light uppercase">
                            <MapPinIcon className="size-3.5" /> Deliver to
                        </span>
                        <button type="button" onClick={() => onEditStep("address")} className="rounded text-xs font-semibold text-app-orange-dark hover:underline">
                            Change
                        </button>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-app-green">{address.label}</p>
                    <p className="text-sm text-zinc-600">
                        {address.address}, {address.city}, {address.state} {address.zip}
                    </p>
                </div>
                <div className="rounded-2xl bg-app-cream p-4">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs font-semibold tracking-wide text-app-text-light uppercase">
                            {isCard ? <CreditCardIcon className="size-3.5" /> : <BanknoteIcon className="size-3.5" />} Payment
                        </span>
                        <button type="button" onClick={() => onEditStep("payment")} className="rounded text-xs font-semibold text-app-orange-dark hover:underline">
                            Change
                        </button>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-app-green">{isCard ? "Credit / debit card" : "Cash on delivery"}</p>
                    <p className="text-sm text-zinc-600">{isCard ? "Secure payment via Stripe" : "Pay when your order arrives"}</p>
                </div>
            </div>

            <ul className="mt-5 divide-y divide-app-border/70">
                {items.map((item) => (
                    <li key={item.product.id} className="flex items-center gap-3 py-3">
                        <div className="size-14 shrink-0 rounded-xl bg-app-cream p-1.5">
                            <img src={item.product.image} alt="" className="size-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-app-text">{item.product.name}</p>
                            <p className="text-xs text-app-text-light">
                                {item.quantity} × {formatPrice(item.product.price)}
                            </p>
                        </div>
                        <span className="text-sm font-semibold text-app-green">{formatPrice(item.product.price * item.quantity)}</span>
                    </li>
                ))}
            </ul>

            <div className="mt-4 flex flex-col-reverse gap-3 border-t border-app-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={() => onEditStep("payment")} disabled={loading} className="btn btn-ghost">
                    <ArrowLeftIcon className="size-4" /> Back
                </button>
                <button type="button" onClick={onPlaceOrder} disabled={loading} className="btn btn-primary h-12 rounded-xl px-8 text-base">
                    {loading ? <Loader2Icon className="size-5 animate-spin" /> : <LockIcon className="size-4" />}
                    {loading ? (isCard ? "Redirecting to payment…" : "Placing order…") : `Place order · ${formatPrice(total)}`}
                </button>
            </div>
        </div>
    );
}
