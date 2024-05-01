import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children, user, redirectPath = "/signup-login" }) => {

    if (!user) return <Navigate to={redirectPath} />

    return children ? children : <Outlet />;
}

export default ProtectedRoute