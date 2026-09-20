import { Link } from "react-router-dom";
import { ArrowRightIcon, CheckIcon, MapPinIcon, PlusIcon } from "lucide-react";
import type { Address } from "../../types";
import EmptyState from "../ui/EmptyState";
import { NoAddressArt } from "../illustrations";

interface CheckoutAddressProps {
    addresses: Address[];
    selectedId: string | null;
    onSelect: (address: Address) => void;
    onContinue: () => void;
}

const ADD_ADDRESS_LINK = "/addresses?new=1&returnTo=/checkout";

export default function CheckoutAddress({ addresses, selectedId, onSelect, onContinue }: CheckoutAddressProps) {
    if (addresses.length === 0) {
        return (
            <div className="card animate-fade-in">
                <EmptyState
                    art={NoAddressArt}
                    title="Where should we deliver?"
                    description="Add a delivery address to continue. We'll bring you right back here once it's saved."
                    action={
                        <Link to={ADD_ADDRESS_LINK} className="btn btn-primary">
                            <PlusIcon className="size-4" /> Add delivery address
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="card animate-fade-in p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-app-green">
                <MapPinIcon className="size-5" /> Delivery address
            </h2>
            <p className="mt-1 text-sm text-app-text-light">Choose where you'd like your order delivered.</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Saved addresses">
                {addresses.map((addr) => {
                    const selected = addr.id === selectedId;
                    return (
                        <button
                            key={addr.id}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => onSelect(addr)}
                            className={`relative rounded-2xl border-2 p-4 text-left transition ${selected ? "border-app-green bg-app-green/[0.04]" : "border-app-border hover:border-app-green/30"}`}
                        >
                            <span className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-app-green">{addr.label}</span>
                                {addr.isDefault && <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-app-orange-dark uppercase">Default</span>}
                            </span>
                            <span className="mt-1.5 block text-sm text-zinc-600">{addr.address}</span>
                            <span className="block text-sm text-app-text-light">
                                {addr.city}, {addr.state} {addr.zip}
                            </span>
                            <span className={`flex-center absolute top-4 right-4 size-5 rounded-full ${selected ? "bg-app-green text-white" : "ring-2 ring-app-border ring-inset"}`}>{selected && <CheckIcon className="size-3" strokeWidth={3} />}</span>
                        </button>
                    );
                })}
                <Link to={ADD_ADDRESS_LINK} className="flex-center min-h-28 flex-col gap-2 rounded-2xl border-2 border-dashed border-app-border p-4 text-sm font-medium text-app-text-light hover:border-app-green/30 hover:text-app-green">
                    <span className="flex-center size-9 rounded-full bg-app-cream">
                        <PlusIcon className="size-4" />
                    </span>
                    Add a new address
                </Link>
            </div>

            <div className="mt-6 flex justify-end border-t border-app-border pt-5">
                <button type="button" onClick={onContinue} disabled={!selectedId} className="btn btn-dark px-6 py-3">
                    Continue to payment <ArrowRightIcon className="size-4" />
                </button>
            </div>
        </div>
    );
}
