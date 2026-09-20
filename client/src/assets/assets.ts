import { TruckIcon, LeafIcon, ClockIcon, ShieldCheckIcon, MapPinIcon, PhoneIcon, MailIcon } from "lucide-react";
import { SiFacebook, SiX, SiInstagram } from "@icons-pack/react-simple-icons";
import hero_bg from "./hero_bg.jpeg";
import delivery_truck from "./delivery_truck.svg";
import fruits_vegetables from "./fruits_vegetables.png";
import dairy_eggs from "./dairy_eggs.png";
import bakery from "./bakery.png";
import drinks from "./drinks.png";
import pantry_staples from "./pantry_staples.png";
import snacks from "./snacks.png";
import frozen_foods from "./frozen_foods.png";
import personal_care from "./personal_care.png";
import baby_care from "./baby_care.png";
import meat_seafood from "./meat_seafood.png";

export const assets = {
    delivery_truck,
    hero_bg,
};

export const categoriesData = [
    { slug: "fruits-vegetables", name: "Fruits & Vegetables", image: fruits_vegetables, tint: "#e9f5e1" },
    { slug: "dairy-eggs", name: "Dairy & Eggs", image: dairy_eggs, tint: "#e3eefb" },
    { slug: "bakery", name: "Bakery", image: bakery, tint: "#fde9d9" },
    { slug: "beverages", name: "Beverages", image: drinks, tint: "#fff5d1" },
    { slug: "pantry-staples", name: "Pantry Staples", image: pantry_staples, tint: "#fbf0dc" },
    { slug: "snacks", name: "Snacks", image: snacks, tint: "#fde4de" },
    { slug: "meat-seafood", name: "Meat & Seafood", image: meat_seafood, tint: "#e1eff9" },
    { slug: "frozen-foods", name: "Frozen Foods", image: frozen_foods, tint: "#e3f5f7" },
    { slug: "personal-care", name: "Personal Care", image: personal_care, tint: "#f1eafb" },
    { slug: "baby-care", name: "Baby Care", image: baby_care, tint: "#fdeaf2" },
];

export const heroSectionData = {
    description: "Fresh, organic groceries delivered from local farms to your doorstep. Quality you can taste, convenience you deserve.",
    hero_image: hero_bg,
    hero_features: [
        { icon: TruckIcon, title: "Free Delivery", desc: "Orders over ₹500" },
        { icon: LeafIcon, title: "100% Organic", desc: "Certified products" },
        { icon: ClockIcon, title: "Same Day", desc: "Express delivery" },
        { icon: ShieldCheckIcon, title: "Secure Pay", desc: "Safe checkout" },
    ],
};

export const appPromoBannerData = {
    title: "Get fresh groceries in minutes",
    description: "Download the Instacart app for exclusive deals, real-time tracking, and the freshest selection delivered right to your door.",
};

export const footerData = {
    brand: {
        name: "Instacart",
        description: "Bringing fresh, organic groceries straight from local farms to your doorstep. Nourish your home with Earth's finest.",
        socials: [
            { icon: SiFacebook, link: "#", label: "Facebook" },
            { icon: SiX, link: "#", label: "X" },
            { icon: SiInstagram, link: "#", label: "Instagram" },
        ],
    },

    sections: [
        {
            title: "Quick Links",
            links: [
                { label: "All Products", to: "/products" },
                { label: "Flash Deals", to: "/deals" },
                { label: "Track Order", to: "/orders" },
                { label: "Delivery Partner", to: "/delivery" },
            ],
        },
        {
            title: "Customer Service",
            links: [
                { label: "My Orders", to: "/orders" },
                { label: "Saved Addresses", to: "/addresses" },
                { label: "Checkout", to: "/checkout" },
                { label: "Help Center", href: "#" },
            ],
        },
    ],

    contact: [
        { icon: MapPinIcon, text: "123 Green Valley Rd, Portland" },
        { icon: PhoneIcon, text: "+1 (111) 123-4567" },
        { icon: MailIcon, text: "hello@example.com" },
    ],

    bottom: {
        links: [
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
        ],
    },
};
