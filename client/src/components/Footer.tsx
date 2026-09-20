import { Link } from "react-router-dom";
import { BanknoteIcon } from "lucide-react";
import { SiMastercard, SiStripe, SiVisa } from "@icons-pack/react-simple-icons";
import { footerData } from "../assets/assets";
import Logo from "./Logo";

const Footer = () => {
    return (
        <footer className="bg-app-green text-white">
            <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:gap-12">
                    {/* Brand */}
                    <div>
                        <Logo tone="light" />
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">{footerData.brand.description}</p>
                        <div className="mt-6 flex gap-2.5">
                            {footerData.brand.socials.map((social) => (
                                <a key={social.label} href={social.link} aria-label={social.label} className="flex-center size-10 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 hover:text-white">
                                    <social.icon className="size-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link sections */}
                    {footerData.sections.map((section) => (
                        <nav key={section.title} aria-label={section.title}>
                            <h3 className="text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">{section.title}</h3>
                            <ul className="mt-5 space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        {link.to ? (
                                            <Link to={link.to} className="rounded text-sm text-white/75 hover:text-white">
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <a href={link.href} className="rounded text-sm text-white/75 hover:text-white">
                                                {link.label}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}

                    {/* Contact */}
                    <div>
                        <h3 className="text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">Contact us</h3>
                        <ul className="mt-5 space-y-3.5">
                            {footerData.contact.map((item) => (
                                <li key={item.text} className="flex items-start gap-3 text-sm text-white/75">
                                    <item.icon className="mt-0.5 size-4 shrink-0 text-app-orange" /> {item.text}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-7 text-xs font-medium text-white/50">We accept</p>
                        <div className="mt-2.5 flex flex-wrap gap-2" aria-label="Accepted payment methods">
                            {[
                                { icon: SiVisa, label: "Visa" },
                                { icon: SiMastercard, label: "Mastercard" },
                                { icon: SiStripe, label: "Stripe" },
                            ].map(({ icon: Icon, label }) => (
                                <span key={label} title={label} className="flex-center h-8 w-12 rounded-md bg-white/10">
                                    <Icon className="size-5 text-white/85" aria-label={label} />
                                </span>
                            ))}
                            <span title="Cash on delivery" className="flex-center h-8 gap-1 rounded-md bg-white/10 px-2 text-[11px] font-semibold text-white/85">
                                <BanknoteIcon className="size-4" /> COD
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
                    <p className="text-xs text-white/50">
                        © {new Date().getFullYear()} {footerData.brand.name}. All rights reserved.
                    </p>
                    <div className="flex gap-5">
                        {footerData.bottom.links.map((link) => (
                            <a key={link.label} href={link.href} className="rounded text-xs text-white/50 hover:text-white/80">
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
