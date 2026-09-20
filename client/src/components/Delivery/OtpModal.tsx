import { KeyRoundIcon, Loader2Icon } from "lucide-react";
import Modal from "../ui/Modal";

interface OtpModalProps {
    setOtpModal: (otpModal: string | null) => void;
    otp: string;
    setOtp: (otp: string) => void;
    handleComplete: () => void;
    submitting: boolean;
}

export default function OtpModal({ setOtpModal, otp, setOtp, handleComplete, submitting }: OtpModalProps) {
    const close = () => {
        if (submitting) return;
        setOtpModal(null);
        setOtp("");
    };

    return (
        <Modal open onClose={close} title="Confirm delivery" description="Ask the customer for the 6-digit OTP shown on their tracking page." icon={<KeyRoundIcon className="size-5 text-app-green" />} size="sm">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (otp.length === 6) handleComplete();
                }}
            >
                <label htmlFor="delivery-otp" className="sr-only">
                    Delivery OTP
                </label>
                <input
                    id="delivery-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="••••••"
                    className="field h-16 text-center font-mono text-3xl font-bold tracking-[0.5em] text-app-green placeholder:tracking-[0.5em]"
                />
                <div className="mt-5 flex gap-2">
                    <button type="button" onClick={close} disabled={submitting} className="btn btn-outline flex-1">
                        Cancel
                    </button>
                    <button type="submit" disabled={otp.length !== 6 || submitting} className="btn btn-primary flex-1">
                        {submitting && <Loader2Icon className="size-4 animate-spin" />}
                        {submitting ? "Verifying…" : "Confirm"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
