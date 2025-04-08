// src/AuthRoute.jsx
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

const AuthRoute = ({ allowedRoles }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    
    if (!userData) {
      // No user logged in, redirect to login
      navigate("/login");
    } else if (allowedRoles && !allowedRoles.includes(userData.role)) {
      // User doesn't have required role, redirect to their dashboard
      navigate(`/${userData.navigate}`);
    }
  }, [navigate, allowedRoles]);

  return <Outlet />;
};

export default AuthRoute;