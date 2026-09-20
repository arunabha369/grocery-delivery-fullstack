import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";

interface QuantityStepperProps {
    quantity: number;
    onChange: (quantity: number) => void;
    max?: number;
    min?: number;
    label: string;
    variant?: "solid" | "outline";
    size?: "sm" | "md" | "lg";
    /** Show a trash icon instead of minus when quantity is 1 */
    trashAtOne?: boolean;
}

const sizes = {
    sm: { wrap: "h-9 w-[5.75rem]", btn: "w-8", icon: "size-3.5" },
    md: { wrap: "h-8 w-[5.5rem]", btn: "w-7", icon: "size-3.5" },
    lg: { wrap: "h-12 w-36", btn: "w-12", icon: "size-4" },
};

export default function QuantityStepper({ quantity, onChange, max = Infinity, min = 0, label, variant = "solid", size = "sm", trashAtOne = false }: QuantityStepperProps) {
    const s = sizes[size];
    const atMax = quantity >= max;
    const atMin = quantity <= min;
    const showTrash = trashAtOne && quantity <= 1;
    const tone = variant === "solid" ? "bg-app-orange text-white shadow-sm shadow-orange-600/20" : "border border-app-border bg-white text-app-green";
    const btnTone = variant === "solid" ? "hover:bg-black/10" : "hover:bg-app-cream";

    return (
        <div className={`inline-flex shrink-0 items-center justify-between overflow-hidden rounded-full ${s.wrap} ${tone}`}>
            <button type="button" onClick={() => onChange(quantity - 1)} disabled={atMin} aria-label={showTrash ? `Remove ${label} from cart` : `Decrease quantity of ${label}`} className={`flex-center h-full ${s.btn} ${btnTone} disabled:opacity-40 ${showTrash && variant === "outline" ? "hover:text-app-error" : ""}`}>
                {showTrash ? <Trash2Icon className={s.icon} /> : <MinusIcon className={s.icon} />}
            </button>
            <span className="min-w-6 text-center text-sm font-semibold tabular-nums" aria-live="polite">
                {quantity}
                <span className="sr-only"> in cart</span>
            </span>
            <button type="button" onClick={() => onChange(quantity + 1)} disabled={atMax} aria-label={`Increase quantity of ${label}`} title={atMax ? "No more stock available" : undefined} className={`flex-center h-full ${s.btn} ${btnTone} disabled:opacity-40`}>
                <PlusIcon className={s.icon} />
            </button>
        </div>
    );
}
