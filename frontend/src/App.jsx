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
import CarAllotment from "./AdditionalInfo/carStocks/CarAllotment/CarAllotment";
import CarApp from "./AdditionalInfo/carStocks/CarApp";
import UploadCarEXCEL from "./AdditionalInfo/carStocks/AddCarForUploadCarEXCEL/UploadCarEXCEL";
import CarManagement from "./AdditionalInfo/carStocks/CarManagement/CarManagement";
import AllotmentStatusApp from "./AdditionalInfo/carStocks/AllotmentStatus/AllotmentStatusApp";
import DiscountApp from "./AdditionalInfo/carStocks/discount/DiscountApp";


import CarInfo from "./CustomerAdd/CarInfo";
import Confirmation from "./CustomerAdd/Confirmation";
import OrderInfo from "./CustomerAdd/OrderInfo";
import PersonalInfo from "./CustomerAdd/PersonalInfo";
import { Home } from "./home/Home";

import Demo from "./zekedemo/Demo";
import AdditionalInfo from "./CustomerAdd/AdditionalInfoApp/AdditionalInfo";
import SuccessPage from "./CustomerAdd/SuccessPage";


import PaymentHistory from "./AdditionalInfo/Account/CustomerPaymentDetails/PaymentHistory";
import PaymentClear from "./AdditionalInfo/Account/PaidAndUnpaidAndRefund/PaymentClear";
import PaymentPending from "./AdditionalInfo/Account/PaidAndUnpaidAndRefund/PaymentPending";


import Payment from "./AdditionalInfo/cashier/Payments/Payment";
import CarBookings from "./AdditionalInfo/cashier/CarBooking/CarBookings";
import CarBookingCancel from "./AdditionalInfo/cashier/CarBookingCancel/CarBookingCancel";
 import { OrderEditAndCancel } from "./AdditionalInfo/cashier/CarBooking/OrderEditAndCancel";
import { OrderEditAndConfirmed } from "./AdditionalInfo/cashier/CarBookingCancel/OrderEditAndConfirmed";
import PaymentDetails from "./AdditionalInfo/cashier/Payments/PaymentDetails";
import PaymentSuccessful from "./AdditionalInfo/cashier/Payments/PaymentSuccessful";


 import AccessorieApp from "./AdditionalInfo/Accessories/AccessorieApp";
import { AccessorieUpload } from "./AdditionalInfo/Accessories/AddedUploadView/AccessorieUpload";
import AddAccessories from "./AdditionalInfo/Accessories/AddedUploadView/AddAccessories";
import AccessorieView from "./AdditionalInfo/Accessories/AddedUploadView/AccessorieView";
import { AccessoriesDiscount } from "./AdditionalInfo/Accessories/Discount/AccessoriesDiscount";
 import AddedUploadViewApp from "./AdditionalInfo/Accessories/AddedUploadView/AddedUploadViewApp";
 
 
import ExchangeApp from "./AdditionalInfo/Exchange/ExchangeApp";
import CarExchange from "./AdditionalInfo/Exchange/CarExchange";
import CarRequest from "./AdditionalInfo/Exchange/CarRequest";
import CoatingApp from "./AdditionalInfo/Coating/CoatingApp";
import ExtendedWarrantyApp from "./AdditionalInfo/ExtendedWarranty/ExtendedWarrantyApp";
 import FinanceApp from "./AdditionalInfo/Finance/FinanceApp";
import InsuranceApp from "./AdditionalInfo/Insurance/InsuranceApp";
import AutoCardApp from "./AdditionalInfo/AutoCard/AutoCardApp";
import RTOApp from "./AdditionalInfo/RTO/RTOApp";
import SecurityClearanceApp from "./AdditionalInfo/SecurityClearance/SecurityClearanceApp";
import GatePassApp from "./AdditionalInfo/GatePass/GatePassApp";
import CustomerPaymentDetails from "./AdditionalInfo/Account/CustomerPaymentDetails/CustomerPaymentDetails";


import CashierApp from "./AdditionalInfo/cashier/CashierApp";
import AccountApp from "./AdditionalInfo/Account/AccountApp";
import PaymentRefund from "./AdditionalInfo/cashier/PaymentRefund";
import CarExchangeRejected from "./AdditionalInfo/Exchange/CarExchangeRejected";
import FinancePending from "./AdditionalInfo/Finance/FinancePending";
import FinanceRejected from "./AdditionalInfo/Finance/FinanceRejected";
import FinanceApproved from "./AdditionalInfo/Finance/FinanceApproved";
import InsuranceApproved from "./AdditionalInfo/Insurance/InsuranceApproved";
import InsuranceRejected from "./AdditionalInfo/Insurance/InsuranceRejected";
import InsurancePending from "./AdditionalInfo/Insurance/InsurancePending";
 
 
 
import AutocardRejected from "./AdditionalInfo/AutoCard/AutocardRejected";
import AutocardPending from "./AdditionalInfo/AutoCard/AutocardPending";
import FastTagApp from "./AdditionalInfo/FastTag/FastTagApp";
import AutocardApproved from "./AdditionalInfo/AutoCard/AutocardApproved";
import ExtendedWarrantyApproved from "./AdditionalInfo/ExtendedWarranty/ExtendedWarrantyApproved";
import ExtendedWarrantyPending from "./AdditionalInfo/ExtendedWarranty/ExtendedWarrantyPending";
import ExtendedWarrantyRejected from "./AdditionalInfo/ExtendedWarranty/ExtendedWarrantyRejected";
import FastTagApproved from "./AdditionalInfo/FastTag/FastTagApproved";
import FastTagRejected from "./AdditionalInfo/FastTag/FastTagRejected";
import FastTagPending from "./AdditionalInfo/FastTag/FastTagPending";
import GatepassApproved from "./AdditionalInfo/GatePass/GatepassApproved";
import GatepassRejected from "./AdditionalInfo/GatePass/GatepassRejected";
import GatepassPending from "./AdditionalInfo/GatePass/GatepassPending";
import SecurityclearanceApproved from "./AdditionalInfo/SecurityClearance/SecurityclearanceApproved";
import SecurityclearanceRejected from "./AdditionalInfo/SecurityClearance/SecurityclearanceRejected";
import SecurityclearancePending from "./AdditionalInfo/SecurityClearance/SecurityclearancePending";
import RTOApproved from "./AdditionalInfo/RTO/RTOApproved";
import RTORejected from "./AdditionalInfo/RTO/RTORejected";
import RTOPending from "./AdditionalInfo/RTO/RTOPending";
import CoatingApproved from "./AdditionalInfo/Coating/CoatingApproved";
import CoatingRejected from "./AdditionalInfo/Coating/CoatingRejected";
import CoatingPending from "./AdditionalInfo/Coating/CoatingPending";
import ACMApprovedRejected from "./AdditionalInfo/Account/ACMApprovedRejected";
import AccessoriesApproval from "./AdditionalInfo/Accessories/AccessoriesApproveRejectPending/AccessoriesApproval";
import AccessoriesReject from "./AdditionalInfo/Accessories/AccessoriesApproveRejectPending/AccessoriesReject";
import AccessoriesPending from "./AdditionalInfo/Accessories/AccessoriesApproveRejectPending/AccessoriesPending";
 

import PDIApp from "./AdditionalInfo/PreDeliveryInspection/PADApp";
import PADPending from "./AdditionalInfo/PreDeliveryInspection/PADPending";
import PADiRejected from "./AdditionalInfo/PreDeliveryInspection/PADiRejected";
import PADApproved from "./AdditionalInfo/PreDeliveryInspection/PADApproved";
import CustomerLogout from "./CustomerLogin/CustomerLogout";
import DashboardCustomer from "./CustomerLogin/DashboardCustomer";
import CustomerLogin from "./CustomerLogin/CustomerLogin";
import CustomerDetails from "./CustomerLogin/ShowCustomerDetails/CustomerDetails";
import PaymentRefundAddOn from "./AdditionalInfo/cashier/PaymentRefundAddOn";
 
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
    

                {/* ========================================================================================== */}

                
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
                <Route path="/car-pending-for-autocard" element={<AutocardPending/>} />

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

                <Route path="/gatepass-app" element={<GatePassApp />} />
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
                <Route path="/customer/:customerId" element={<CustomerDetails />} /> {/* Customer Details Route */}

                 



                



                





              
                <Route path="/Demo" element={<Demo />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;