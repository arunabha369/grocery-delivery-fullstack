import { useMemo } from "react";
import type { Product } from "../types";
import { StarIcon, ThumbsUpIcon } from "lucide-react";

/* ─── Dummy Reviews Section ─── */
const REVIEWERS = [
    { name: "Ananya S.", avatar: "AS" },
    { name: "Rahul M.", avatar: "RM" },
    { name: "Priya K.", avatar: "PK" },
    { name: "Vikram J.", avatar: "VJ" },
    { name: "Meera D.", avatar: "MD" },
    { name: "Arjun R.", avatar: "AR" },
    { name: "Sneha T.", avatar: "ST" },
    { name: "Karan P.", avatar: "KP" },
];

const COMMENTS = [
    "Absolutely love this product! Fresh and great quality. Will definitely order again.",
    "Good value for the price. Packaging was neat and delivery was on time.",
    "Quality is decent but I expected it to be a bit fresher. Still a solid buy overall.",
    "This has become a staple in my kitchen now. Highly recommended for everyone!",
    "Exceeded my expectations. The taste and freshness were top-notch. Five stars!",
    "Pretty good! Not the absolute best I've had, but definitely worth the price.",
    "Arrived in perfect condition. Very satisfied with the purchase, ordering more soon.",
    "Great product, my family loved it. The organic quality really shows in the taste.",
];

function seededRandom(seed: string) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
    return () => {
        h = (h ^ (h >>> 16)) * 0x45d9f3b;
        h = (h ^ (h >>> 16)) * 0x45d9f3b;
        h ^= h >>> 16;
        return (h >>> 0) / 0xffffffff;
    };
}

export default function DummyReviewsSection({ product }: { product: Product }) {
    const reviews = useMemo(() => {
        const rng = seededRandom(product.id);
        const count = Math.min(product.reviewCount, 6);
        const daysAgo = [3, 7, 14, 21, 35, 48];
        return Array.from({ length: count }, (_, i) => {
            const r = REVIEWERS[(Math.floor(rng() * REVIEWERS.length) + i) % REVIEWERS.length];
            const rating = Math.max(3, Math.min(5, Math.round(product.rating + (rng() - 0.5) * 2)));
            const d = new Date();
            d.setDate(d.getDate() - daysAgo[i % daysAgo.length]);
            return {
                id: i,
                ...r,
                rating,
                date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
                comment: COMMENTS[(Math.floor(rng() * COMMENTS.length) + i) % COMMENTS.length],
                helpful: Math.floor(rng() * 20) + 1,
            };
        });
    }, [product]);

    // Rating breakdown
    const breakdown = useMemo(() => {
        const counts = [0, 0, 0, 0, 0];
        reviews.forEach((r) => counts[r.rating - 1]++);
        return counts.reverse(); // 5→1
    }, [reviews]);

    const maxCount = Math.max(...breakdown, 1);

    return (
        <section id="reviews" aria-labelledby="reviews-title" className="mt-16 scroll-mt-28 sm:mt-20">
            <p className="eyebrow mb-2">Reviews</p>
            <h2 id="reviews-title" className="section-title mb-6 sm:mb-8">
                What customers say
            </h2>

            <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:gap-8">
                {/* Summary */}
                <div className="card h-fit p-6 lg:sticky lg:top-28">
                    <div className="flex items-end gap-3">
                        <span className="text-5xl font-semibold tracking-tight text-app-green">{product.rating.toFixed(1)}</span>
                        <span className="mb-1.5 text-sm text-app-text-light">out of 5</span>
                    </div>
                    <div className="mt-2 flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <StarIcon key={s} className={`size-4 ${s <= Math.round(product.rating) ? "fill-app-warning text-app-warning" : "fill-app-border text-app-border"}`} />
                        ))}
                    </div>
                    <p className="mt-1 text-sm text-app-text-light">Based on {product.reviewCount} reviews</p>

                    <div className="mt-6 space-y-2.5">
                        {breakdown.map((count, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm">
                                <span className="flex w-7 items-center gap-0.5 text-zinc-600">
                                    {5 - i} <StarIcon className="size-3 fill-zinc-400 text-zinc-400" />
                                </span>
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-app-cream-dark">
                                    <div className="h-full rounded-full bg-app-warning transition-all duration-500" style={{ width: `${(count / maxCount) * 100}%` }} />
                                </div>
                                <span className="w-5 text-right text-xs text-zinc-500">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Individual reviews */}
                <ul className="grid gap-4 sm:grid-cols-2">
                    {reviews.map((review) => (
                        <li key={review.id} className="card flex flex-col p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex-center size-10 shrink-0 rounded-full bg-app-green/10 text-sm font-semibold text-app-green">{review.avatar}</div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-app-text">{review.name}</p>
                                    <p className="text-xs text-zinc-500">{review.date}</p>
                                </div>
                                <div className="ml-auto flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <StarIcon key={s} className={`size-3.5 ${s <= review.rating ? "fill-app-warning text-app-warning" : "fill-app-border text-app-border"}`} />
                                    ))}
                                </div>
                            </div>
                            <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600">{review.comment}</p>
                            <button type="button" className="mt-4 flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 -ml-2 text-xs text-zinc-500 hover:bg-app-cream hover:text-app-green">
                                <ThumbsUpIcon className="size-3.5" /> Helpful ({review.helpful})
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
