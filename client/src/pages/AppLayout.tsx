import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartSidebar from "../components/CartSidebar";
import Loading from "../components/Loading";

const AppLayout = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <Banner />
            <Navbar />
            <main className="flex-1">
                <Suspense fallback={<Loading />}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer />
            <CartSidebar />
        </div>
    );
};

export default AppLayout;
