export const ORDER_STATUSES = ["Placed", "Confirmed", "Assigned", "Packed", "Out for Delivery", "Delivered", "Cancelled"] as const;

export const statusStyles: Record<string, { badge: string; dot: string }> = {
    Placed: { badge: "bg-sky-50 text-sky-700 ring-sky-600/15", dot: "bg-sky-500" },
    Confirmed: { badge: "bg-indigo-50 text-indigo-700 ring-indigo-600/15", dot: "bg-indigo-500" },
    Assigned: { badge: "bg-violet-50 text-violet-700 ring-violet-600/15", dot: "bg-violet-500" },
    Packed: { badge: "bg-amber-50 text-amber-700 ring-amber-600/20", dot: "bg-amber-500" },
    "Out for Delivery": { badge: "bg-orange-50 text-orange-700 ring-orange-600/20", dot: "bg-orange-500" },
    Delivered: { badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", dot: "bg-emerald-500" },
    Cancelled: { badge: "bg-rose-50 text-rose-700 ring-rose-600/15", dot: "bg-rose-500" },
};

const fallback = { badge: "bg-zinc-100 text-zinc-700 ring-zinc-500/15", dot: "bg-zinc-400" };

export const getStatusStyle = (status: string) => statusStyles[status] ?? fallback;
