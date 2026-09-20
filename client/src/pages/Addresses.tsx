import { useEffect, useState, type SubmitEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PlusIcon } from "lucide-react";
import type { Address } from "../types";
import AddressCard from "../components/AddressCard";
import AddressForm, { type AddressFormValues } from "../components/AddressForm";
import EmptyState from "../components/ui/EmptyState";
import { ListSkeleton } from "../components/ui/Skeleton";
import { NoAddressArt } from "../components/illustrations";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import { getErrorMessage } from "../lib/errors";

const emptyForm: AddressFormValues = { label: "", address: "", city: "", state: "", zip: "", isDefault: false };

const getLocation = (retries = 3): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported. Using default coordinates.");
            resolve({ lat: 0, lng: 0 });
            return;
        }

        const attempt = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
                (error) => {
                    // Retrying can't help once the user has denied permission
                    if (retries > 0 && error.code !== error.PERMISSION_DENIED) {
                        retries--;
                        setTimeout(attempt, 1000);
                    } else {
                        console.warn("Geolocation error:", error.message);
                        toast.error("Location unavailable. Using default coordinates.");
                        resolve({ lat: 0, lng: 0 });
                    }
                },
                { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
            );
        };
        attempt();
    });
};

const Addresses = () => {
    const { updateUser } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // When opened from checkout, send the user back once an address is saved
    const returnTo = searchParams.get("returnTo");
    const safeReturnTo = returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : null;

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(() => searchParams.get("new") === "1");
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<AddressFormValues>(emptyForm);

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
    };

    const openNewForm = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
    };

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const coords = await getLocation();
            const payload = { ...form, ...coords };
            const previousIds = new Set(addresses.map((a) => a.id));

            const { data } = editingId ? await api.put(`/addresses/${editingId}`, payload) : await api.post(`/addresses`, payload);
            setAddresses(data.addresses);
            updateUser({ addresses: data.addresses });
            toast.success(editingId ? "Address updated" : "Address added");
            closeForm();

            if (safeReturnTo && !editingId) {
                const created = (data.addresses as Address[]).find((a) => !previousIds.has(a.id));
                navigate(safeReturnTo, { state: { selectAddressId: created?.id } });
            }
        } catch (error) {
            toast.error(getErrorMessage(error, "Couldn't save the address"));
        } finally {
            setSaving(false);
        }
    };

    const onEditHandler = (add: Address) => {
        setForm({ label: add.label, address: add.address, city: add.city, state: add.state, zip: add.zip, isDefault: add.isDefault });
        setEditingId(add.id);
        setShowForm(true);
    };

    useEffect(() => {
        api.get("/addresses")
            .then(({ data }) => setAddresses(data.addresses))
            .catch((error) => toast.error(getErrorMessage(error)))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="mx-auto max-w-5xl px-4 pt-8 pb-20 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="eyebrow">Account</p>
                    <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-app-green">Saved addresses</h1>
                    <p className="mt-1 text-sm text-app-text-light">Manage where your groceries get delivered.</p>
                </div>
                {addresses.length > 0 && (
                    <button type="button" onClick={openNewForm} className="btn btn-dark">
                        <PlusIcon className="size-4" /> Add address
                    </button>
                )}
            </div>

            {loading ? (
                <ListSkeleton rows={2} className="h-40" />
            ) : addresses.length === 0 ? (
                <div className="card">
                    <EmptyState
                        art={NoAddressArt}
                        title="No saved addresses yet"
                        description="Add your home or work address for a faster checkout next time."
                        action={
                            <button type="button" onClick={openNewForm} className="btn btn-primary">
                                <PlusIcon className="size-4" /> Add your first address
                            </button>
                        }
                    />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map((addr) => (
                        <AddressCard key={addr.id} addr={addr} onEditHandler={onEditHandler} setAddresses={setAddresses} />
                    ))}
                </div>
            )}

            <AddressForm open={showForm} onClose={closeForm} onSubmit={handleSubmit} form={form} setForm={setForm} editing={Boolean(editingId)} saving={saving} />
        </div>
    );
};

export default Addresses;
