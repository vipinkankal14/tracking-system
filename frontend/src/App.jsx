import { Routes, Route } from "react-router-dom";
import Sidebar from "./Nav/sidebar/Sidebar";
import TopNavbar from "./Nav/Topnav-bar/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Nav/sidebar/Sidebar.scss';
import { useState, Suspense } from "react";
import './App.css';
 
import AddCarStock from "./AdditionalInfo/carStocks/AddCarForUploadCarEXCEL/AddCarStock";
import CarAllotmentByCustomer from "./AdditionalInfo/carStocks/AllotmentAndNotAllotment/CarAllotmentByCustomer";
import CarStockShow from "./AdditionalInfo/carStocks/CarAllotment/CarStockShow";
import BookingAmount from "./AdditionalInfo/carStocks/discount/BookingAmount";
import CarNotAllotmentByCustomer from "./AdditionalInfo/carStocks/AllotmentAndNotAllotment/CarNotAllotmentByCustomer";
import DiscountForCarAndAdditional from "./AdditionalInfo/carStocks/discount/DiscountForCarAndAdditional";

import CarInfo from "./CustomerAdd/CarInfo";
import Confirmation from "./CustomerAdd/Confirmation";
import OrderInfo from "./CustomerAdd/OrderInfo";
import PersonalInfo from "./CustomerAdd/PersonalInfo";
import { Home } from "./home/Home";

import Demo from "./zekedemo/Demo";
import AdditionalInfo from "./CustomerAdd/AdditionalInfoApp/AdditionalInfo";
import SuccessPage from "./CustomerAdd/SuccessPage";
import PaymentSuccessful from "./AdditionalInfo/cashier/Payments/PaymentSuccessful";
import CarAllotment from "./AdditionalInfo/carStocks/CarAllotment/CarAllotment";
import CarApp from "./AdditionalInfo/carStocks/CarApp";
import PaymentDetails from "./AdditionalInfo/cashier/Payments/PaymentDetails";
import PaymentClear from "./AdditionalInfo/cashier/Payments/PaymentClear";
import CarBookings from "./AdditionalInfo/cashier/CarBooking/CarBookings";
import CarBookingCancel from "./AdditionalInfo/cashier/CarBookingCancel/CarBookingCancel";
import CustomerPaymentDetails from "./AdditionalInfo/cashier/CustomerPaymentDetails/CustomerPaymentDetails";
import PaymentHistory from "./AdditionalInfo/cashier/CustomerPaymentDetails/PaymentHistory";
import { OrderEditAndCancel } from "./AdditionalInfo/cashier/CarBooking/OrderEditAndCancel";
import { OrderEditAndConfirmed } from "./AdditionalInfo/cashier/CarBookingCancel/OrderEditAndConfirmed";
import FileTracking from "./AdditionalInfo/cashier/CashierMhanaement/FileTracking";
import PaymentPending from "./AdditionalInfo/cashier/Payments/PaymentPending";
import UploadCarEXCEL from "./AdditionalInfo/carStocks/AddCarForUploadCarEXCEL/UploadCarEXCEL";
import CarManagement from "./AdditionalInfo/carStocks/CarManagement/CarManagement";
import AllotmentStatusApp from "./AdditionalInfo/carStocks/AllotmentStatus/AllotmentStatusApp";
import DiscountApp from "./AdditionalInfo/carStocks/discount/DiscountApp";
 import AccessorieApp from "./AdditionalInfo/Accessories/AccessorieApp";
import { AccessorieUpload } from "./AdditionalInfo/Accessories/AddedUploadView/AccessorieUpload";
import AddAccessories from "./AdditionalInfo/Accessories/AddedUploadView/AddAccessories";
import AccessorieView from "./AdditionalInfo/Accessories/AddedUploadView/AccessorieView";
import { AccessoriesDiscount } from "./AdditionalInfo/Accessories/Discount/AccessoriesDiscount";
import RequestByCustomer from "./AdditionalInfo/Accessories/CustomerAccessories/RequestByCustomer";
import { AccessoriesManagement } from "./AdditionalInfo/Accessories/Management/AccessoriesManagement";
import CancelAndModifyApp from "./AdditionalInfo/Accessories/CancelAndModifyApp";
import { ModifyByCustomer } from "./AdditionalInfo/Accessories/CustomerAccessories/ModifyByCustomer";
import CancelByCustomer from "./AdditionalInfo/Accessories/CustomerAccessories/CancelByCustomer";
import CashierApp from "./AdditionalInfo/cashier/CashierApp" 
import Payment from "./AdditionalInfo/cashier/Payments/Payment";
import AddedUploadViewApp from "./AdditionalInfo/Accessories/AddedUploadView/AddedUploadViewApp";
import RequestByAcceotApp from "./AdditionalInfo/Accessories/RequestByAcceptApp";
import AcceptByCustomer from "./AdditionalInfo/Accessories/CustomerAccessories/AcceptByCustomer";
import AccountApp from "./AdditionalInfo/Account/AccountApp";
import ExchangeApp from "./AdditionalInfo/Exchange/ExchangeApp";
import PaymentApp from "./AdditionalInfo/Account/PaymentApp";
import CarExchange from "./AdditionalInfo/Exchange/CarExchange";
import CarRequest from "./AdditionalInfo/Exchange/CarRequest";
 



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
                <Route path="/home" element={<Home />} />
                <Route path="/success-page" element={<SuccessPage />} />
                <Route path="/payment-successful" element={<PaymentSuccessful />} />
                <Route path="/car" element={<CarApp />} />
                <Route path="/car-allotment/:vin" element={<CarAllotment />} />
                <Route path="/cashier-app" element={<CashierApp />} />
                <Route path="/payment-details" element={<PaymentDetails />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payment-clear" element={<PaymentClear />} />
                <Route path="/car-Booking" element={<CarBookings />} />
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
                <Route path="/additional-info" element={<AdditionalInfo />} />
                <Route path="/CarInfo" element={<CarInfo />} />
                <Route path="/Confirmation" element={<Confirmation />} />
                <Route path="/OrderInfo" element={<OrderInfo />} />
                <Route path="/PersonalInfo" element={<PersonalInfo />} />
                <Route path="/accessorie-app" element={<AccessorieApp />} />
                <Route path="/added-upload-viewapp" element={<AddedUploadViewApp />} />
                <Route path="/accessorie-upload" element={<AccessorieUpload />} />
                <Route path="/add-accessories" element={<AddAccessories />} />
                <Route path="/accessorie-view" element={<AccessorieView />} />
                <Route path="/accessories-discount-main" element={<AccessoriesDiscount />} />
                <Route path="/request-by-customer" element={<RequestByCustomer />} />
                <Route path="/accessories-management" element={<AccessoriesManagement />} /> 
                <Route path="/CancelAnd-Modify-App" element={<CancelAndModifyApp />} />
                <Route path="/Modify-By-Customer" element={<ModifyByCustomer />} /> 
                <Route path="/Cancel-By-Customer" element={<CancelByCustomer />} />
                <Route path="/Demo" element={<Demo />} />
                
                <Route path="/Request-By-Accept-App" element={<RequestByAcceotApp />} />
                <Route path="/accept-by-customer" element={<AcceptByCustomer />} />
                <Route path="/account-app" element={<AccountApp />} />

                <Route path="/exchange-app" element={<ExchangeApp />} />
                
                <Route path="/car-Exchange" element={<CarExchange />} />
              
                <Route path="/car-Request" element={<CarRequest />} />



              
                
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;