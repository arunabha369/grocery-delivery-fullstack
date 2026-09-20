import { useEffect, useMemo, useState, type DragEvent, type SubmitEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeftIcon, ChevronDownIcon, ImageUpIcon, LeafIcon, Loader2Icon, RefreshCwIcon } from "lucide-react";
import { categoriesData } from "../../assets/assets";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import api from "../../config/api";
import { getErrorMessage } from "../../lib/errors";
import { currency } from "../../lib/format";

const initialForm = { name: "", description: "", price: "", originalPrice: "", image: "", category: "", unit: "", stock: "", isOrganic: false };

export default function AdminProductForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    const [formData, setFormData] = useState(initialForm);

    // One object URL per selected file, revoked when it changes
    const filePreview = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : null), [imageFile]);
    useEffect(() => {
        return () => {
            if (filePreview) URL.revokeObjectURL(filePreview);
        };
    }, [filePreview]);
    const preview = filePreview ?? formData.image;

    useEffect(() => {
        if (!isEdit) return;
        api.get(`/products/${id}`)
            .then(({ data }) => {
                const p = data.product;
                setFormData({
                    name: p.name,
                    description: p.description,
                    price: p.price.toString(),
                    originalPrice: p.originalPrice ? p.originalPrice.toString() : "",
                    image: p.image,
                    category: p.category,
                    unit: p.unit,
                    stock: p.stock.toString(),
                    isOrganic: p.isOrganic,
                });
            })
            .catch((error) => toast.error(getErrorMessage(error, "Failed to load product")))
            .finally(() => setLoading(false));
    }, [id, isEdit]);

    const pickFile = (file: File | undefined | null) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please choose an image file");
            return;
        }
        setImageFile(file);
    };

    const onDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setDragging(false);
        pickFile(e.dataTransfer.files?.[0]);
    };

    const discount = formData.originalPrice && formData.price && Number(formData.originalPrice) > Number(formData.price) ? Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100) : 0;
    const invalidOriginal = formData.originalPrice !== "" && formData.price !== "" && Number(formData.originalPrice) < Number(formData.price);

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            let finalImageUrl = formData.image;

            if (imageFile) {
                const upload = new FormData();
                upload.append("image", imageFile);
                const { data } = await api.post("/upload", upload);
                finalImageUrl = data.url;
            }

            if (!finalImageUrl) {
                toast.error("Please upload a product image");
                setSaving(false);
                return;
            }

            const payload = {
                ...formData,
                image: finalImageUrl,
                price: Number(formData.price),
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : 0,
                stock: Number(formData.stock),
            };

            if (isEdit) {
                await api.put(`/products/${id}`, payload);
                toast.success("Product updated successfully");
            } else {
                await api.post("/products", payload);
                toast.success("Product created successfully");
            }
            navigate("/admin/products");
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to save product"));
        } finally {
            setSaving(false);
        }
    };

    const set = (key: keyof typeof initialForm) => (e: { target: { value: string } }) => setFormData((f) => ({ ...f, [key]: e.target.value }));

    return (
        <>
            <Link to="/admin/products" className="mb-3 inline-flex items-center gap-1.5 rounded text-sm font-medium text-app-text-light hover:text-app-green">
                <ArrowLeftIcon className="size-4" /> All products
            </Link>
            <AdminPageHeader title={isEdit ? "Edit product" : "New product"} description={isEdit ? "Update details, pricing and stock." : "Add a new item to your store."} />

            {loading ? (
                <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                    <div className="skeleton h-96 rounded-2xl" />
                    <div className="skeleton h-80 rounded-2xl" />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
                    <div className="space-y-6">
                        {/* Details */}
                        <section className="card space-y-5 p-5 sm:p-6">
                            <h2 className="font-semibold text-app-green">Product details</h2>
                            <div>
                                <label htmlFor="p-name" className="field-label">
                                    Name
                                </label>
                                <input id="p-name" required type="text" value={formData.name} onChange={set("name")} placeholder="e.g. Organic Bananas 1kg" className="field" />
                            </div>
                            <div>
                                <label htmlFor="p-desc" className="field-label">
                                    Description
                                </label>
                                <textarea id="p-desc" required rows={4} value={formData.description} onChange={set("description")} placeholder="What makes this product great?" className="field resize-none" />
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="p-cat" className="field-label">
                                        Category
                                    </label>
                                    <div className="relative">
                                        <select id="p-cat" required value={formData.category} onChange={set("category")} className="field appearance-none pr-9">
                                            <option value="">Select a category</option>
                                            {categoriesData.map((c) => (
                                                <option key={c.slug} value={c.slug}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-app-text-light" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="p-unit" className="field-label">
                                        Unit
                                    </label>
                                    <input id="p-unit" required type="text" placeholder="e.g. 1kg, 500g, 1 piece" value={formData.unit} onChange={set("unit")} className="field" />
                                </div>
                            </div>
                        </section>

                        {/* Pricing */}
                        <section className="card space-y-5 p-5 sm:p-6">
                            <h2 className="font-semibold text-app-green">Pricing & inventory</h2>
                            <div className="grid gap-5 sm:grid-cols-3">
                                <div>
                                    <label htmlFor="p-price" className="field-label">
                                        Selling price ({currency})
                                    </label>
                                    <input id="p-price" required type="number" step="0.01" min="0" value={formData.price} onChange={set("price")} className="field" />
                                </div>
                                <div>
                                    <label htmlFor="p-orig" className="field-label">
                                        Original price ({currency}) <span className="font-normal text-app-text-light">· optional</span>
                                    </label>
                                    <input id="p-orig" type="number" step="0.01" min="0" value={formData.originalPrice} onChange={set("originalPrice")} aria-invalid={invalidOriginal} className="field" />
                                </div>
                                <div>
                                    <label htmlFor="p-stock" className="field-label">
                                        Stock
                                    </label>
                                    <input id="p-stock" required type="number" min="0" value={formData.stock} onChange={set("stock")} className="field" />
                                </div>
                            </div>
                            {invalidOriginal ? <p className="-mt-2 text-xs text-app-error">Original price is lower than the selling price, so no discount will be shown.</p> : discount > 0 && <p className="-mt-2 text-xs font-medium text-emerald-700">Customers will see {discount}% off.</p>}

                            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-emerald-50/60 px-4 py-3">
                                <span className="flex items-center gap-2 text-sm font-medium text-app-green">
                                    <LeafIcon className="size-4 text-emerald-600" /> Certified organic
                                </span>
                                <input type="checkbox" role="switch" checked={formData.isOrganic} onChange={(e) => setFormData((f) => ({ ...f, isOrganic: e.target.checked }))} className="peer sr-only" />
                                <span className="relative h-6 w-11 shrink-0 rounded-full bg-zinc-300 transition-colors peer-checked:bg-app-green peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-app-orange after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:content-[''] peer-checked:after:translate-x-5" />
                            </label>
                        </section>
                    </div>

                    {/* Image + actions */}
                    <div className="space-y-6 lg:sticky lg:top-10">
                        <section className="card p-5 sm:p-6">
                            <h2 className="font-semibold text-app-green">Product image</h2>
                            <label
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragging(true);
                                }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={onDrop}
                                className={`group relative mt-4 flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition ${dragging ? "border-app-orange bg-orange-50" : "border-app-border bg-app-cream/60 hover:border-app-green/30"}`}
                            >
                                <input type="file" accept="image/*" className="sr-only" onChange={(e) => pickFile(e.target.files?.[0])} />
                                {preview ? (
                                    <>
                                        <img src={preview} alt="Product preview" className="size-full object-contain p-6 mix-blend-multiply" />
                                        <span className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-1.5 rounded-xl bg-white/90 py-2 text-xs font-semibold text-app-green opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100 group-focus-within:opacity-100">
                                            <RefreshCwIcon className="size-3.5" /> Replace image
                                        </span>
                                    </>
                                ) : (
                                    <span className="flex flex-col items-center px-6 text-center">
                                        <span className="flex-center size-12 rounded-2xl bg-white text-app-green shadow-sm">
                                            <ImageUpIcon className="size-5" />
                                        </span>
                                        <span className="mt-3 text-sm font-semibold text-app-green">Drop an image or click to upload</span>
                                        <span className="mt-1 text-xs text-app-text-light">PNG or JPG with a plain background works best</span>
                                    </span>
                                )}
                            </label>
                            {imageFile && <p className="mt-2 truncate text-xs text-app-text-light">Selected: {imageFile.name}</p>}
                        </section>

                        <div className="flex gap-2">
                            <Link to="/admin/products" className="btn btn-outline flex-1">
                                Cancel
                            </Link>
                            <button disabled={saving} type="submit" className="btn btn-primary flex-1">
                                {saving && <Loader2Icon className="size-4 animate-spin" />}
                                {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </>
    );
}
