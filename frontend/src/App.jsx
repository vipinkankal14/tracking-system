import { BrowserRouter as Router, Routes, Route, useLocation, matchPath } from "react-router-dom";
 import "./App.css";
import HomePage from "./pages/HomePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import CarViewDetails from "./Car/CarViewDetails";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import AboutPage from "./pages/AboutPage"
import Booking from "./BookingForm/Booking";
import SuccessPage from "./CustomerAdd/SuccessPage";
import AdditionalInfo from "./CustomerAdd/AdditionalInfoApp/AdditionalInfo";
import PersonalInfo from "./CustomerAdd/PersonalInfo";
import CarInfo from "./CustomerAdd/CarInfo";
import OrderInfo from "./CustomerAdd/OrderInfo";
import AddedUploadViewApp from "./AdditionalInfo/Accessories/AddedUploadView/AddedUploadViewApp";
import Confirmation from "./CustomerAdd/Confirmation";
import CarApp from "./AdditionalInfo/carStocks/CarApp";
import CarStockShow from "./AdditionalInfo/carStocks/CarAllotment/CarStockShow";
import CarAllotmentByCustomer from "./AdditionalInfo/carStocks/AllotmentAndNotAllotment/CarAllotmentByCustomer";
import AddCarStock from "./AdditionalInfo/carStocks/AddCarForUploadCarEXCEL/AddCarStock";
import BookingAmount from "./AdditionalInfo/carStocks/discount/BookingAmount";
import CarNotAllotmentByCustomer from "./AdditionalInfo/carStocks/AllotmentAndNotAllotment/CarNotAllotmentByCustomer"
import UploadCarEXCEL from "./AdditionalInfo/carStocks/AddCarForUploadCarEXCEL/UploadCarEXCEL";
import DiscountForCarAndAdditional from "./AdditionalInfo/carStocks/discount/DiscountForCarAndAdditional";
import CarManagement from "./AdditionalInfo/carStocks/CarManagement/CarManagement";
import AllotmentStatusApp from "./AdditionalInfo/carStocks/AllotmentStatus/AllotmentStatusApp";
import DiscountApp from "./AdditionalInfo/carStocks/discount/DiscountApp";
import CarAllotment from "./AdditionalInfo/carStocks/CarAllotment/CarAllotment";
import CashierApp from "./AdditionalInfo/cashier/CashierApp";
import Payment from "./AdditionalInfo/cashier/Payments/Payment";
import CarBookings from "./AdditionalInfo/cashier/CarBooking/CarBookings";
import CarBookingCancel from "./AdditionalInfo/cashier/CarBookingCancel/CarBookingCancel";
import { OrderEditAndCancel } from "./AdditionalInfo/cashier/CarBooking/OrderEditAndCancel";
import { OrderEditAndConfirmed } from "./AdditionalInfo/cashier/CarBookingCancel/OrderEditAndConfirmed";
import PaymentDetails from "./AdditionalInfo/cashier/Payments/PaymentDetails";
import PaymentSuccessful from "./AdditionalInfo/cashier/Payments/PaymentSuccessful";
import PaymentRefund from "./AdditionalInfo/cashier/PaymentRefund";
import PaymentRefundAddOn from "./AdditionalInfo/cashier/PaymentRefundAddOn";
import AccessorieApp from "./AdditionalInfo/Accessories/AccessorieApp";
import { AccessoriesDiscount } from "./AdditionalInfo/Accessories/Discount/AccessoriesDiscount";
import { AccessorieUpload } from "./AdditionalInfo/Accessories/AddedUploadView/AccessorieUpload";
import AddAccessories from "./AdditionalInfo/Accessories/AddedUploadView/AddAccessories";
import AccessorieView from "./AdditionalInfo/Accessories/AddedUploadView/AccessorieView";
import AccessoriesApproval from "./AdditionalInfo/Accessories/AccessoriesApproveRejectPending/AccessoriesApproval";
import AccessoriesReject from "./AdditionalInfo/Accessories/AccessoriesApproveRejectPending/AccessoriesReject";
import AccessoriesPending from "./AdditionalInfo/Accessories/AccessoriesApproveRejectPending/AccessoriesPending";
import AccountApp from "./AdditionalInfo/Account/AccountApp";
import PaymentClear from "./AdditionalInfo/Account/PaidAndUnpaidAndRefund/PaymentClear";
import PaymentPending from "./AdditionalInfo/Account/PaidAndUnpaidAndRefund/PaymentPending";
import CustomerPaymentDetails from "./AdditionalInfo/Account/CustomerPaymentDetails/CustomerPaymentDetails";
import ACMApprovedRejected from "./AdditionalInfo/Account/ACMApprovedRejected";
import ExchangeApp from "./AdditionalInfo/Exchange/ExchangeApp";
import CarExchange from "./AdditionalInfo/Exchange/CarExchange";
import CarRequest from "./AdditionalInfo/Exchange/CarRequest";
import CarExchangeRejected from "./AdditionalInfo/Exchange/CarExchangeRejected";
import FinanceApp from "./AdditionalInfo/Finance/FinanceApp";
import FinanceApproved from "./AdditionalInfo/Finance/FinanceApproved";
import FinanceRejected from "./AdditionalInfo/Finance/FinanceRejected";
import FinancePending from "./AdditionalInfo/Finance/FinancePending";
import InsuranceApp from "./AdditionalInfo/Insurance/InsuranceApp";
import InsuranceApproved from "./AdditionalInfo/Insurance/InsuranceApproved";
import InsuranceRejected from "./AdditionalInfo/Insurance/InsuranceRejected";
import InsurancePending from "./AdditionalInfo/Insurance/InsurancePending";
import AutoCardApp from "./AdditionalInfo/AutoCard/AutoCardApp";
import AutocardApproved from "./AdditionalInfo/AutoCard/AutocardApproved";
import AutocardRejected from "./AdditionalInfo/AutoCard/AutocardRejected";
import AutocardPending from "./AdditionalInfo/AutoCard/AutocardPending";
import RTOApp from "./AdditionalInfo/RTO/RTOApp";
import RTOApproved from "./AdditionalInfo/RTO/RTOApproved";
import RTORejected from "./AdditionalInfo/RTO/RTORejected";
import RTOPending from "./AdditionalInfo/RTO/RTOPending";
import FastTagApp from "./AdditionalInfo/FastTag/FastTagApp";
import FastTagApproved from "./AdditionalInfo/FastTag/FastTagApproved";
import FastTagRejected from "./AdditionalInfo/FastTag/FastTagRejected";
import FastTagPending from "./AdditionalInfo/FastTag/FastTagPending";
import GatepassApproved from "./AdditionalInfo/GatePass/GatepassApproved";
import GatepassRejected from "./AdditionalInfo/GatePass/GatepassRejected";
import GatepassPending from "./AdditionalInfo/GatePass/GatepassPending";
import CoatingApp from "./AdditionalInfo/Coating/CoatingApp";
import CoatingApproved from "./AdditionalInfo/Coating/CoatingApproved";
import CoatingRejected from "./AdditionalInfo/Coating/CoatingRejected";
import CoatingPending from "./AdditionalInfo/Coating/CoatingPending";
import ExtendedWarrantyApp from "./AdditionalInfo/ExtendedWarranty/ExtendedWarrantyApp";
import ExtendedWarrantyApproved from "./AdditionalInfo/ExtendedWarranty/ExtendedWarrantyApproved";
import ExtendedWarrantyPending from "./AdditionalInfo/ExtendedWarranty/ExtendedWarrantyPending";
import ExtendedWarrantyRejected from "./AdditionalInfo/ExtendedWarranty/ExtendedWarrantyRejected";
import SecurityClearanceApp from "./AdditionalInfo/SecurityClearance/SecurityClearanceApp";
import SecurityclearanceApproved from "./AdditionalInfo/SecurityClearance/SecurityclearanceApproved";
import SecurityclearanceRejected from "./AdditionalInfo/SecurityClearance/SecurityclearanceRejected";
import SecurityclearancePending from "./AdditionalInfo/SecurityClearance/SecurityclearancePending";
import PADPending from "./AdditionalInfo/PreDeliveryInspection/PADPending";
import PADiRejected from "./AdditionalInfo/PreDeliveryInspection/PADiRejected";
import PADApproved from "./AdditionalInfo/PreDeliveryInspection/PADApproved";
import CustomerLogin from "./CustomerLogin/CustomerLogin";
import CustomerLogout from "./CustomerLogin/CustomerLogout";
import DashboardCustomer from "./CustomerLogin/DashboardCustomer";
import PDIApp from "./AdditionalInfo/PreDeliveryInspection/PADApp";
import CustomerDetails from "./CustomerLogin/ShowCustomerDetails/CustomerDetails";
import PaymentHistory from "./AdditionalInfo/Account/CustomerPaymentDetails/PaymentHistory";
import GatepassApp from "./AdditionalInfo/GatePass/GatePassApp";


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  // Inside AppContent component
  const hideFooterPatterns = [
    "/login",
    "/forgot-password",
    "/booking",
    "/success-page",
    "/cashier-app",
    "/car-Booking",
    "/Payment-refund",
    "/payment-refund-add-on",
    "/car-booking-cancel",
    "/order-edit-and-confirmed",
    "/car-allotment/:vin",
    "/order-cancel/:customerId",
    "/order-edit-and-confirmed/:customerId",
    "/customer/:customerId",
    "/car/:carId",
    "/additional-info",
    "/PersonalInfo",
    "/CarInfo",
    "/OrderInfo",
    "/added-upload-viewapp",
    "/Confirmation",
    "/success-page",
    "/car-app",
    "/car-stock-show",
    "/car-allotment-by-customer",
    "/Add-Car-Stock",
    "/booking-amount",
    "/car-notallotment-ByCustomer",
    "/discount-for-car-and-additional",
    "/upload-car-excel",
    "/car-management",
    "/allotment-status-app",
    "/discount-app",
    "/cashier-app",
    "/payment",
    "/car-Booking",
    "/car-booking-cancel",
    "/order-cancel/:customerId",
    "/order-edit-and-confirmed/:customerId",
    "/payment-details",
    "/payment-successful",
    "/payment-refund",
    "/payment-refund-add-on",
    "/cashier-app",
    "/payment",
    "/car-Booking",
    "/car-booking-cancel",
    "/order-cancel/:customerId",
    "/order-edit-and-confirmed/:customerId",
    "/payment-details",
    "/payment-successful",
    "/payment-refund",
    "/payment-refund-add-on",
    "/accessorie-app",
    "/accessories-discount-main",
    "/accessorie-upload",
    "/add-accessories",
    "/accessorie-view",
    "/accessories-Approval",
    "/accessories-Reject",
    "/accessories-Pending",
    "/account-app",
    "/cashier-app",
    "/payment-clear",
    "/payment-pending",
    "/customer-payment-details",
    "/payment-history/:customerId",
    "/ACMApprovedRejected",
    "/exchange-app",
    "/car-Exchange",
    "/car-Request",
    "/car-Exchange-Rejected",
    "/finance-app",
    "/finance-approved",
    "/finance-rejected",
    "/car-pending-for-finance",
    "/insurance-app",
    "/insurance-approved",
    "/insurance-rejected",
    "/car-pending-for-Insurance",
    "/autocard-app",
    "/autocard-approved",
    "/autocard-rejected",
    "/car-pending-for-autocard",
    "/RTO-app",
    "/RTO-approved",
    "/RTO-rejected",
    "/car-pending-for-RTO",
    "/fast-tag-app",
    "/fast-tag-approved",
    "/fast-tag-rejected",
    "/car-pending-for-fast-tag",
    "/gatepass-app",
    "/gatepass-approved",
    "/gatepass-rejected",
    "/car-pending-for-gatepass",
    "/coating-app",
    "/coating-approved",
    "/coating-rejected",
    "/car-pending-for-coating",
    "/extended-warranty-app",
    "/extended-warranty-approved",
    "/extended-warranty-rejected",
    "/car-pending-for-extended-warranty",
    "/securityclearance-app",
    "/securityclearance-approved",
    "/securityclearance-rejected",
    "/car-pending-for-securityclearance",
    "/pdiApp",
    "/PADPending",
    "/PADiRejected",
    "/PADApproved",
    "/customer-logout",
    "/dashboard",
    "/customer/:customerId",
  ];

  const shouldShowFooter = !hideFooterPatterns.some(pattern => 
    matchPath(pattern, location.pathname)
  );
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          
        {/* =====================================home pages===================================================== */}

        <Route path="/" element={<HomePage />} />
        <Route path="/car/:carId" element={<CarViewDetails />} />
        <Route path="/about" element={<AboutPage />} />

        {/* =====================================booking pages================================================== */}

        <Route path="/booking" element={<Booking />} />
        <Route path="/success-page" element={<SuccessPage />} />

        {/* =====================================login pages===================================================== */}

        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* =====================================login pages===================================================== */}

        <Route path="/additional-info" element={<AdditionalInfo />} />
        <Route path="/PersonalInfo" element={<PersonalInfo />} />
        <Route path="/CarInfo" element={<CarInfo />} />
        <Route path="/OrderInfo" element={<OrderInfo />} />
        <Route path="/added-upload-viewapp" element={<AddedUploadViewApp />} />
        <Route path="/Confirmation" element={<Confirmation />} />
        <Route path="/success-page" element={<SuccessPage />} />


    
        {/* ========================================================================================== */}


        <Route path="/car-app" element={<CarApp />} />
        <Route path="/car-stock-show" element={<CarStockShow />} />
        <Route path="/car-allotment-by-customer" element={<CarAllotmentByCustomer />} />
        <Route path="/Add-Car-Stock" element={<AddCarStock />} />
        <Route path="/booking-amount" element={<BookingAmount />} />
        <Route path="/car-notallotment-ByCustomer" element={<CarNotAllotmentByCustomer />} />
        <Route path="/discount-for-car-and-additional" element={<DiscountForCarAndAdditional />} />
        <Route path="/upload-car-excel" element={<UploadCarEXCEL />} />
        <Route path="/car-management" element={<CarManagement />} />
        <Route path="/allotment-status-app" element={<AllotmentStatusApp />} />
        <Route path="/discount-app" element={<DiscountApp />} />
        <Route path="/car-allotment/:vin" element={<CarAllotment />} />


        {/* =============ok============================================================================= */}

        
        <Route path="/cashier-app" element={<CashierApp />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/car-Booking" element={<CarBookings />} />
        <Route path="/car-booking-cancel" element={<CarBookingCancel />} />
        <Route path="/order-cancel/:customerId" element={<OrderEditAndCancel />} />
        <Route path="/order-edit-and-confirmed/:customerId" element={<OrderEditAndConfirmed />} />
        <Route path="/payment-details" element={<PaymentDetails />} />
        <Route path="/payment-successful" element={<PaymentSuccessful />} />
        <Route path="/payment-refund" element={<PaymentRefund />} />
        <Route path="/payment-refund-add-on" element={<PaymentRefundAddOn />} />
        

        {/* ========================================================================================== */}

        <Route path="/accessorie-app" element={<AccessorieApp />} />
        <Route path="/accessories-discount-main" element={<AccessoriesDiscount />} />
        <Route path="/accessorie-upload" element={<AccessorieUpload />} />
        <Route path="/add-accessories" element={<AddAccessories />} />
        <Route path="/accessorie-view" element={<AccessorieView />} />
        <Route path="/accessories-Approval" element={<AccessoriesApproval />} />
          <Route path="/accessories-Reject" element={<AccessoriesReject />} />
        <Route path="/accessories-Pending" element={<AccessoriesPending />} />

                        
          {/* ========================================================================================== */}

        <Route path="/account-app" element={<AccountApp />} />
        <Route path="/cashier-app" element={<CashierApp />} />
        <Route path="/payment-clear" element={<PaymentClear />} />
        <Route path="/payment-pending" element={<PaymentPending />} />
        <Route path="/customer-payment-details" element={<CustomerPaymentDetails />} />
        <Route path="/payment-history/:customerId" element={<PaymentHistory />} />
        <Route path="/ACMApprovedRejected" element={<ACMApprovedRejected />} />

        

        {/* ========================================================================================== */}
        

        <Route path="/exchange-app" element={<ExchangeApp />} />
        <Route path="/car-Exchange" element={<CarExchange />} />
        <Route path="/car-Request" element={<CarRequest />} />
        <Route path="/car-Exchange-Rejected" element={<CarExchangeRejected />} />

        {/* ========================================================================================== */}

        <Route path="/finance-app" element={<FinanceApp />} />
        <Route path="/finance-approved" element={<FinanceApproved />} />
        <Route path="/finance-rejected" element={<FinanceRejected />} />
        <Route path="/car-pending-for-finance" element={<FinancePending />} />

        {/* ========================================================================================== */}

        <Route path="/insurance-app" element={<InsuranceApp />} />
        <Route path="/insurance-approved" element={<InsuranceApproved />} />
        <Route path="/insurance-rejected" element={<InsuranceRejected />} />
        <Route path="/car-pending-for-Insurance" element={<InsurancePending />} />

        {/* ========================================================================================== */}

        <Route path="/autocard-app" element={<AutoCardApp />} />
        <Route path="/autocard-approved" element={<AutocardApproved />} />
        <Route path="/autocard-rejected" element={<AutocardRejected />} />
          <Route path="/car-pending-for-autocard" element={<AutocardPending />} />
        

        {/* ========================================================================================== */}
        
        <Route path="/RTO-app" element={<RTOApp />} /> 
        <Route path="/RTO-approved" element={<RTOApproved />} />
        <Route path="/RTO-rejected" element={<RTORejected />} />
        <Route path="/car-pending-for-RTO" element={<RTOPending />} />
        
        {/* ========================================================================================== */}

        <Route path="/fast-tag-app" element={<FastTagApp />} />
        <Route path="/fast-tag-approved" element={<FastTagApproved />} />
        <Route path="/fast-tag-rejected" element={<FastTagRejected />} />
        <Route path="/car-pending-for-fast-tag" element={<FastTagPending />} />

        {/* ========================================================================================== */}

        <Route path="/gatepass-app" element={<GatepassApp />} />
        <Route path="/gatepass-approved" element={<GatepassApproved />} />
        <Route path="/gatepass-rejected" element={<GatepassRejected />} />
        <Route path="/car-pending-for-gatepass" element={<GatepassPending />} />
        
        {/* ========================================================================================== */}

        <Route path="/coating-app" element={<CoatingApp />} />
        <Route path="/coating-approved" element={<CoatingApproved />} />
        <Route path="/coating-rejected" element={<CoatingRejected />} />
        <Route path="/car-pending-for-coating" element={<CoatingPending />} />

        {/* ========================================================================================== */}

        <Route path="/extended-warranty-app" element={<ExtendedWarrantyApp />} />
        <Route path="/extended-warranty-approved" element={<ExtendedWarrantyApproved />} />
        <Route path="/extended-warranty-rejected" element={<ExtendedWarrantyRejected />} />
        <Route path="/car-pending-for-extended-warranty" element={<ExtendedWarrantyPending />} />

        
        {/* ========================================================================================== */}

        <Route path="/securityclearance-app" element={<SecurityClearanceApp />} />
        <Route path="/securityclearance-approved" element={<SecurityclearanceApproved />} />
        <Route path="/securityclearance-rejected" element={<SecurityclearanceRejected />} />
        <Route path="/car-pending-for-securityclearance" element={<SecurityclearancePending />} />

        
        {/* ========================================================================================== */}

        <Route path="/pdiApp" element={<PDIApp />} />
        <Route path="/PADPending" element={<PADPending />} />
        <Route path="/PADiRejected" element={<PADiRejected />} />
        <Route path="/PADApproved" element={<PADApproved />} />


        {/* ========================================================================================== */}
        
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/customer-logout" element={<CustomerLogout />} />
        <Route path="/dashboard" element={<DashboardCustomer />} />
        <Route path="/customer/:customerId" element={<CustomerDetails />} /> 
          

 

         </Routes>
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
}

export default App;