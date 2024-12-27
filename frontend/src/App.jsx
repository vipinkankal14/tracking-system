
import { Routes, Route } from "react-router-dom";
  import Sidebar from "./Nav/Customer/Sidebar";
import TopNavbar from "./Nav/Topnav-bar/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css'
import './Nav/Customer/Sidebar.scss';
import { useState } from "react";
import AdditionalDetails from "./components/AdditionalDetails";
import PaymentForm from "./PaymentForm";
import CashierApp from "./cashier/CashierApp";
import PaymentDetails from "./cashier/PaymentDetails";
import PaymentSuccessful from "./cashier/PaymentSuccessful";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
  
  return (
    < >
     <div className="main-layout">
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
            
          </Routes>
        </div>
      </main>
    </div>

    </>
  );
}

export default App;
