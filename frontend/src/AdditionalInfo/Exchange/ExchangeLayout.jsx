import { Outlet } from "react-router-dom";
import LogoutPage from "../../pages/LogoutPage";
  

 
function ExchangeLayout() {
  return (
      <div>
       <LogoutPage />
       <Outlet />
    </div>
  );
}

export default ExchangeLayout;  

 