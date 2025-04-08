import { Outlet } from "react-router-dom";
import LogoutPage from "../../pages/LogoutPage";
  

 
function AutoCarLayout() {
  return (
      <div>
       <LogoutPage />
       <Outlet />
    </div>
  );
}

export default AutoCarLayout;  

 