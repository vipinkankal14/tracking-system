import { Outlet } from "react-router-dom";
import LogoutPage from "../../pages/LogoutPage";
  

 
function FastTagLayout() {
  return (
      <div>
       <LogoutPage />
       <Outlet />
    </div>
  );
}

export default FastTagLayout;  

 