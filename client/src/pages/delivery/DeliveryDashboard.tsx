import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { NavigationIcon } from "lucide-react";
import OtpModal from "../../components/Delivery/OtpModal";
import CancelModal from "../../components/Delivery/CancelModal";
import DeliveryOrderCard from "../../components/Delivery/DeliveryOrderCard";
import EmptyState from "../../components/ui/EmptyState";
import { ListSkeleton } from "../../components/ui/Skeleton";
import { NoOrdersArt, ScooterArt } from "../../components/illustrations";
import type { DeliveryPartner, Order } from "../../types";
import { getErrorMessage } from "../../lib/errors";
import { formatDate } from "../../lib/format";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("delivery_token")}` },
});

type Tab = "active" | "completed";

async function loadOrders(tab: Tab): Promise<{ tab: Tab; orders: Order[] }> {
    try {
        const { data } = await axios.get(`${API_URL}/delivery/my-deliveries?status=${tab}`, getAuthHeaders());
        return { tab, orders: data.orders };
    } catch (error) {
        toast.error(getErrorMessage(error, "Failed to load deliveries"));
        return { tab, orders: [] };
    }
}

const NoActiveArt = (props: { className?: string }) => <ScooterArt speedLines={false} {...props} />;

export default function DeliveryDashboard() {
    const partner = useOutletContext<DeliveryPartner>();
    const [tab, setTab] = useState<Tab>("active");
    const [result, setResult] = useState<{ tab: Tab; orders: Order[] } | null>(null);
    const [tracking, setTracking] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // OTP modal
    const [otpModal, setOtpModal] = useState<string | null>(null);
    const [otp, setOtp] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Cancel modal
    const [cancelModal, setCancelModal] = useState<string | null>(null);
    const [cancelReason, setCancelReason] = useState("");
    const watchIdRef = useRef<number | null>(null);

    const loading = result?.tab !== tab;
    const orders = useMemo(() => result?.orders ?? [], [result]);

    useEffect(() => {
        let ignore = false;
        loadOrders(tab).then((res) => {
            // Ignore responses for a tab the partner has already switched away from
            if (!ignore) setResult(res);
        });
        return () => {
            ignore = true;
        };
    }, [tab]);

    const refresh = async () => setResult(await loadOrders(tab));

    // send location every 10s for active deliveries
    useEffect(() => {
        const activeOrders = orders.filter((o) => ["Assigned", "Packed", "Out for Delivery"].includes(o.status));

        if (activeOrders.length === 0 || !tracking) {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
            return;
        }

        const sendLocation = (pos: GeolocationPosition) => {
            const { latitude: lat, longitude: lng } = pos.coords;
            activeOrders.forEach((order) => {
                axios.put(`${API_URL}/delivery/my-deliveries/${order.id}/location`, { lat, lng }, getAuthHeaders()).catch(() => {});
            });
        };

        watchIdRef.current = navigator.geolocation.watchPosition(sendLocation, () => {}, {
            enableHighAccuracy: true,
            maximumAge: 10000,
        });

        // Also send on interval for more consistent updates
        const interval = setInterval(() => {
            navigator.geolocation.getCurrentPosition(sendLocation, () => {}, { enableHighAccuracy: true });
        }, 10000);

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
            clearInterval(interval);
        };
    }, [orders, tracking]);

    const toggleTracking = () => {
        if (!tracking && !navigator.geolocation) {
            toast.error("Location sharing isn't supported on this device");
            return;
        }
        setTracking((prev) => !prev);
    };

    const handleUpdateStatus = async (orderId: string, status: string) => {
        setUpdatingId(orderId);
        try {
            await axios.put(`${API_URL}/delivery/my-deliveries/${orderId}/status`, { status }, getAuthHeaders());
            toast.success(`Status updated to ${status}`);
            await refresh();
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to update status"));
        } finally {
            setUpdatingId(null);
        }
    };

    const handleComplete = async () => {
        if (!otpModal || !otp) return;
        setSubmitting(true);
        try {
            await axios.put(`${API_URL}/delivery/my-deliveries/${otpModal}/complete`, { otp }, getAuthHeaders());
            toast.success("Delivery completed!");
            setOtpModal(null);
            setOtp("");
            await refresh();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async () => {
        if (!cancelModal) return;
        setSubmitting(true);
        try {
            await axios.put(`${API_URL}/delivery/my-deliveries/${cancelModal}/cancel`, { reason: cancelReason }, getAuthHeaders());
            toast.success("Delivery cancelled");
            setCancelModal(null);
            setCancelReason("");
            await refresh();
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to cancel delivery"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm text-app-text-light">{formatDate(new Date().toISOString(), { weekday: "long", month: "long", day: "numeric" })}</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-app-green">Hi, {partner.name.split(" ")[0]}</h1>
            </div>

            {/* Location sharing */}
            <section className={`flex items-center justify-between gap-4 rounded-2xl p-4 sm:p-5 ${tracking ? "bg-app-green text-white" : "card"}`}>
                <div className="flex items-center gap-3">
                    <span className={`flex-center relative size-11 shrink-0 rounded-xl ${tracking ? "bg-white/10" : "bg-app-cream text-app-green"}`}>
                        {tracking && <span className="absolute inset-0 animate-ping rounded-xl bg-emerald-400/30" />}
                        <NavigationIcon className={`size-5 ${tracking ? "text-emerald-300" : ""}`} />
                    </span>
                    <div>
                        <p className="font-semibold">{tracking ? "Sharing your live location" : "Location sharing is off"}</p>
                        <p className={`text-xs ${tracking ? "text-white/70" : "text-app-text-light"}`}>Customers can follow you on the map during active deliveries.</p>
                    </div>
                </div>
                <button type="button" role="switch" aria-checked={tracking} aria-label="Share live location" onClick={toggleTracking} className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${tracking ? "bg-emerald-400" : "bg-zinc-300"}`}>
                    <span className={`absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow-sm transition-transform ${tracking ? "translate-x-5" : ""}`} />
                </button>
            </section>

            {/* Tabs */}
            <div className="grid grid-cols-2 rounded-2xl bg-app-cream-dark p-1" role="tablist" aria-label="Deliveries">
                {(["active", "completed"] as const).map((t) => (
                    <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`rounded-xl py-2.5 text-sm font-semibold ${tab === t ? "bg-white text-app-green shadow-sm" : "text-app-text-light hover:text-app-green"}`}>
                        {t === "active" ? "Active" : "Completed"}
                        {result?.tab === t && <span className="ml-1.5 text-xs font-medium text-app-text-light">({orders.length})</span>}
                    </button>
                ))}
            </div>

            {/* Orders */}
            {loading ? (
                <ListSkeleton rows={2} className="h-64" />
            ) : orders.length === 0 ? (
                <div className="card">
                    <EmptyState art={tab === "active" ? NoActiveArt : NoOrdersArt} title={tab === "active" ? "No active deliveries" : "No completed deliveries yet"} description={tab === "active" ? "New assignments will appear here as soon as the store assigns them to you." : "Deliveries you complete will be listed here."} />
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <DeliveryOrderCard key={order.id} order={order} tab={tab} updating={updatingId === order.id} handleUpdateStatus={handleUpdateStatus} setOtpModal={setOtpModal} setCancelModal={setCancelModal} />
                    ))}
                </div>
            )}

            {otpModal && <OtpModal setOtpModal={setOtpModal} otp={otp} setOtp={setOtp} handleComplete={handleComplete} submitting={submitting} />}
            {cancelModal && <CancelModal setCancelModal={setCancelModal} cancelReason={cancelReason} setCancelReason={setCancelReason} handleCancel={handleCancel} submitting={submitting} />}
        </div>
    );
}
