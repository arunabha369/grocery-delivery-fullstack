import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { categoriesData } from "../../assets/assets";
import { NoDealsArt } from "../illustrations";

const promos = [
    {
        eyebrow: "Limited time",
        title: "Flash deals are live",
        text: "Special prices on everyday favourites — while stocks last.",
        cta: "Shop deals",
        to: "/deals",
        art: NoDealsArt,
        image: null,
        artClass: "w-44 sm:w-52 -mr-4",
        className: "bg-orange-50 ring-orange-200/60",
    },
    {
        eyebrow: "Certified organic",
        title: "Go organic this week",
        text: "Certified organic picks, fresh from local farms to your kitchen.",
        cta: "Shop organic",
        to: "/products?organic=true",
        art: null,
        image: categoriesData[0].image,
        artClass: "w-36 sm:w-44 mix-blend-multiply",
        className: "bg-[#e9f5e1] ring-emerald-200/60",
    },
];

const PromoCards = () => {
    return (
        <section aria-label="Promotions" className="grid gap-4 pt-16 sm:pt-20 md:grid-cols-2 lg:gap-6">
            {promos.map((promo) => (
                <Link key={promo.to} to={promo.to} className={`group relative flex items-center justify-between gap-4 overflow-hidden rounded-3xl p-6 ring-1 ring-inset transition hover:shadow-card-hover sm:p-8 ${promo.className}`}>
                    <div className="relative z-10 max-w-[15rem]">
                        <p className="eyebrow">{promo.eyebrow}</p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-app-green sm:text-2xl">{promo.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-app-text-light">{promo.text}</p>
                        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-app-green">
                            {promo.cta} <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                        </span>
                    </div>
                    {promo.art ? (
                        <promo.art className={`h-auto shrink-0 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2 ${promo.artClass}`} />
                    ) : (
                        promo.image && <img src={promo.image} alt="" loading="lazy" className={`h-auto shrink-0 object-contain transition-transform duration-500 group-hover:scale-105 ${promo.artClass}`} />
                    )}
                </Link>
            ))}
        </section>
    );
};

export default PromoCards;
