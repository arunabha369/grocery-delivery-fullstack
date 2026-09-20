import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArchiveXIcon, ChevronDownIcon, LeafIcon, PencilIcon, PlusIcon, SearchIcon } from "lucide-react";
import type { Product } from "../../types";
import { categoriesData } from "../../assets/assets";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import { NoResultsArt } from "../../components/illustrations";
import api from "../../config/api";
import { getErrorMessage } from "../../lib/errors";
import { categoryLabel, formatPrice } from "../../lib/format";

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [pendingRemoval, setPendingRemoval] = useState<Product | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            const { data } = await api.get("/products");
            setProducts(data.products);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleMarkOutOfStock = async () => {
        if (!pendingRemoval) return;
        try {
            await api.delete(`/products/${pendingRemoval.id}`);
            toast.success(`${pendingRemoval.name} marked as out of stock`);
            await fetchProducts();
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to update product"));
        }
    };

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return products.filter((p) => (!category || p.category === category) && (!q || p.name.toLowerCase().includes(q)));
    }, [products, query, category]);

    const outOfStock = products.filter((p) => p.stock <= 0).length;

    return (
        <>
            <AdminPageHeader
                title="Products"
                description={loading ? "Loading catalogue…" : `${products.length} products · ${outOfStock} out of stock`}
                actions={
                    <Link to="/admin/products/new" className="btn btn-primary">
                        <PlusIcon className="size-4" /> Add product
                    </Link>
                }
            />

            <div className="card overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col gap-3 border-b border-app-border p-4 sm:flex-row sm:items-center">
                    <label className="relative flex-1">
                        <span className="sr-only">Search products</span>
                        <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-400" />
                        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by product name…" className="field h-10 pl-10" />
                    </label>
                    <label className="relative sm:w-56">
                        <span className="sr-only">Filter by category</span>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="field h-10 appearance-none py-0 pr-9">
                            <option value="">All categories</option>
                            {categoriesData.map((c) => (
                                <option key={c.slug} value={c.slug}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-app-text-light" />
                    </label>
                </div>

                {loading ? (
                    <div className="space-y-3 p-5">
                        {Array.from({ length: 5 }, (_, i) => (
                            <div key={i} className="skeleton h-14" />
                        ))}
                    </div>
                ) : visible.length === 0 ? (
                    <EmptyState art={NoResultsArt} title={products.length === 0 ? "No products yet" : "No matching products"} description={products.length === 0 ? "Add your first product to start selling." : "Try a different search term or category."} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-app-cream/60 text-xs font-semibold tracking-wide text-app-text-light uppercase">
                                <tr>
                                    <th className="px-5 py-3">Product</th>
                                    <th className="px-5 py-3">Price</th>
                                    <th className="px-5 py-3">Stock</th>
                                    <th className="px-5 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-app-border">
                                {visible.map((product) => {
                                    const cat = categoriesData.find((c) => c.slug === product.category);
                                    return (
                                        <tr key={product.id} className={`hover:bg-app-cream/40 ${product.stock <= 0 ? "opacity-70" : ""}`}>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-12 shrink-0 rounded-xl p-1.5" style={{ backgroundColor: cat?.tint ?? "#f0ebe3" }}>
                                                        <img src={product.image} alt="" className="size-full object-contain mix-blend-multiply" />
                                                    </div>
                                                    <div>
                                                        <p className="flex items-center gap-1.5 font-semibold text-app-text">
                                                            {product.name}
                                                            {product.isOrganic && <LeafIcon className="size-3.5 text-emerald-600" aria-label="Organic" />}
                                                        </p>
                                                        <p className="text-xs text-app-text-light">
                                                            {cat?.name ?? (product.category ? categoryLabel(product.category) : "Uncategorised")} · {product.unit}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <p className="font-semibold text-app-green">{formatPrice(product.price)}</p>
                                                {product.originalPrice > product.price && <p className="text-xs text-app-text-light line-through">{formatPrice(product.originalPrice)}</p>}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${product.stock <= 0 ? "bg-rose-50 text-rose-700 ring-rose-600/15" : product.stock < 10 ? "bg-amber-50 text-amber-700 ring-amber-600/20" : "bg-emerald-50 text-emerald-700 ring-emerald-600/15"}`}>
                                                    {product.stock <= 0 ? "Out of stock" : product.stock < 10 ? `Low · ${product.stock} left` : `${product.stock} in stock`}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link to={`/admin/products/${product.id}/edit`} className="btn btn-sm btn-outline" aria-label={`Edit ${product.name}`}>
                                                        <PencilIcon className="size-3.5" /> Edit
                                                    </Link>
                                                    <button type="button" onClick={() => setPendingRemoval(product)} disabled={product.stock <= 0} title="Mark as out of stock" aria-label={`Mark ${product.name} as out of stock`} className="btn btn-sm btn-ghost hover:bg-rose-50 hover:text-rose-600">
                                                        <ArchiveXIcon className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={Boolean(pendingRemoval)}
                onClose={() => setPendingRemoval(null)}
                onConfirm={handleMarkOutOfStock}
                title="Mark as out of stock?"
                description={`"${pendingRemoval?.name}" will be hidden from the store until you update its stock.`}
                confirmLabel="Mark out of stock"
            />
        </>
    );
}
