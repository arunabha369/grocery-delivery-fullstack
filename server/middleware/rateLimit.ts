import { NextFunction, Request, Response } from "express";

interface Bucket {
    count: number;
    resetAt: number;
}

/**
 * Small in-memory rate limiter for sensitive endpoints (sign-in, sign-up).
 *
 * Note: state lives in the process, so on serverless hosts each instance keeps
 * its own counter. It still blunts password guessing; put a WAF or a shared
 * store (Redis/Upstash) in front if you need a hard guarantee.
 */
export const rateLimit = ({ windowMs = 15 * 60 * 1000, max = 10, message = "Too many attempts. Please try again later." } = {}) => {
    const buckets = new Map<string, Bucket>();

    return (req: Request, res: Response, next: NextFunction) => {
        const now = Date.now();

        // Occasionally drop expired buckets so the map can't grow without bound
        if (buckets.size > 5000) {
            for (const [key, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(key);
        }

        const key = `${req.ip}:${req.path}`;
        const bucket = buckets.get(key);

        if (!bucket || bucket.resetAt <= now) {
            buckets.set(key, { count: 1, resetAt: now + windowMs });
            return next();
        }

        bucket.count += 1;

        if (bucket.count > max) {
            const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
            res.setHeader("Retry-After", String(retryAfter));
            return res.status(429).json({ message });
        }

        next();
    };
};

export default rateLimit;
