import toast from "react-hot-toast";
import { BikeIcon } from "lucide-react";
import { SiApple, SiGoogleplay } from "@icons-pack/react-simple-icons";
import { appPromoBannerData, assets } from "../../assets/assets";

const stores = [
    { icon: SiApple, kicker: "Download on the", name: "App Store" },
    { icon: SiGoogleplay, kicker: "Get it on", name: "Google Play" },
];

const AppPromoBanner = () => {
    return (
        <section aria-labelledby="app-title" className="relative mt-16 overflow-hidden rounded-[2rem] bg-app-green px-6 py-12 sm:mt-20 sm:px-12 lg:px-16 lg:py-0">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(111,178,106,0.2),transparent_45%)]" />
            <div className="pointer-events-none absolute -bottom-24 left-1/2 size-96 rounded-full border border-white/10 lg:left-[70%]" />
            <div className="pointer-events-none absolute -bottom-40 left-1/2 size-[36rem] -translate-x-1/4 rounded-full border border-white/5 lg:left-[60%]" />

            <div className="relative grid items-center gap-10 lg:grid-cols-2">
                <div className="text-center lg:py-20 lg:text-left">
                    <p className="eyebrow text-orange-300">Instacart app</p>
                    <h2 id="app-title" className="mt-3 font-serif text-3xl text-white sm:text-4xl lg:text-5xl">
                        {appPromoBannerData.title}
                    </h2>
                    <p className="mx-auto mt-4 max-w-md text-white/70 lg:mx-0">{appPromoBannerData.description}</p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                        {stores.map((store) => (
                            <button key={store.name} type="button" onClick={() => toast("Our mobile app is coming soon!", { icon: "📱" })} className="flex items-center gap-3 rounded-xl bg-white px-4 py-2.5 text-left text-app-green hover:bg-orange-50 active:scale-[0.98]">
                                <store.icon className="size-6" />
                                <span className="leading-tight">
                                    <span className="block text-[10px] text-app-text-light">{store.kicker}</span>
                                    <span className="block text-sm font-semibold">{store.name}</span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-lg pt-16 lg:py-16">
                    <img src={assets.delivery_truck} alt="Delivery truck" className="h-auto w-full" />
                    <div className="absolute top-0 left-0 flex animate-float items-center gap-3 rounded-2xl bg-white py-2.5 pr-4 pl-2.5 shadow-float lg:top-8">
                        <span className="flex-center size-10 rounded-xl bg-orange-50">
                            <BikeIcon className="size-5 text-app-orange" />
                        </span>
                        <span>
                            <span className="block text-sm font-semibold text-app-green">Your order is on the way</span>
                            <span className="block text-xs text-app-text-light">Track your rider live</span>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppPromoBanner;
