// src/AuthRoute.jsx
import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const AuthRoute = ({ allowedRoles }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = localStorage.getItem("authToken");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    // Check if token exists and isn't expired
    const isTokenValid = token && tokenExpiry && Date.now() < parseInt(tokenExpiry);

    if (!isTokenValid || !userData) {
      // Clear invalid auth data and redirect to login
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("tokenExpiry");
      navigate("/login", { state: { from: location }, replace: true });
      return;
    }

    if (allowedRoles && !allowedRoles.includes(userData.role)) {
      // Redirect to user's default route if role doesn't match
      navigate(userData.navigate || "/", { replace: true });
    }
  }, [navigate, allowedRoles, location]);

  // Only render children if all checks pass
  return <Outlet />;
};

export default AuthRoute;