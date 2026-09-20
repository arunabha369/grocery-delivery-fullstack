import type { Dispatch, SubmitEvent, SetStateAction } from "react";
import { Loader2Icon, LocateFixedIcon, MapPinIcon } from "lucide-react";
import Modal from "./ui/Modal";

export interface AddressFormValues {
    label: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    isDefault: boolean;
}

interface AddressFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (e: SubmitEvent) => void;
    form: AddressFormValues;
    setForm: Dispatch<SetStateAction<AddressFormValues>>;
    editing: boolean;
    saving: boolean;
}

const quickLabels = ["Home", "Work", "Other"];

const AddressForm = ({ open, onClose, onSubmit, form, setForm, editing, saving }: AddressFormProps) => {
    const set = (key: keyof AddressFormValues) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));

    return (
        <Modal open={open} onClose={saving ? () => {} : onClose} title={editing ? "Edit address" : "Add a new address"} description="Where should we deliver your groceries?" icon={<MapPinIcon className="size-5 text-app-green" />}>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label htmlFor="addr-label" className="field-label">
                        Label
                    </label>
                    <div className="mb-2 flex gap-2">
                        {quickLabels.map((l) => (
                            <button key={l} type="button" onClick={() => setForm((f) => ({ ...f, label: l }))} aria-pressed={form.label === l} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${form.label === l ? "bg-app-green text-white" : "bg-app-cream text-app-text-light hover:text-app-green"}`}>
                                {l}
                            </button>
                        ))}
                    </div>
                    <input id="addr-label" type="text" placeholder="Home, Work, Mum's place…" required value={form.label} onChange={set("label")} className="field" />
                </div>
                <div>
                    <label htmlFor="addr-street" className="field-label">
                        Street address
                    </label>
                    <input id="addr-street" type="text" required autoComplete="street-address" placeholder="House no., building, street" value={form.address} onChange={set("address")} className="field" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="addr-city" className="field-label">
                            City
                        </label>
                        <input id="addr-city" type="text" required autoComplete="address-level2" value={form.city} onChange={set("city")} className="field" />
                    </div>
                    <div>
                        <label htmlFor="addr-state" className="field-label">
                            State
                        </label>
                        <input id="addr-state" type="text" required autoComplete="address-level1" value={form.state} onChange={set("state")} className="field" />
                    </div>
                </div>
                <div>
                    <label htmlFor="addr-zip" className="field-label">
                        ZIP / PIN code
                    </label>
                    <input id="addr-zip" type="text" inputMode="numeric" required autoComplete="postal-code" value={form.zip} onChange={set("zip")} className="field" />
                </div>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-app-cream px-4 py-3">
                    <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))} className="size-4" />
                    <span className="text-sm text-app-text">Set as my default address</span>
                </label>

                <p className="flex items-start gap-2 text-xs text-app-text-light">
                    <LocateFixedIcon className="mt-px size-3.5 shrink-0" />
                    We'll ask for your device location so your delivery partner can find you on the map.
                </p>

                <button type="submit" disabled={saving} className="btn btn-dark w-full py-3">
                    {saving && <Loader2Icon className="size-4 animate-spin" />}
                    {saving ? "Saving address…" : editing ? "Update address" : "Save address"}
                </button>
            </form>
        </Modal>
    );
};

export default AddressForm;
