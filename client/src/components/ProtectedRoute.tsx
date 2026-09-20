import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <Loading />;
    // Remember where the user was headed so login can send them back
    if (!user) return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;

    return <Outlet />;
};

export default ProtectedRoute;
