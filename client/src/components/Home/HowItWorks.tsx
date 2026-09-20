import { CreditCardIcon, MapPinnedIcon, ShoppingBasketIcon } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";

const steps = [
    { icon: ShoppingBasketIcon, title: "Pick your groceries", text: "Browse fresh produce, dairy, bakery and more across ten categories." },
    { icon: CreditCardIcon, title: "Check out securely", text: "Pay by card through Stripe, or choose cash on delivery." },
    { icon: MapPinnedIcon, title: "Track it to your door", text: "Follow your rider live on the map and share your OTP on arrival." },
];

const HowItWorks = () => {
    return (
        <section aria-labelledby="how-title" className="pt-16 sm:pt-20">
            <SectionHeader id="how-title" eyebrow="How it works" title="Groceries in three easy steps" />
            <ol className="grid gap-4 md:grid-cols-3 lg:gap-6">
                {steps.map((step, i) => (
                    <li key={step.title} className="card relative overflow-hidden p-6 sm:p-7">
                        <span className="absolute -top-3 right-3 font-serif text-[5.5rem] leading-none text-app-cream-dark select-none" aria-hidden="true">
                            {i + 1}
                        </span>
                        <div className="flex-center relative size-12 rounded-2xl bg-app-green text-white">
                            <step.icon className="size-5" />
                        </div>
                        <h3 className="relative mt-5 text-lg font-semibold text-app-green">{step.title}</h3>
                        <p className="relative mt-1.5 text-sm leading-relaxed text-app-text-light">{step.text}</p>
                    </li>
                ))}
            </ol>
        </section>
    );
};

export default HowItWorks;
