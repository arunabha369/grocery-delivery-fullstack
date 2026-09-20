import AppPromoBanner from "../components/Home/AppPromoBanner";
import Features from "../components/Home/Features";
import Hero from "../components/Home/Hero";
import HomeCategories from "../components/Home/HomeCategories";
import HowItWorks from "../components/Home/HowItWorks";
import Newsletter from "../components/Home/Newsletter";
import PopularProducts from "../components/Home/PopularProducts";
import PromoCards from "../components/Home/PromoCards";

const Home = () => {
    return (
        <div className="mx-auto max-w-7xl px-4 pt-4 pb-20 sm:px-6 sm:pt-6 lg:px-8">
            <Hero />
            <Features />
            <HomeCategories />
            <PopularProducts />
            <PromoCards />
            <HowItWorks />
            <AppPromoBanner />
            <Newsletter />
        </div>
    );
};

export default Home;
