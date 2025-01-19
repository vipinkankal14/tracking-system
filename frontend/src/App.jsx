import { Routes, Route } from "react-router-dom";
import Sidebar from "./Nav/sidebar/Sidebar";
import TopNavbar from "./Nav/Topnav-bar/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Nav/sidebar/Sidebar.scss';
import { useState, Suspense, lazy } from "react";
import './App.css'; 
import { Home } from "lucide-react";
import CustomerPaymentDetails from "./cashier/CustomerPaymentDetails/CustomerPaymentDetails";
import PaymentHistory from "./cashier/CustomerPaymentDetails/PaymentHistory";
import AddCarStock from "./carStocks/AddCarStock";
import CarAllotmentByCustomer from "./carStocks/CarAllotmentByCustomer";
import CarStockShow from "./carStocks/CarStockShow";
import { OrderEditAndCancel } from "./cashier/CarBooking/OrderEditAndCancel";
import { OrderEditAndConfirmed } from "./cashier/CarBookingCancel/OrderEditAndConfirmed";
  
// Lazy loaded components
const AdditionalDetails = lazy(() => import("./components/AdditionalDetails"));
const DiscountMain = lazy(() => import("./discount/DiscountMain"));
const CarBookings = lazy(() => import("./cashier/CarBooking/CarBookings"));
const PaymentClear = lazy(() => import("./cashier/PaymentClear"));
const CarBookingCancel = lazy(() => import("./cashier/CarBookingCancel/CarBookingCancel"));
const Payment = lazy(() => import("./cashier/Payment"));
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
        <main className="main-content" style={{ overflow: 'hidden' }}>
          <div className="container-fluid px-0">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/additional-details" element={<AdditionalDetails />} />
                <Route path="/success-page" element={<SuccessPage />} />
                <Route path="/payment-successful" element={<PaymentSuccessful />} />
                <Route path="/car" element={<Car />} />
                <Route path="/car-allotment/:vin" element={<CarAllotment />} />
                <Route path="/discount-main" element={<DiscountMain />} />
                <Route path="/cashier-app" element={<CashierApp />} /> 
                <Route path="/payment-details" element={<PaymentDetails />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payment-clear" element={<PaymentClear />} />
                <Route path="/car-Booking" element={<CarBookings/>} />
                <Route path="/car-booking-cancel" element={<CarBookingCancel />} />
                <Route path="/customer-payment-details" element={<CustomerPaymentDetails />} />
                <Route path="/payment-history/:customerId" element={<PaymentHistory />} />
                <Route path="/car-stock-show" element={<CarStockShow />} />
                <Route path="/car-allotment-by-customer" element={<CarAllotmentByCustomer />} />
                <Route path="/Add-Car-Stock" element={<AddCarStock />} />
                <Route path="/order-cancel/:customerId" element={<OrderEditAndCancel />} />
                <Route path="/order-edit-and-confirmed/:customerId" element={<OrderEditAndConfirmed />} />
               </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;