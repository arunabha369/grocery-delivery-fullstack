import { LeafIcon, TruckIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { FREE_DELIVERY_THRESHOLD, formatPrice } from "../lib/format";

const Banner = () => {
    const [bannerVisible, setBannerVisible] = useState(() => {
        return sessionStorage.getItem("banner_dismissed") !== "true";
    });

    const dismissBanner = () => {
        setBannerVisible(false);
        sessionStorage.setItem("banner_dismissed", "true");
    };

    if (!bannerVisible) return null;

    return (
        <div className="relative bg-app-green text-xs text-white/90 sm:text-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-10 py-2">
                <p className="flex items-center gap-2">
                    <TruckIcon className="size-4 shrink-0 text-app-orange" />
                    <span>
                        Free delivery on orders above <strong className="font-semibold text-white">{formatPrice(FREE_DELIVERY_THRESHOLD)}</strong>
                    </span>
                </p>
                <span className="hidden h-3.5 w-px bg-white/20 sm:block" />
                <p className="hidden items-center gap-2 sm:flex">
                    <LeafIcon className="size-3.5 shrink-0 text-emerald-300" />
                    Farm-fresh produce delivered daily
                </p>
            </div>

            <button type="button" onClick={dismissBanner} aria-label="Dismiss announcement" className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
                <XIcon className="size-3.5" />
            </button>
        </div>
    );
};

export default Banner;
