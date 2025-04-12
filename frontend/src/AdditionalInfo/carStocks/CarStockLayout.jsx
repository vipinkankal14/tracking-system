import { Outlet } from "react-router-dom";
import CarAppNavbar from "../../Components/UserNavbar/CarAppNavbar";
  

 
function CarStockLayout() {
  return (
      <div>
       <CarAppNavbar />
       <Outlet />
    </div>
  );
}

export default CarStockLayout;  

 