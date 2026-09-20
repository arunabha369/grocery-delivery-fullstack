import { Link } from "react-router-dom";
import { categoriesData } from "../../assets/assets";
import SectionHeader from "../ui/SectionHeader";

const HomeCategories = () => {
    return (
        <section id="categories" aria-labelledby="categories-title" className="scroll-mt-28 pt-16 sm:pt-20">
            <SectionHeader id="categories-title" eyebrow="Categories" title="Shop by category" description="Everything you need, neatly organised." linkTo="/products" linkLabel="All products" />

            <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-5 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-10">
                {categoriesData.map((cat) => (
                    <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="group flex w-24 shrink-0 snap-start flex-col items-center gap-2.5 rounded-2xl sm:w-auto">
                        <span className="flex-center aspect-square w-full overflow-hidden rounded-2xl p-2.5 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-card-hover" style={{ backgroundColor: cat.tint }}>
                            <img src={cat.image} alt="" loading="lazy" className="size-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105" />
                        </span>
                        <span className="text-center text-xs leading-tight font-medium text-zinc-700 group-hover:text-app-green sm:text-[13px]">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default HomeCategories;
