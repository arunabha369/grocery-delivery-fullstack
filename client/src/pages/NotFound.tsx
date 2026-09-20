import { Link } from "react-router-dom";
import { ArrowLeftIcon, StoreIcon } from "lucide-react";
import { NotFoundArt } from "../components/illustrations";

const NotFound = () => {
    return (
        <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center sm:py-24">
            <NotFoundArt className="h-auto w-64 sm:w-80" />
            <p className="eyebrow mt-6">Error 404</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-app-green sm:text-4xl">This aisle doesn't exist</h1>
            <p className="mt-3 max-w-md text-app-text-light">The page you're looking for may have moved or never existed. Let's get you back to the fresh stuff.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/" className="btn btn-outline">
                    <ArrowLeftIcon className="size-4" /> Back to home
                </Link>
                <Link to="/products" className="btn btn-primary">
                    <StoreIcon className="size-4" /> Browse products
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
