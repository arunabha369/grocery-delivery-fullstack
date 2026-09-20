import { useCallback, useEffect, useState, type SubmitEvent } from "react";
import toast from "react-hot-toast";
import { BikeIcon, CarIcon, ChevronDownIcon, EyeIcon, EyeOffIcon, Loader2Icon, MailIcon, PhoneIcon, PlusIcon, UserRoundPlusIcon } from "lucide-react";
import type { DeliveryPartner } from "../../types";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import { ScooterArt } from "../../components/illustrations";
import api from "../../config/api";
import { getErrorMessage } from "../../lib/errors";
import { formatDate } from "../../lib/format";

const emptyForm = { name: "", email: "", password: "", phone: "", vehicleType: "bike" };

// ScooterArt stands in for the empty state; vehicle icons for the cards
const vehicleIcon = (type: string) => (type === "car" ? CarIcon : BikeIcon);

const NoPartnersArt = (props: { className?: string }) => <ScooterArt speedLines={false} {...props} />;

export default function AdminDeliveryPartners() {
    const [partners, setPartners] = useState<DeliveryPartner[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState(emptyForm);

    const fetchPartners = useCallback(async () => {
        try {
            const { data } = await api.get("/admin/delivery-partners");
            setPartners(data.partners);
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to load partners"));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPartners();
    }, [fetchPartners]);

    const closeForm = () => {
        setShowForm(false);
        setForm(emptyForm);
        setShowPassword(false);
    };

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post("/admin/delivery-partners", form);
            toast.success(`${form.name} has been onboarded`);
            closeForm();
            await fetchPartners();
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to create partner"));
        } finally {
            setSaving(false);
        }
    };

    const toggleActive = async (partner: DeliveryPartner) => {
        setTogglingId(partner.id);
        try {
            await api.put(`/admin/delivery-partners/${partner.id}`, { isActive: !partner.isActive });
            toast.success(partner.isActive ? `${partner.name} deactivated` : `${partner.name} activated`);
            await fetchPartners();
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to update partner"));
        } finally {
            setTogglingId(null);
        }
    };

    const set = (key: keyof typeof emptyForm) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));
    const activeCount = partners.filter((p) => p.isActive).length;

    return (
        <>
            <AdminPageHeader
                title="Delivery partners"
                description={loading ? "Loading team…" : `${activeCount} active · ${partners.length - activeCount} inactive`}
                actions={
                    <button type="button" onClick={() => setShowForm(true)} className="btn btn-primary">
                        <PlusIcon className="size-4" /> Add partner
                    </button>
                }
            />

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 3 }, (_, i) => (
                        <div key={i} className="skeleton h-52 rounded-2xl" />
                    ))}
                </div>
            ) : partners.length === 0 ? (
                <div className="card">
                    <EmptyState
                        art={NoPartnersArt}
                        title="No delivery partners yet"
                        description="Onboard your first partner so orders can be assigned and delivered."
                        action={
                            <button type="button" onClick={() => setShowForm(true)} className="btn btn-primary">
                                <PlusIcon className="size-4" /> Add partner
                            </button>
                        }
                    />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {partners.map((p) => {
                        const Vehicle = vehicleIcon(p.vehicleType);
                        return (
                            <div key={p.id} className={`card flex flex-col p-5 ${p.isActive ? "" : "bg-zinc-50/80"}`}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <span className={`flex-center size-12 rounded-full text-lg font-semibold text-white ${p.isActive ? "bg-app-green" : "bg-zinc-400"}`}>{p.name.charAt(0)}</span>
                                        <div>
                                            <p className="font-semibold text-app-text">{p.name}</p>
                                            <p className="flex items-center gap-1 text-xs text-app-text-light capitalize">
                                                <Vehicle className="size-3.5" /> {p.vehicleType}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${p.isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15" : "bg-zinc-100 text-zinc-600 ring-zinc-500/15"}`}>
                                        <span className={`size-1.5 rounded-full ${p.isActive ? "bg-emerald-500" : "bg-zinc-400"}`} />
                                        {p.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                <div className="mt-5 space-y-2 text-sm text-zinc-600">
                                    <a href={`mailto:${p.email}`} className="flex items-center gap-2.5 rounded hover:text-app-green">
                                        <MailIcon className="size-4 text-zinc-400" /> <span className="truncate">{p.email}</span>
                                    </a>
                                    <a href={`tel:${p.phone}`} className="flex items-center gap-2.5 rounded hover:text-app-green">
                                        <PhoneIcon className="size-4 text-zinc-400" /> {p.phone}
                                    </a>
                                </div>

                                <div className="mt-5 flex items-center justify-between border-t border-app-border pt-4">
                                    <span className="text-xs text-app-text-light">Joined {formatDate(p.createdAt)}</span>
                                    <button type="button" onClick={() => toggleActive(p)} disabled={togglingId === p.id} className={`btn btn-sm ${p.isActive ? "btn-ghost hover:bg-rose-50 hover:text-rose-600" : "btn-dark"}`}>
                                        {togglingId === p.id && <Loader2Icon className="size-3.5 animate-spin" />}
                                        {p.isActive ? "Deactivate" : "Activate"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal open={showForm} onClose={saving ? () => {} : closeForm} title="Onboard delivery partner" description="They'll use these details to sign in to the partner portal." icon={<UserRoundPlusIcon className="size-5 text-app-green" />}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="dp-name" className="field-label">
                            Full name
                        </label>
                        <input id="dp-name" type="text" required autoComplete="off" value={form.name} onChange={set("name")} className="field" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="dp-email" className="field-label">
                                Email
                            </label>
                            <input id="dp-email" type="email" required autoComplete="off" value={form.email} onChange={set("email")} className="field" />
                        </div>
                        <div>
                            <label htmlFor="dp-phone" className="field-label">
                                Phone
                            </label>
                            <input id="dp-phone" type="tel" required autoComplete="off" value={form.phone} onChange={set("phone")} className="field" />
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="dp-password" className="field-label">
                                Password
                            </label>
                            <div className="relative">
                                <input id="dp-password" type={showPassword ? "text" : "password"} required minLength={6} autoComplete="new-password" value={form.password} onChange={set("password")} className="field pr-11" />
                                <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-lg p-2 text-zinc-400 hover:bg-app-cream hover:text-app-green">
                                    {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-app-text-light">At least 6 characters.</p>
                        </div>
                        <div>
                            <label htmlFor="dp-vehicle" className="field-label">
                                Vehicle
                            </label>
                            <div className="relative">
                                <select id="dp-vehicle" value={form.vehicleType} onChange={set("vehicleType")} className="field appearance-none pr-9">
                                    <option value="bike">Bike</option>
                                    <option value="scooter">Scooter</option>
                                    <option value="car">Car</option>
                                </select>
                                <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-app-text-light" />
                            </div>
                        </div>
                    </div>
                    <button type="submit" disabled={saving} className="btn btn-dark mt-2 w-full py-3">
                        {saving && <Loader2Icon className="size-4 animate-spin" />}
                        {saving ? "Creating partner…" : "Create partner"}
                    </button>
                </form>
            </Modal>
        </>
    );
}
