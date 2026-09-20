export const currency: string = import.meta.env.VITE_CURRENCY_SYMBOL || "$";

// Must match the pricing in server/controllers/orderController.ts (createOrder)
export const FREE_DELIVERY_THRESHOLD = 500;
export const DELIVERY_FEE = 49;
export const TAX_RATE = 0.08;

const locale = currency === "₹" ? "en-IN" : "en-US";

/** ₹45, ₹45.50, ₹1,250 — drops ".00" on whole amounts. */
export function formatPrice(value: number) {
    const fractionDigits = Math.round(value * 100) % 100 === 0 ? 0 : 2;
    return currency + value.toLocaleString(locale, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
}

export function getOrderPricing(subtotal: number) {
    const deliveryFee = subtotal > FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;
    return { deliveryFee, tax, total };
}

export const shortOrderId = (id: string) => id.slice(-8).toUpperCase();

export const formatDate = (iso: string, options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }) => new Date(iso).toLocaleDateString("en-US", options);

export const formatDateTime = (iso: string) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export const pluralize = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

export const categoryLabel = (slug: string) => slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
