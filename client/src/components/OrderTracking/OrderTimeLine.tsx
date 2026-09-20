import { CheckIcon, ClipboardCheckIcon, ClockIcon, HomeIcon, PackageIcon, TruckIcon, UserRoundCheckIcon, XIcon, type LucideIcon } from "lucide-react";
import type { Order } from "../../types";
import { formatDateTime } from "../../lib/format";

const STEPS: { status: string; icon: LucideIcon; text: string }[] = [
    { status: "Placed", icon: ClockIcon, text: "We've received your order" },
    { status: "Confirmed", icon: ClipboardCheckIcon, text: "Your order has been confirmed" },
    { status: "Assigned", icon: UserRoundCheckIcon, text: "A delivery partner has been assigned" },
    { status: "Packed", icon: PackageIcon, text: "Your items are packed and ready" },
    { status: "Out for Delivery", icon: TruckIcon, text: "Your order is on its way" },
    { status: "Delivered", icon: HomeIcon, text: "Delivered to your doorstep" },
];

export default function OrderTimeLine({ order }: { order: Order }) {
    const cancelled = order.status === "Cancelled";
    const timestampFor = (status: string) => order.statusHistory.find((h) => h.status === status)?.timestamp;

    // A cancelled order shows what actually happened, ending in the cancellation
    const steps = cancelled
        ? [...STEPS.filter((s) => timestampFor(s.status)), { status: "Cancelled", icon: XIcon, text: order.statusHistory.find((h) => h.status === "Cancelled")?.note || "This order was cancelled" }]
        : STEPS;
    const currentIdx = cancelled ? steps.length - 1 : steps.findIndex((s) => s.status === order.status);

    return (
        <section className="card p-5 sm:p-6" aria-labelledby="timeline-title">
            <h2 id="timeline-title" className="font-semibold text-app-green">
                Order progress
            </h2>
            <ol className="mt-5">
                {steps.map((step, i) => {
                    const done = i < currentIdx;
                    const current = i === currentIdx;
                    const reached = done || current;
                    const isCancelStep = step.status === "Cancelled";
                    const timestamp = timestampFor(step.status);
                    const Icon = done && !isCancelStep ? CheckIcon : step.icon;

                    return (
                        <li key={step.status} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <span
                                    className={`flex-center size-10 shrink-0 rounded-full transition ${
                                        isCancelStep ? "bg-rose-600 text-white ring-4 ring-rose-100" : current ? "bg-app-orange text-white ring-4 ring-orange-100" : done ? "bg-app-green text-white" : "bg-app-cream text-zinc-400"
                                    }`}
                                >
                                    <Icon className="size-4" strokeWidth={done ? 3 : 2} />
                                </span>
                                {i < steps.length - 1 && <span className={`my-1 w-0.5 flex-1 rounded-full ${done ? "bg-app-green" : "bg-app-border"}`} />}
                            </div>
                            <div className={`min-w-0 ${i < steps.length - 1 ? "pb-6" : ""}`}>
                                <p className={`pt-2 text-sm font-semibold ${isCancelStep ? "text-rose-700" : reached ? "text-app-green" : "text-zinc-400"}`}>{step.status}</p>
                                <p className={`text-xs ${reached ? "text-app-text-light" : "text-zinc-400"}`}>{step.text}</p>
                                {timestamp && reached && <p className="mt-0.5 text-xs font-medium text-zinc-500">{formatDateTime(timestamp)}</p>}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}
