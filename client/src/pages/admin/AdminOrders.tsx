import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ChevronDownIcon, SearchIcon, TruckIcon, UserRoundPlusIcon } from "lucide-react";
import type { DeliveryPartner, Order } from "../../types";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import { NoOrdersArt } from "../../components/illustrations";
import api from "../../config/api";
import { getErrorMessage } from "../../lib/errors";
import { formatDateTime, formatPrice, pluralize, shortOrderId } from "../../lib/format";
import { getStatusStyle, ORDER_STATUSES } from "../../lib/status";

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [partners, setPartners] = useState<DeliveryPartner[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [query, setQuery] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [assignOrderId, setAssignOrderId] = useState<string | null>(null);
    const [selectedPartner, setSelectedPartner] = useState("");
    const [assigning, setAssigning] = useState(false);

    const fetchOrders = useCallback(async () => {
        try {
            const { data } = await api.get("/orders/all");
            setOrders(data.orders);
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to load orders"));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
        api.get("/admin/delivery-partners")
            .then(({ data }) => setPartners(data.partners.filter((p: DeliveryPartner) => p.isActive)))
            .catch(() => {
                // The assign dialog explains when no partners are available
            });
    }, [fetchOrders]);

    const handleStatusChange = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        try {
            await api.put(`/orders/${id}/status`, { status: newStatus });
            toast.success(`Order marked as ${newStatus}`);
            await fetchOrders();
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to update status"));
        } finally {
            setUpdatingId(null);
        }
    };

    const closeAssign = () => {
        setAssignOrderId(null);
        setSelectedPartner("");
    };

    const handleAssign = async () => {
        if (!assignOrderId || !selectedPartner) return;
        setAssigning(true);
        try {
            await api.put(`/admin/orders/${assignOrderId}/assign`, { partnerId: selectedPartner });
            toast.success("Delivery partner assigned");
            closeAssign();
            await fetchOrders();
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to assign partner"));
        } finally {
            setAssigning(false);
        }
    };

    const counts = useMemo(() => {
        const c: Record<string, number> = { all: orders.length };
        for (const o of orders) c[o.status] = (c[o.status] ?? 0) + 1;
        return c;
    }, [orders]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return orders.filter((o) => {
            if (statusFilter !== "all" && o.status !== statusFilter) return false;
            if (!q) return true;
            const customer = typeof o.user === "object" ? o.user : null;
            return shortOrderId(o.id).toLowerCase().includes(q) || customer?.name?.toLowerCase().includes(q) || customer?.email?.toLowerCase().includes(q);
        });
    }, [orders, statusFilter, query]);

    return (
        <>
            <AdminPageHeader title="Orders" description={loading ? "Loading orders…" : `${pluralize(orders.length, "order")} in total`} />

            {/* Status filters */}
            <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Filter by status">
                {["all", ...ORDER_STATUSES].map((s) => (
                    <button key={s} type="button" role="tab" aria-selected={statusFilter === s} onClick={() => setStatusFilter(s)} className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap ${statusFilter === s ? "bg-app-green text-white" : "bg-white text-zinc-600 ring-1 ring-app-border ring-inset hover:text-app-green"}`}>
                        {s === "all" ? "All" : s}
                        <span className={`rounded-full px-1.5 text-xs tabular-nums ${statusFilter === s ? "bg-white/20" : "bg-app-cream text-app-text-light"}`}>{counts[s] ?? 0}</span>
                    </button>
                ))}
            </div>

            <div className="card overflow-hidden">
                <div className="border-b border-app-border p-4">
                    <label className="relative block max-w-md">
                        <span className="sr-only">Search orders</span>
                        <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-400" />
                        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by order ID, customer name or email…" className="field h-10 pl-10" />
                    </label>
                </div>

                {loading ? (
                    <div className="space-y-3 p-5">
                        {Array.from({ length: 5 }, (_, i) => (
                            <div key={i} className="skeleton h-14" />
                        ))}
                    </div>
                ) : visible.length === 0 ? (
                    <EmptyState art={NoOrdersArt} title={orders.length === 0 ? "No orders yet" : "No matching orders"} description={orders.length === 0 ? "New orders will appear here as customers check out." : "Try another status or search term."} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-app-cream/60 text-xs font-semibold tracking-wide text-app-text-light uppercase">
                                <tr>
                                    <th className="px-5 py-3">Order</th>
                                    <th className="px-5 py-3">Customer</th>
                                    <th className="px-5 py-3">Total</th>
                                    <th className="px-5 py-3">Delivery partner</th>
                                    <th className="px-5 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-app-border">
                                {visible.map((order) => {
                                    const customer = typeof order.user === "object" ? order.user : null;
                                    const canAssign = order.status !== "Delivered" && order.status !== "Cancelled";
                                    return (
                                        <tr key={order.id} className="hover:bg-app-cream/40">
                                            <td className="px-5 py-4">
                                                <p className="font-mono text-xs font-semibold text-app-green">#{shortOrderId(order.id)}</p>
                                                <p className="mt-0.5 text-xs text-app-text-light">{formatDateTime(order.createdAt)}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-app-text">{customer?.name || "Unknown customer"}</p>
                                                <p className="text-xs text-app-text-light">{customer?.email || "No email"}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-app-green">{formatPrice(order.total)}</p>
                                                <p className="text-xs text-app-text-light">
                                                    {pluralize(order.items.length, "item")} · {order.paymentMethod === "card" ? (order.isPaid ? "Paid" : "Card, unpaid") : "COD"}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4">
                                                {order.deliveryPartner ? (
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="flex-center size-8 rounded-full bg-app-green text-xs font-semibold text-white">{order.deliveryPartner.name?.charAt(0)}</span>
                                                        <div>
                                                            <p className="text-sm font-medium text-app-text">{order.deliveryPartner.name}</p>
                                                            <p className="text-xs text-app-text-light">{order.deliveryPartner.phone}</p>
                                                        </div>
                                                    </div>
                                                ) : canAssign ? (
                                                    <button type="button" onClick={() => setAssignOrderId(order.id)} className="btn btn-sm border border-dashed border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100">
                                                        <UserRoundPlusIcon className="size-3.5" /> Assign partner
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-app-text-light">—</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <label className="relative inline-block">
                                                    <span className="sr-only">Order status</span>
                                                    <select
                                                        value={order.status}
                                                        disabled={updatingId === order.id}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        className={`appearance-none rounded-full py-1.5 pr-8 pl-3 text-xs font-semibold ring-1 ring-inset outline-none disabled:opacity-60 ${getStatusStyle(order.status).badge}`}
                                                    >
                                                        {ORDER_STATUSES.map((s) => (
                                                            <option key={s} value={s}>
                                                                {s}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 opacity-70" />
                                                </label>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal open={Boolean(assignOrderId)} onClose={assigning ? () => {} : closeAssign} title="Assign delivery partner" description={assignOrderId ? `Order #${shortOrderId(assignOrderId)}` : undefined} icon={<TruckIcon className="size-5 text-app-green" />} size="sm">
                {partners.length === 0 ? (
                    <p className="rounded-xl bg-app-cream p-4 text-sm text-app-text-light">No active delivery partners. Onboard or activate a partner first.</p>
                ) : (
                    <div className="max-h-72 space-y-2 overflow-y-auto" role="radiogroup" aria-label="Delivery partners">
                        {partners.map((p) => (
                            <label key={p.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-app-orange ${selectedPartner === p.id ? "border-app-green bg-app-green/[0.04]" : "border-app-border hover:border-app-green/30"}`}>
                                <input type="radio" name="partner" value={p.id} checked={selectedPartner === p.id} onChange={() => setSelectedPartner(p.id)} className="sr-only" />
                                <span className="flex-center size-9 rounded-full bg-app-green text-sm font-semibold text-white">{p.name.charAt(0)}</span>
                                <span>
                                    <span className="block text-sm font-medium text-app-text">{p.name}</span>
                                    <span className="block text-xs text-app-text-light capitalize">
                                        {p.vehicleType} · {p.phone}
                                    </span>
                                </span>
                            </label>
                        ))}
                    </div>
                )}
                <div className="mt-5 flex gap-2">
                    <button type="button" onClick={closeAssign} disabled={assigning} className="btn btn-outline flex-1">
                        Cancel
                    </button>
                    <button type="button" onClick={handleAssign} disabled={!selectedPartner || assigning} className="btn btn-dark flex-1">
                        {assigning ? "Assigning…" : "Assign"}
                    </button>
                </div>
            </Modal>
        </>
    );
}
