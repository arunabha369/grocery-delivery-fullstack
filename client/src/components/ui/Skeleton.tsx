export function ProductCardSkeleton() {
    return (
        <div className="card flex flex-col p-2" aria-hidden="true">
            <div className="skeleton aspect-square rounded-xl" />
            <div className="space-y-2 px-1.5 pt-3 pb-1.5">
                <div className="skeleton h-3 w-1/4" />
                <div className="skeleton h-4 w-4/5" />
                <div className="skeleton h-3 w-1/3" />
                <div className="flex items-center justify-between pt-3">
                    <div className="skeleton h-5 w-14" />
                    <div className="skeleton h-9 w-[5.75rem] rounded-full" />
                </div>
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 8, className = "" }: { count?: number; className?: string }) {
    return (
        <div className={className} role="status" aria-label="Loading products">
            {Array.from({ length: count }, (_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function ListSkeleton({ rows = 3, className = "h-32" }: { rows?: number; className?: string }) {
    return (
        <div className="space-y-4" role="status" aria-label="Loading">
            {Array.from({ length: rows }, (_, i) => (
                <div key={i} className={`skeleton rounded-2xl ${className}`} />
            ))}
        </div>
    );
}
