import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AlertTriangleIcon, ArrowRightIcon, PackageIcon, PlusIcon, ShoppingBagIcon, TruckIcon, UsersIcon } from "lucide-react";
import type { Order } from "../../types";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api";
import { getErrorMessage } from "../../lib/errors";
import { formatDate, formatPrice, pluralize, shortOrderId } from "../../lib/format";

interface Stats {
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    outOfStock: number;
    totalPartners?: number;
    recentOrders: Order[];
}

const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/admin/stats")
            .then((res) => setStats(res.data))
            .catch((error) => toast.error(getErrorMessage(error, "Couldn't load dashboard stats")))
            .finally(() => setLoading(false));
    }, []);

    const cards = stats
        ? [
              { label: "Total orders", value: stats.totalOrders, icon: ShoppingBagIcon, tone: "bg-orange-50 text-app-orange", to: "/admin/orders" },
              { label: "Customers", value: stats.totalUsers, icon: UsersIcon, tone: "bg-sky-50 text-sky-600" },
              { label: "Products", value: stats.totalProducts, icon: PackageIcon, tone: "bg-emerald-50 text-emerald-600", to: "/admin/products" },
              { label: "Out of stock", value: stats.outOfStock, icon: AlertTriangleIcon, tone: stats.outOfStock > 0 ? "bg-rose-50 text-rose-600" : "bg-zinc-100 text-zinc-500", to: "/admin/products" },
          ]
        : [];

    return (
        <>
            <AdminPageHeader
                title={`${greeting()}, ${user?.name.split(" ")[0] ?? "there"}`}
                description={`Here's what's happening in your store · ${formatDate(new Date().toISOString(), { weekday: "long", month: "long", day: "numeric" })}`}
                actions={
                    <>
                        <Link to="/admin/orders" className="btn btn-outline">
                            <ShoppingBagIcon className="size-4" /> Orders
                        </Link>
                        <Link to="/admin/products/new" className="btn btn-primary">
                            <PlusIcon className="size-4" /> Add product
                        </Link>
                    </>
                }
            />

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                {loading
                    ? Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)
                    : cards.map((card) => {
                          const body = (
                              <>
                                  <div className={`flex-center size-11 rounded-xl ${card.tone}`}>
                                      <card.icon className="size-5" />
                                  </div>
                                  <p className="mt-4 text-3xl font-semibold tracking-tight text-app-green tabular-nums">{card.value.toLocaleString()}</p>
                                  <p className="mt-0.5 text-sm text-app-text-light">{card.label}</p>
                              </>
                          );
                          return card.to ? (
                              <Link key={card.label} to={card.to} className="card block p-5 transition hover:shadow-card-hover">
                                  {body}
                              </Link>
                          ) : (
                              <div key={card.label} className="card p-5">
                                  {body}
                              </div>
                          );
                      })}
            </div>

            {stats?.totalPartners !== undefined && (
                <Link to="/admin/delivery-partners" className="card mt-4 flex items-center justify-between gap-4 p-4 transition hover:shadow-card-hover sm:px-5">
                    <span className="flex items-center gap-3 text-sm text-app-text">
                        <span className="flex-center size-9 rounded-xl bg-violet-50 text-violet-600">
                            <TruckIcon className="size-4" />
                        </span>
                        <span>
                            <strong className="font-semibold text-app-green">{pluralize(stats.totalPartners, "delivery partner")}</strong> on your team
                        </span>
                    </span>
                    <ArrowRightIcon className="size-4 text-app-text-light" />
                </Link>
            )}

            {/* Recent orders */}
            <section className="card mt-6 overflow-hidden" aria-labelledby="recent-title">
                <div className="flex items-center justify-between border-b border-app-border px-5 py-4 sm:px-6">
                    <h2 id="recent-title" className="font-semibold text-app-green">
                        Recent orders
                    </h2>
                    <Link to="/admin/orders" className="inline-flex items-center gap-1 rounded text-sm font-semibold text-app-orange hover:text-app-orange-dark">
                        View all <ArrowRightIcon className="size-4" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-app-cream/60 text-xs font-semibold tracking-wide text-app-text-light uppercase">
                            <tr>
                                <th className="px-6 py-3">Order</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Items</th>
                                <th className="px-6 py-3">Total</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-app-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-6">
                                        <div className="skeleton h-24" />
                                    </td>
                                </tr>
                            ) : !stats || stats.recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-app-text-light">
                                        No orders yet.
                                    </td>
                                </tr>
                            ) : (
                                stats.recentOrders.map((order) => {
                                    const customer = typeof order.user === "object" ? order.user : null;
                                    return (
                                        <tr key={order.id} className="hover:bg-app-cream/40">
                                            <td className="px-6 py-4 font-mono text-xs font-semibold text-app-green">#{shortOrderId(order.id)}</td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-app-text">{customer?.name || "—"}</p>
                                                <p className="text-xs text-app-text-light">{customer?.email || ""}</p>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-600">{pluralize(order.items?.length || 0, "item")}</td>
                                            <td className="px-6 py-4 font-semibold text-app-green">{formatPrice(order.total ?? 0)}</td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="px-6 py-4 text-app-text-light">{formatDate(order.createdAt)}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}
