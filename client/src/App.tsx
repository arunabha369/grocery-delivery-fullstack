import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductPage from "./pages/ProductPage";
import SearchResults from "./pages/SearchResults";
import FlashDeals from "./pages/FlashDeals";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import Loading from "./components/Loading";

// Account, admin and delivery screens are split out of the main bundle
const Checkout = lazy(() => import("./pages/Checkout"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const Addresses = lazy(() => import("./pages/Addresses"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminProductForm = lazy(() => import("./pages/admin/AdminProductForm"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminDeliveryPartners = lazy(() => import("./pages/admin/AdminDeliveryPartners"));
const DeliveryLogin = lazy(() => import("./pages/delivery/DeliveryLogin"));
const DeliveryLayout = lazy(() => import("./pages/delivery/DeliveryLayout"));
const DeliveryDashboard = lazy(() => import("./pages/delivery/DeliveryDashboard"));

const App = () => {
    return (
        <>
            <ScrollToTop />
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: { background: "#1B3022", color: "#fff", borderRadius: "14px", fontSize: "14px", padding: "10px 14px", boxShadow: "0 14px 36px -10px rgb(27 48 34 / 0.45)" },
                    success: { iconTheme: { primary: "#6fb26a", secondary: "#1B3022" } },
                    error: { iconTheme: { primary: "#f97316", secondary: "#1B3022" } },
                }}
            />

            <Suspense fallback={<Loading fullScreen />}>
                <Routes>
                    {/* Auth pages - No Navbar/Footer */}
                    <Route path="/login" element={<Login />} />
                    {/* Main pages - With Navbar/Footer */}
                    <Route path="/" element={<AppLayout />}>
                        <Route index element={<Home />} />
                        <Route path="products" element={<Products />} />
                        <Route path="products/:id" element={<ProductPage />} />
                        <Route path="search" element={<SearchResults />} />
                        <Route path="deals" element={<FlashDeals />} />
                        <Route element={<ProtectedRoute />}>
                            <Route path="checkout" element={<Checkout />} />
                            <Route path="orders" element={<MyOrders />} />
                            <Route path="orders/:id" element={<OrderTracking />} />
                            <Route path="addresses" element={<Addresses />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Route>
                    {/* Admin pages */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="products/new" element={<AdminProductForm />} />
                        <Route path="products/:id/edit" element={<AdminProductForm />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="delivery-partners" element={<AdminDeliveryPartners />} />
                    </Route>

                    {/* Delivery Partner pages */}
                    <Route path="/delivery/login" element={<DeliveryLogin />} />
                    <Route path="/delivery" element={<DeliveryLayout />}>
                        <Route index element={<DeliveryDashboard />} />
                    </Route>
                </Routes>
            </Suspense>
        </>
    );
};

export default App;
