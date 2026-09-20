import { KeyRoundIcon } from "lucide-react";
import type { Order } from "../../types";

export default function OrderOTP({ order }: { order: Order }) {
    const showOtp = order.deliveryOtp && ["Assigned", "Packed", "Out for Delivery"].includes(order.status);
    if (!showOtp) return null;

    return (
        <section className="relative overflow-hidden rounded-2xl bg-app-green p-5 text-white sm:p-6" aria-label="Delivery OTP">
            <div className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-white/5" />
            <div className="relative flex flex-wrap items-center justify-between gap-5">
                <div className="flex items-center gap-3">
                    <div className="flex-center size-11 rounded-xl bg-white/10">
                        <KeyRoundIcon className="size-5 text-orange-300" />
                    </div>
                    <div>
                        <h2 className="font-semibold">Delivery OTP</h2>
                        <p className="text-xs text-white/65">Share this code with your partner only when your order arrives.</p>
                    </div>
                </div>
                <div className="flex gap-1.5" aria-label={`OTP ${order.deliveryOtp.split("").join(" ")}`}>
                    {order.deliveryOtp.split("").map((digit, i) => (
                        <span key={i} className="flex-center h-12 w-10 rounded-xl bg-white font-mono text-2xl font-bold text-app-green sm:w-11">
                            {digit}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
