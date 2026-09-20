import { getStatusStyle } from "../../lib/status";

export default function StatusBadge({ status, className = "" }: { status: string; className?: string }) {
    const style = getStatusStyle(status);
    return (
        <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${style.badge} ${className}`}>
            <span className={`size-1.5 rounded-full ${style.dot}`} />
            {status}
        </span>
    );
}
