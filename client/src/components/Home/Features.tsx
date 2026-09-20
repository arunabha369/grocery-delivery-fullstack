import { heroSectionData } from "../../assets/assets";

const tones = ["bg-orange-50 text-app-orange", "bg-emerald-50 text-emerald-600", "bg-amber-50 text-amber-600", "bg-sky-50 text-sky-600"];

const Features = () => {
    return (
        <section aria-label="Why shop with us" className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3 lg:grid-cols-4 lg:gap-4">
            {heroSectionData.hero_features.map((feature, i) => (
                <div key={feature.title} className="card flex items-center gap-2.5 p-3 sm:gap-4 sm:p-5">
                    <div className={`flex-center size-9 shrink-0 rounded-xl sm:size-11 ${tones[i % tones.length]}`}>
                        <feature.icon className="size-4 sm:size-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-app-green">{feature.title}</p>
                        <p className="text-xs text-app-text-light">{feature.desc}</p>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default Features;
