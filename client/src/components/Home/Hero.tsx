import { ArrowRightIcon, CircleCheckIcon, LeafIcon, TruckIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { heroSectionData } from "../../assets/assets";
import { FREE_DELIVERY_THRESHOLD, formatPrice } from "../../lib/format";

const highlights = [`Free delivery over ${formatPrice(FREE_DELIVERY_THRESHOLD)}`, "Live order tracking", "Cash on delivery"];

const Hero = () => {
    return (
        <section className="relative isolate flex min-h-[540px] items-center overflow-hidden rounded-[2rem] bg-app-green text-white lg:min-h-[580px]">
            <img src={heroSectionData.hero_image} alt="Fresh vegetables on a wooden table" className="absolute inset-0 -z-10 size-full object-cover" />
            {/* Solid tint on mobile for legibility; left-to-right fade on desktop so the produce shows through */}
            <div className="absolute inset-0 -z-10 bg-app-green/80 lg:bg-transparent lg:bg-linear-to-r lg:from-app-green lg:via-app-green/75 lg:to-transparent" />

            <div className="w-full px-6 py-14 sm:px-10 lg:px-14 lg:py-16">
                <div className="max-w-xl animate-fade-in">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-orange-200 ring-1 ring-white/15 ring-inset backdrop-blur-sm">
                        <LeafIcon className="size-3.5" /> Farm-fresh & organic
                    </span>

                    <h1 className="mt-5 font-serif text-4xl leading-[1.08] sm:text-5xl lg:text-[3.6rem]">
                        Nourish your home with <span className="text-orange-300 italic">Earth's finest</span>
                    </h1>

                    <p className="mt-5 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">{heroSectionData.description}</p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Shop now <ArrowRightIcon className="size-4" />
                        </Link>
                        <a href="#categories" className="btn btn-lg border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
                            Browse categories
                        </a>
                    </div>

                    <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-white/85">
                        {highlights.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                                <CircleCheckIcon className="size-4 text-emerald-300" /> {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Floating info cards over the photo (desktop) */}
            <div className="absolute top-12 right-12 hidden animate-float items-center gap-3 rounded-2xl bg-white/95 py-2.5 pr-4 pl-2.5 text-app-green shadow-float backdrop-blur lg:flex">
                <span className="flex-center size-10 rounded-xl bg-orange-50">
                    <TruckIcon className="size-5 text-app-orange" />
                </span>
                <span>
                    <span className="block text-sm font-semibold">Same-day delivery</span>
                    <span className="block text-xs text-app-text-light">Right to your door</span>
                </span>
            </div>
            <div className="absolute right-28 bottom-12 hidden animate-float items-center gap-3 rounded-2xl bg-white/95 py-2.5 pr-4 pl-2.5 text-app-green shadow-float backdrop-blur [animation-delay:-3s] lg:flex">
                <span className="flex-center size-10 rounded-xl bg-emerald-50">
                    <LeafIcon className="size-5 text-emerald-600" />
                </span>
                <span>
                    <span className="block text-sm font-semibold">100% organic</span>
                    <span className="block text-xs text-app-text-light">Certified products</span>
                </span>
            </div>
        </section>
    );
};

export default Hero;
