import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from "../provider/AuthProvider";
 
const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user, isAuthenticated } = useAuth();

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
