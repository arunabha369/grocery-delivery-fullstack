import { useState, type SubmitEvent } from "react";
import toast from "react-hot-toast";
import { EnvelopeArt } from "../illustrations";

const Newsletter = () => {
    const [email, setEmail] = useState("");

    // No newsletter endpoint exists yet — this only confirms on the client
    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        toast.success("Thanks for subscribing!");
        setEmail("");
    };

    return (
        <section aria-labelledby="newsletter-title" className="card mt-16 overflow-hidden sm:mt-20">
            <div className="grid items-center gap-8 p-8 sm:p-12 md:grid-cols-[auto_1fr] lg:gap-16 lg:px-16">
                <EnvelopeArt className="mx-auto h-auto w-44 sm:w-52 lg:w-60" />
                <div className="text-center md:text-left">
                    <p className="eyebrow">Newsletter</p>
                    <h2 id="newsletter-title" className="section-title mt-2">
                        Fresh deals, straight to your inbox
                    </h2>
                    <p className="mt-2 text-app-text-light">Weekly updates on seasonal produce, new arrivals and exclusive discounts.</p>
                    <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-lg flex-col gap-3 sm:flex-row md:mx-0">
                        <label htmlFor="newsletter-email" className="sr-only">
                            Email address
                        </label>
                        <input id="newsletter-email" type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="field h-12 flex-1" />
                        <button type="submit" className="btn btn-dark h-12 px-7">
                            Subscribe
                        </button>
                    </form>
                    <p className="mt-3 text-xs text-app-text-light">No spam, ever. Unsubscribe any time.</p>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
