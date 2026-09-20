import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronRightIcon, NavigationIcon } from "lucide-react";
import type { Order } from "../types";
import { useCart } from "../context/CartContext";
import EmptyState from "../components/ui/EmptyState";
import StatusBadge from "../components/ui/StatusBadge";
import { ListSkeleton } from "../components/ui/Skeleton";
import { NoOrdersArt } from "../components/illustrations";
import api from "../config/api";
import { getErrorMessage } from "../lib/errors";
import { formatDate, formatPrice, pluralize, shortOrderId } from "../lib/format";

const tabs = [
    { value: "all", label: "All orders" },
    { value: "Placed", label: "Placed" },
    { value: "Out for Delivery", label: "Out for delivery" },
    { value: "Delivered", label: "Delivered" },
    { value: "Cancelled", label: "Cancelled" },
];

const ACTIVE_STATUSES = ["Placed", "Confirmed", "Assigned", "Packed", "Out for Delivery"];

const MyOrders = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [result, setResult] = useState<{ tab: string; orders: Order[] } | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const { clearCart } = useCart();

    const loading = result?.tab !== activeTab;
    const orders = result?.orders ?? [];

    useEffect(() => {
        let ignore = false;
        let timer: ReturnType<typeof setTimeout> | undefined;

        const load = () => {
            const params = activeTab !== "all" ? `?status=${encodeURIComponent(activeTab)}` : "";
            api.get(`/orders${params}`)
                .then(({ data }) => {
                    if (!ignore) setResult({ tab: activeTab, orders: data.orders });
                })
                .catch((error) => {
                    if (ignore) return;
                    toast.error(getErrorMessage(error));
                    setResult({ tab: activeTab, orders: [] });
                });
        };

        if (searchParams.get("clearCart")) {
            // Returning from a successful Stripe checkout
            clearCart();
            setSearchParams({}, { replace: true });
            toast.success("Payment successful — thank you for your order!");
            // Give the payment webhook a moment to record the order
            timer = setTimeout(load, 2000);
        } else {
            load();
        }

        return () => {
            ignore = true;
            clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- only refetch when the tab changes
    }, [activeTab]);

    const activeTabLabel = tabs.find((t) => t.value === activeTab)?.label.toLowerCase();

    return (
        <div className="mx-auto max-w-4xl px-4 pt-8 pb-20 sm:px-6 lg:px-8">
            <p className="eyebrow">Account</p>
            <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-app-green">My orders</h1>
            <p className="mt-1 text-sm text-app-text-light">Track current deliveries and look back at past orders.</p>

            {/* Tabs */}
            <div className="no-scrollbar -mx-4 mt-6 mb-6 flex gap-2 overflow-x-auto px-4" role="tablist" aria-label="Filter orders">
                {tabs.map((tab) => (
                    <button key={tab.value} type="button" role="tab" aria-selected={activeTab === tab.value} onClick={() => setActiveTab(tab.value)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === tab.value ? "bg-app-green text-white" : "bg-white text-zinc-600 ring-1 ring-app-border ring-inset hover:text-app-green"}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <ListSkeleton rows={3} className="h-44" />
            ) : orders.length === 0 ? (
                <div className="card">
                    <EmptyState
                        art={NoOrdersArt}
                        title={activeTab === "all" ? "No orders yet" : `No ${activeTabLabel} orders`}
                        description={activeTab === "all" ? "When you place an order, you'll be able to track it here." : "Orders with this status will show up here."}
                        action={
                            activeTab === "all" ? (
                                <Link to="/products" className="btn btn-primary">
                                    Start shopping
                                </Link>
                            ) : (
                                <button type="button" onClick={() => setActiveTab("all")} className="btn btn-outline">
                                    View all orders
                                </button>
                            )
                        }
                    />
                </div>
            ) : (
                <ul className="space-y-4">
                    {orders.map((order) => {
                        const isActive = ACTIVE_STATUSES.includes(order.status);
                        return (
                            <li key={order.id}>
                                <Link to={`/orders/${order.id}`} className="card group block p-5 transition hover:shadow-card-hover sm:p-6">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-app-green">Order #{shortOrderId(order.id)}</p>
                                            <p className="mt-0.5 text-xs text-app-text-light">Placed on {formatDate(order.createdAt, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={order.status} />
                                            <ChevronRightIcon className="size-4 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2">
                                        {order.items.slice(0, 5).map((item, i) => (
                                            <div key={i} className="size-14 shrink-0 rounded-xl bg-app-cream p-1.5 sm:size-16" title={`${item.name} × ${item.quantity}`}>
                                                <img src={item.image} alt={item.name} className="size-full object-contain mix-blend-multiply" />
                                            </div>
                                        ))}
                                        {order.items.length > 5 && <div className="flex-center size-14 shrink-0 rounded-xl bg-app-cream text-xs font-semibold text-app-text-light sm:size-16">+{order.items.length - 5}</div>}
                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-app-border pt-4 text-sm">
                                        <span className="text-app-text-light">
                                            {pluralize(order.items.length, "item")} · {order.paymentMethod === "card" ? "Card" : "Cash on delivery"}
                                        </span>
                                        <span className="flex items-center gap-3">
                                            {isActive && (
                                                <span className="hidden items-center gap-1 text-xs font-semibold text-app-orange-dark sm:inline-flex">
                                                    <NavigationIcon className="size-3.5" /> Track order
                                                </span>
                                            )}
                                            <span className="text-base font-semibold text-app-green">{formatPrice(order.total)}</span>
                                        </span>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default MyOrders;
