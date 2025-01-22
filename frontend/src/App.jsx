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
import AddCarStock from "./carStocks/AddCarForUploadCarEXCEL/AddCarStock";
import CarAllotmentByCustomer from "./carStocks/AllotmentAndNotAllotment/CarAllotmentByCustomer";
import CarStockShow from "./carStocks/CarAllotment/CarStockShow";
import { OrderEditAndCancel } from "./cashier/CarBooking/OrderEditAndCancel";
import { OrderEditAndConfirmed } from "./cashier/CarBookingCancel/OrderEditAndConfirmed";
import FileTracking from "./cashier/CashierMhanaement/FileTracking";
import PaymentPending from "./cashier/Payments/PaymentPending";
import BookingAmount from "./carStocks/discount/BookingAmount";
import CarNotAllotmentByCustomer from "./carStocks/AllotmentAndNotAllotment/CarNotAllotmentByCustomer";
import DiscountForCarAndAdditional from "./carStocks/discount/DiscountForCarAndAdditional";
import UploadCarEXCEL from "./carStocks/AddCarForUploadCarEXCEL/UploadCarEXCEL";
import DiscountApp from "./carStocks/discount/DiscountApp";
import AllotmentStatusApp from "./carStocks/AllotmentStatus/AllotmentStatusApp";
import CarManagement from "./carStocks/CarManagement/CarManagement";
import PaymentApp from "./cashier/PaymentApp";
  
// Lazy loaded components
const AdditionalDetails = lazy(() => import("./CustomerAdd/AdditionalDetails"));
 const CarBookings = lazy(() => import("./cashier/CarBooking/CarBookings"));
const PaymentClear = lazy(() => import("./cashier/Payments/PaymentClear"));
const CarBookingCancel = lazy(() => import("./cashier/CarBookingCancel/CarBookingCancel"));
const Payment = lazy(() => import("./cashier/Payments/Payment"));
const CashierApp = lazy(() => import("./cashier/CashierApp"));
const PaymentDetails = lazy(() => import("./cashier/Payments/PaymentDetails"));
const PaymentSuccessful = lazy(() => import("./cashier/Payments/PaymentSuccessful"));
const Car = lazy(() => import("./carStocks/CarApp"));
const CarAllotment = lazy(() => import("./carStocks/CarAllotment/CarAllotment"));
const SuccessPage = lazy(() => import("./CustomerAdd/SuccessPage"));

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
                <Route path="/file-tracking" element={<FileTracking />} />
                <Route path="/payment-pending" element={<PaymentPending />} />
                <Route path="/booking-amount" element={<BookingAmount />} />
                <Route path="/car-notallotment-ByCustomer" element={<CarNotAllotmentByCustomer />} />  
                <Route path="/discount-for-car-and-additional" element={<DiscountForCarAndAdditional />} />
                <Route path="/upload-car-excel" element={<UploadCarEXCEL />} />
                 
                
                <Route path="/car-management" element={<CarManagement />} />

                <Route path="/allotment-status-app" element={<AllotmentStatusApp />} />
                
                <Route path="/discount-app" element={<DiscountApp />} />
                 
                <Route path="/payment-app" element={<PaymentApp />} />

              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;