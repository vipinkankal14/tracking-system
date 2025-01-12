import { Routes, Route } from "react-router-dom";
import Sidebar from "./Nav/sidebar/Sidebar";
import TopNavbar from "./Nav/Topnav-bar/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Nav/sidebar/Sidebar.scss';
import { useState, Suspense, lazy } from "react";
import './App.css'; 
 

// Lazy loaded components
const AdditionalDetails = lazy(() => import("./components/AdditionalDetails"));
const DiscountMain = lazy(() => import("./discount/DiscountMain"));
const PaymentForm = lazy(() => import("./PaymentForm"));
const CashierApp = lazy(() => import("./cashier/CashierApp"));
const PaymentDetails = lazy(() => import("./cashier/PaymentDetails"));
const PaymentSuccessful = lazy(() => import("./cashier/PaymentSuccessful"));
const Car = lazy(() => import("./carStocks/Car"));
const CarAllotment = lazy(() => import("./carStocks/CarAllotment"));
const SuccessPage = lazy(() => import("./components/SuccessPage"));

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div className="main-layout noto-sans">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <TopNavbar toggleSidebar={toggleSidebar} />
        <main className="main-content">
          <div className="container-fluid px-0">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<PaymentForm />} />
                <Route path="/AdditionalDetails" element={<AdditionalDetails />} />
                <Route path="/SuccessPage" element={<SuccessPage />} />
                <Route path="/CashierApp" element={<CashierApp />} />
                <Route path="/PaymentDetails" element={<PaymentDetails />} />
                <Route path="/PaymentSuccessful" element={<PaymentSuccessful />} />
                <Route path="/car" element={<Car />} />
                <Route path="/car-allotment/:vin" element={<CarAllotment />} />
                <Route path="/DiscountMain" element={<DiscountMain />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
