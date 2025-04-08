import { Outlet } from "react-router-dom";
import LogoutPage from "../../pages/LogoutPage";
  

 
function AccessorieLayout() {
  return (
      <div>
       <LogoutPage />
       <Outlet />
    </div>
  );
}

export default AccessorieLayout;  

 