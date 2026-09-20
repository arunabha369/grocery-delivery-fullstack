import { useState } from "react";
import toast from "react-hot-toast";
import { BriefcaseIcon, CheckIcon, HomeIcon, MapPinIcon, PencilIcon, Trash2Icon } from "lucide-react";
import type { Address } from "../types";
import api from "../config/api";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../lib/errors";
import ConfirmDialog from "./ui/ConfirmDialog";

interface AddressCardProps {
    addr: Address;
    onEditHandler: (addr: Address) => void;
    setAddresses: (addresses: Address[]) => void;
}

const labelIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("home")) return HomeIcon;
    if (l.includes("work") || l.includes("office")) return BriefcaseIcon;
    return MapPinIcon;
};

const AddressCard = ({ addr, onEditHandler, setAddresses }: AddressCardProps) => {
    const { updateUser } = useAuth();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [makingDefault, setMakingDefault] = useState(false);
    const Icon = labelIcon(addr.label);

    const sync = (addresses: Address[]) => {
        setAddresses(addresses);
        updateUser({ addresses });
    };

    const handleDelete = async () => {
        try {
            const { data } = await api.delete(`/addresses/${addr.id}`);
            sync(data.addresses);
            toast.success("Address removed");
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleMakeDefault = async () => {
        setMakingDefault(true);
        try {
            // The API requires coordinates on update, so resend the saved ones
            const { data } = await api.put(`/addresses/${addr.id}`, { isDefault: true, lat: addr.lat, lng: addr.lng });
            sync(data.addresses);
            toast.success(`${addr.label} is now your default address`);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setMakingDefault(false);
        }
    };

    return (
        <div className={`card flex flex-col p-5 ${addr.isDefault ? "ring-2 ring-app-green/15" : ""}`}>
            <div className="flex items-start gap-4">
                <div className={`flex-center size-11 shrink-0 rounded-xl ${addr.isDefault ? "bg-app-green text-white" : "bg-app-cream text-app-green"}`}>
                    <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-app-green">{addr.label}</p>
                        {addr.isDefault && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                <CheckIcon className="size-3" strokeWidth={3} /> Default
                            </span>
                        )}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                        {addr.address}
                        <br />
                        {addr.city}, {addr.state} {addr.zip}
                    </p>
                </div>
            </div>

            <div className="mt-5 flex items-center gap-1 border-t border-app-border pt-3">
                {!addr.isDefault && (
                    <button type="button" onClick={handleMakeDefault} disabled={makingDefault} className="btn btn-sm btn-ghost mr-auto -ml-2 text-app-green">
                        Set as default
                    </button>
                )}
                <button type="button" onClick={() => onEditHandler(addr)} className="btn btn-sm btn-ghost ml-auto">
                    <PencilIcon className="size-3.5" /> Edit
                </button>
                <button type="button" onClick={() => setConfirmOpen(true)} className="btn btn-sm btn-ghost hover:bg-red-50 hover:text-app-error">
                    <Trash2Icon className="size-3.5" /> Delete
                </button>
            </div>

            <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete this address?" description={`"${addr.label}" will be removed from your saved addresses. This can't be undone.`} confirmLabel="Delete address" />
        </div>
    );
};

export default AddressCard;
