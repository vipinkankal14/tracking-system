
import { Routes, Route } from "react-router-dom";
  import Sidebar from "./Nav/sidebar/Sidebar";
import TopNavbar from "./Nav/Topnav-bar/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css'
import './Nav/sidebar/Sidebar.scss';
import { useState } from "react";
import AdditionalDetails from "./components/AdditionalDetails";
import PaymentForm from "./PaymentForm";
import CashierApp from "./cashier/CashierApp";
import PaymentDetails from "./cashier/PaymentDetails";
import PaymentSuccessful from "./cashier/PaymentSuccessful";
import Car from "./carStocks/car";
import './App.css'; 


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
  
  return (
    < >
     <div className="main-layout noto-sans">
     <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
     <TopNavbar toggleSidebar={toggleSidebar} />
      <main className="main-content">
        <div className="container-fluid px-0">
          <Routes>
            <Route path="/" element={<PaymentForm />} />
              <Route path="/AdditionalDetails" element={<AdditionalDetails />} />
              <Route path="/CashierApp" element={<CashierApp />} />
              <Route path="/PaymentDetails" element={<PaymentDetails />} />
              <Route path="/PaymentSuccessful" element={<PaymentSuccessful />} />
              <Route path = "/car" element = {<Car/>}/>
          </Routes>
        </div>
      </main>
    </div>

    </>
  );
}

export default App;
