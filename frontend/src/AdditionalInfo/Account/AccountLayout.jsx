import { Outlet } from "react-router-dom";
import LogoutPage from "../../pages/LogoutPage";
  

 
function AccountLayout() {
  return (
      <div>
       <LogoutPage />
       <Outlet />
    </div>
  );
}

export default AccountLayout;  

 