import { CheckCircleIcon, ClockIcon, HandCoinsIcon, MapPinIcon, Navigation2Icon, PackageCheckIcon, PhoneIcon, TruckIcon, XCircleIcon } from "lucide-react";
import type { Order } from "../../types";
import StatusBadge from "../ui/StatusBadge";
import { formatDateTime, formatPrice, pluralize, shortOrderId } from "../../lib/format";

interface DeliveryOrderCardProps {
    order: Order;
    tab: "active" | "completed";
    handleUpdateStatus: (orderId: string, status: string) => void;
    setOtpModal: (orderId: string) => void;
    setCancelModal: (orderId: string) => void;
    updating?: boolean;
}

export default function DeliveryOrderCard({ order, tab, handleUpdateStatus, setOtpModal, setCancelModal, updating = false }: DeliveryOrderCardProps) {
    const user = typeof order.user === "object" ? order.user : { name: "Customer", email: "", phone: "" };
    const { address, city, state, zip, lat, lng } = order.shippingAddress;
    const fullAddress = `${address}, ${city}, ${state} ${zip}`;
    const mapsUrl = lat && lng ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    const collectCash = order.paymentMethod === "cash" && tab === "active";

    return (
        <article className="card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-app-border px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-app-green">#{shortOrderId(order.id)}</span>
                    <StatusBadge status={order.status} />
                </div>
                <span className="text-sm font-semibold text-app-green">{formatPrice(order.total)}</span>
            </div>

            <div className="space-y-4 px-5 py-4">
                {/* Customer */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <span className="flex-center size-10 rounded-full bg-app-cream text-sm font-semibold text-app-green">{user.name?.charAt(0)}</span>
                        <div>
                            <p className="font-medium text-app-text">{user.name}</p>
                            <p className="text-xs text-app-text-light">
                                {pluralize(order.items.length, "item")} · {order.paymentMethod === "card" ? "Paid by card" : "Cash on delivery"}
                            </p>
                        </div>
                    </div>
                    {user.phone && tab === "active" && (
                        <a href={`tel:${user.phone}`} aria-label={`Call ${user.name}`} className="flex-center size-10 rounded-full bg-app-cream text-app-green hover:bg-app-cream-dark">
                            <PhoneIcon className="size-4" />
                        </a>
                    )}
                </div>

                {/* Address */}
                <div className="flex items-start justify-between gap-3 rounded-xl bg-app-cream/70 p-3.5">
                    <p className="flex items-start gap-2.5 text-sm text-zinc-700">
                        <MapPinIcon className="mt-0.5 size-4 shrink-0 text-app-orange" />
                        <span>
                            <span className="block font-medium text-app-text">{order.shippingAddress.label}</span>
                            {fullAddress}
                        </span>
                    </p>
                    {tab === "active" && (
                        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm shrink-0 bg-white text-app-green ring-1 ring-app-border ring-inset hover:bg-app-cream">
                            <Navigation2Icon className="size-3.5" /> Navigate
                        </a>
                    )}
                </div>

                {collectCash && (
                    <p className="flex items-center gap-2.5 rounded-xl bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800 ring-1 ring-amber-600/15 ring-inset">
                        <HandCoinsIcon className="size-4 shrink-0" />
                        <span>
                            Collect <strong className="font-semibold">{formatPrice(order.total)}</strong> in cash
                        </span>
                    </p>
                )}
            </div>

            {/* Actions */}
            {tab === "active" && order.status !== "Delivered" && order.status !== "Cancelled" && (
                <div className="flex flex-wrap gap-2 border-t border-app-border px-5 py-3.5">
                    {order.status === "Assigned" && (
                        <button type="button" disabled={updating} onClick={() => handleUpdateStatus(order.id, "Packed")} className="btn btn-dark flex-1">
                            <PackageCheckIcon className="size-4" /> Mark as packed
                        </button>
                    )}
                    {order.status === "Packed" && (
                        <button type="button" disabled={updating} onClick={() => handleUpdateStatus(order.id, "Out for Delivery")} className="btn btn-dark flex-1">
                            <TruckIcon className="size-4" /> Start delivery
                        </button>
                    )}
                    {order.status === "Out for Delivery" && (
                        <button type="button" onClick={() => setOtpModal(order.id)} className="btn btn-primary flex-1">
                            <CheckCircleIcon className="size-4" /> Complete delivery
                        </button>
                    )}
                    <button type="button" onClick={() => setCancelModal(order.id)} className="btn btn-ghost text-app-error hover:bg-red-50 hover:text-app-error">
                        <XCircleIcon className="size-4" /> Cancel
                    </button>
                </div>
            )}

            {tab === "completed" && (
                <p className="flex items-center gap-1.5 border-t border-app-border px-5 py-3 text-xs text-app-text-light">
                    <ClockIcon className="size-3.5" />
                    Ordered {formatDateTime(order.createdAt)}
                </p>
            )}
        </article>
    );
}
