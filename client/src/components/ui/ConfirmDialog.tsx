import { useState, type ReactNode } from "react";
import { AlertTriangleIcon, Loader2Icon } from "lucide-react";
import Modal from "./Modal";

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    title: string;
    description: ReactNode;
    confirmLabel?: string;
    tone?: "danger" | "default";
}

export default function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = "Confirm", tone = "danger" }: ConfirmDialogProps) {
    const [busy, setBusy] = useState(false);

    const handleConfirm = async () => {
        setBusy(true);
        try {
            await onConfirm();
            onClose();
        } finally {
            setBusy(false);
        }
    };

    return (
        <Modal open={open} onClose={busy ? () => {} : onClose} title={title} size="sm" icon={<AlertTriangleIcon className={`size-5 ${tone === "danger" ? "text-red-600" : "text-app-orange"}`} />}>
            <p className="text-sm leading-relaxed text-app-text-light">{description}</p>
            <div className="mt-6 flex gap-2">
                <button type="button" onClick={onClose} disabled={busy} className="btn btn-outline flex-1">
                    Cancel
                </button>
                <button type="button" onClick={handleConfirm} disabled={busy} className={`btn flex-1 ${tone === "danger" ? "btn-danger" : "btn-dark"}`}>
                    {busy && <Loader2Icon className="size-4 animate-spin" />}
                    {confirmLabel}
                </button>
            </div>
        </Modal>
    );
}
