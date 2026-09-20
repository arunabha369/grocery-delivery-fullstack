import { ArrowLeftIcon, ArrowRightIcon, BanknoteIcon, CheckIcon, CreditCardIcon, LockIcon } from "lucide-react";
import { SiMastercard, SiVisa } from "@icons-pack/react-simple-icons";

interface CheckoutPaymentProps {
    paymentMethod: string;
    setPaymentMethod: (method: string) => void;
    onBack: () => void;
    onContinue: () => void;
}

const methods = [
    { value: "card", label: "Credit / debit card", desc: "Pay securely with Stripe", icon: CreditCardIcon },
    { value: "cash", label: "Cash on delivery", desc: "Pay when your order arrives", icon: BanknoteIcon },
];

export default function CheckoutPayment({ paymentMethod, setPaymentMethod, onBack, onContinue }: CheckoutPaymentProps) {
    return (
        <div className="card animate-fade-in p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-app-green">
                <CreditCardIcon className="size-5" /> Payment method
            </h2>
            <p className="mt-1 text-sm text-app-text-light">All transactions are secure and encrypted.</p>

            <div className="mt-5 space-y-3" role="radiogroup" aria-label="Payment method">
                {methods.map((method) => {
                    const selected = paymentMethod === method.value;
                    return (
                        <button key={method.value} type="button" role="radio" aria-checked={selected} onClick={() => setPaymentMethod(method.value)} className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${selected ? "border-app-green bg-app-green/[0.04]" : "border-app-border hover:border-app-green/30"}`}>
                            <span className={`flex-center size-11 shrink-0 rounded-xl ${selected ? "bg-app-green text-white" : "bg-app-cream text-app-green"}`}>
                                <method.icon className="size-5" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold text-app-green">{method.label}</span>
                                <span className="block text-xs text-app-text-light">{method.desc}</span>
                            </span>
                            {method.value === "card" && (
                                <span className="hidden items-center gap-1.5 text-zinc-400 sm:flex" aria-hidden="true">
                                    <SiVisa className="size-7" />
                                    <SiMastercard className="size-5" />
                                </span>
                            )}
                            <span className={`flex-center size-5 shrink-0 rounded-full ${selected ? "bg-app-green text-white" : "ring-2 ring-app-border ring-inset"}`}>{selected && <CheckIcon className="size-3" strokeWidth={3} />}</span>
                        </button>
                    );
                })}
            </div>

            {paymentMethod === "card" && (
                <p className="mt-4 flex items-center gap-2 rounded-xl bg-app-cream px-4 py-3 text-xs text-app-text-light">
                    <LockIcon className="size-3.5 shrink-0 text-app-green" /> You'll be redirected to Stripe's secure checkout to complete your payment.
                </p>
            )}

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-app-border pt-5">
                <button type="button" onClick={onBack} className="btn btn-ghost">
                    <ArrowLeftIcon className="size-4" /> Back
                </button>
                <button type="button" onClick={onContinue} className="btn btn-dark px-6 py-3">
                    Review order <ArrowRightIcon className="size-4" />
                </button>
            </div>
        </div>
    );
}
