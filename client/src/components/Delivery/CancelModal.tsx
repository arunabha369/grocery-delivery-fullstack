import { Loader2Icon, XCircleIcon } from "lucide-react";
import Modal from "../ui/Modal";

interface CancelModalProps {
    setCancelModal: (cancelModal: string | null) => void;
    cancelReason: string;
    setCancelReason: (cancelReason: string) => void;
    handleCancel: () => void;
    submitting: boolean;
}

const quickReasons = ["Customer unavailable", "Address not found", "Customer refused order", "Vehicle issue"];

export default function CancelModal({ setCancelModal, cancelReason, setCancelReason, handleCancel, submitting }: CancelModalProps) {
    const close = () => {
        if (submitting) return;
        setCancelModal(null);
        setCancelReason("");
    };

    return (
        <Modal open onClose={close} title="Cancel this delivery?" description="The customer will see this order as cancelled. Please tell us why." icon={<XCircleIcon className="size-5 text-app-error" />} size="sm">
            <div className="mb-3 flex flex-wrap gap-2">
                {quickReasons.map((r) => (
                    <button key={r} type="button" onClick={() => setCancelReason(r)} aria-pressed={cancelReason === r} className={`rounded-full px-3 py-1.5 text-xs font-medium ${cancelReason === r ? "bg-red-600 text-white" : "bg-app-cream text-app-text-light hover:text-app-green"}`}>
                        {r}
                    </button>
                ))}
            </div>
            <label htmlFor="cancel-reason" className="sr-only">
                Cancellation reason
            </label>
            <textarea id="cancel-reason" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} rows={3} placeholder="Add details (optional)…" className="field resize-none" />
            <div className="mt-5 flex gap-2">
                <button type="button" onClick={close} disabled={submitting} className="btn btn-outline flex-1">
                    Keep delivery
                </button>
                <button type="button" onClick={handleCancel} disabled={submitting} className="btn btn-danger flex-1">
                    {submitting && <Loader2Icon className="size-4 animate-spin" />}
                    {submitting ? "Cancelling…" : "Cancel delivery"}
                </button>
            </div>
        </Modal>
    );
}
