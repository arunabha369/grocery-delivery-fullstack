import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeftIcon, BanknoteIcon, CircleCheckIcon, CreditCardIcon, MapPinIcon, PhoneIcon, XCircleIcon } from "lucide-react";
import type { Order } from "../types";
import OrderOTP from "../components/OrderTracking/OrderOTP";
import LiveMap from "../components/OrderTracking/LiveMap";
import OrderTimeLine from "../components/OrderTracking/OrderTimeLine";
import StatusBadge from "../components/ui/StatusBadge";
import { NoOrdersArt, ScooterArt } from "../components/illustrations";
import api from "../config/api";
import { formatDate, formatPrice, pluralize, shortOrderId } from "../lib/format";

const heroCopy: Record<string, { title: string; text: string }> = {
    Placed: { title: "Order received", text: "We've got your order and will confirm it shortly." },
    Confirmed: { title: "Order confirmed", text: "We're getting your groceries ready." },
    Assigned: { title: "Partner assigned", text: "A delivery partner will pick up your order soon." },
    Packed: { title: "Packed and ready", text: "Your order is packed and waiting for pickup." },
    "Out for Delivery": { title: "On its way!", text: "Your delivery partner is heading to you now." },
    Delivered: { title: "Delivered", text: "Enjoy your groceries — thanks for shopping with us!" },
    Cancelled: { title: "Order cancelled", text: "This order was cancelled and won't be delivered." },
};

function TrackingSkeleton() {
    return (
        <div className="grid gap-6 lg:grid-cols-3" role="status" aria-label="Loading order">
            <div className="space-y-6 lg:col-span-2">
                <div className="skeleton h-36 rounded-2xl" />
                <div className="skeleton h-80 rounded-2xl" />
            </div>
            <div className="skeleton h-96 rounded-2xl" />
        </div>
    );
}

const OrderTracking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [liveLocation, setLiveLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        let ignore = false;
        api.get(`/orders/${id}`)
            .then(({ data }) => {
                if (!ignore) setOrder(data.order);
            })
            .catch(() => {
                if (ignore) return;
                toast.error("We couldn't find that order");
                navigate("/orders", { replace: true });
            });
        return () => {
            ignore = true;
        };
    }, [id, navigate]);

    const status = order?.status;

    // Poll the rider's location every 10 seconds while the order is in transit
    useEffect(() => {
        if (!status || ["Delivered", "Cancelled", "Placed"].includes(status)) return;

        const fetchLocation = async () => {
            try {
                const { data } = await api.get(`/orders/${id}/location`);
                if (data.liveLocation?.lat && data.liveLocation?.lng && data.liveLocation.updatedAt) {
                    setLiveLocation({ lat: data.liveLocation.lat, lng: data.liveLocation.lng });
                }
                // Status changed — reload the order so the timeline gets its timestamp
                if (data.status && data.status !== status) {
                    const { data: fresh } = await api.get(`/orders/${id}`);
                    setOrder(fresh.order);
                }
            } catch {
                // Transient polling errors are ignored; the next tick retries
            }
        };
        fetchLocation();
        const interval = setInterval(fetchLocation, 10000);
        return () => clearInterval(interval);
    }, [id, status]);

    const copy = order ? (heroCopy[order.status] ?? { title: order.status, text: "" }) : null;
    const cancelled = order?.status === "Cancelled";
    const delivered = order?.status === "Delivered";
    const partner = order?.deliveryPartner;

    return (
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-20 sm:px-6 lg:px-8">
            <Link to="/orders" className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-app-text-light hover:text-app-green">
                <ArrowLeftIcon className="size-4" /> Back to orders
            </Link>

            {!order || !copy ? (
                <div className="mt-6">
                    <TrackingSkeleton />
                </div>
            ) : (
                <>
                    <div className="mt-3 mb-6 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-app-green">Order #{shortOrderId(order.id)}</h1>
                            <p className="mt-1 text-sm text-app-text-light">Placed on {formatDate(order.createdAt, { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                        </div>
                        <StatusBadge status={order.status} className="px-3 py-1.5 text-sm" />
                    </div>

                    <div className="grid items-start gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            {/* Status hero */}
                            <section className={`relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl p-6 ${cancelled ? "bg-rose-50" : delivered ? "bg-emerald-50" : "bg-app-green text-white"}`}>
                                <div className="relative z-10 max-w-sm">
                                    <h2 className={`flex items-center gap-2 text-2xl font-semibold ${cancelled ? "text-rose-700" : delivered ? "text-emerald-800" : ""}`}>
                                        {cancelled && <XCircleIcon className="size-6" />}
                                        {delivered && <CircleCheckIcon className="size-6" />}
                                        {copy.title}
                                    </h2>
                                    <p className={`mt-1.5 text-sm ${cancelled || delivered ? "text-zinc-600" : "text-white/75"}`}>{copy.text}</p>
                                </div>
                                {cancelled || delivered ? <NoOrdersArt className="-my-4 -mr-4 hidden h-auto w-40 shrink-0 sm:block" /> : <ScooterArt className="-my-2 hidden h-auto w-48 shrink-0 sm:block" />}
                            </section>

                            <OrderOTP order={order} />
                            <LiveMap order={order} liveLocation={liveLocation} />
                            <OrderTimeLine order={order} />
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-6">
                            {partner && !delivered && !cancelled && (
                                <section className="card flex items-center justify-between gap-3 p-5" aria-label="Delivery partner">
                                    <div className="flex items-center gap-3">
                                        <span className="flex-center size-12 rounded-full bg-app-green text-lg font-semibold text-white">{partner.name.charAt(0)}</span>
                                        <div>
                                            <p className="font-semibold text-app-green">{partner.name}</p>
                                            <p className="text-xs text-app-text-light capitalize">{partner.vehicleType ? `${partner.vehicleType} · ` : ""}Delivery partner</p>
                                        </div>
                                    </div>
                                    <a href={`tel:${partner.phone}`} aria-label={`Call ${partner.name}`} className="flex-center size-11 rounded-full bg-app-orange text-white shadow-sm hover:bg-app-orange-dark">
                                        <PhoneIcon className="size-4" />
                                    </a>
                                </section>
                            )}

                            <section className="card p-5" aria-labelledby="addr-title">
                                <h2 id="addr-title" className="flex items-center gap-2 text-sm font-semibold text-app-green">
                                    <MapPinIcon className="size-4" /> Delivery address
                                </h2>
                                <p className="mt-3 text-sm font-medium text-app-text">{order.shippingAddress.label}</p>
                                <p className="text-sm leading-relaxed text-app-text-light">
                                    {order.shippingAddress.address}
                                    <br />
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                                </p>
                            </section>

                            <section className="card p-5" aria-labelledby="items-title">
                                <h2 id="items-title" className="text-sm font-semibold text-app-green">
                                    {pluralize(order.items.length, "item")}
                                </h2>
                                <ul className="mt-3 space-y-3">
                                    {order.items.map((item, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <div className="size-11 shrink-0 rounded-lg bg-app-cream p-1">
                                                <img src={item.image} alt="" className="size-full object-contain mix-blend-multiply" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-app-text">{item.name}</p>
                                                <p className="text-xs text-app-text-light">
                                                    {item.quantity} × {formatPrice(item.price)}
                                                </p>
                                            </div>
                                            <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                                        </li>
                                    ))}
                                </ul>

                                <dl className="mt-4 space-y-1.5 border-t border-app-border pt-4 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-app-text-light">Subtotal</dt>
                                        <dd>{formatPrice(order.subtotal)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-app-text-light">Delivery</dt>
                                        <dd>{order.deliveryFee === 0 ? <span className="text-app-success">Free</span> : formatPrice(order.deliveryFee)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-app-text-light">Tax</dt>
                                        <dd>{formatPrice(order.tax)}</dd>
                                    </div>
                                    <div className="flex justify-between border-t border-app-border pt-2.5 text-base font-semibold text-app-green">
                                        <dt>Total</dt>
                                        <dd>{formatPrice(order.total)}</dd>
                                    </div>
                                </dl>

                                <p className="mt-4 flex items-center gap-2 rounded-xl bg-app-cream px-3 py-2.5 text-xs text-app-text-light">
                                    {order.paymentMethod === "card" ? <CreditCardIcon className="size-4 text-app-green" /> : <BanknoteIcon className="size-4 text-app-green" />}
                                    {order.paymentMethod === "card" ? (order.isPaid ? "Paid by card" : "Card payment · pending") : "Cash on delivery"}
                                </p>
                            </section>
                        </aside>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrderTracking;
