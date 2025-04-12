import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  matchPath,
} from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import CarViewDetails from "./Car/CarViewDetails";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import AboutPage from "./pages/AboutPage";
import Booking from "./BookingForm/Booking";
import SuccessPage from "./CustomerAdd/SuccessPage";
import AdditionalInfo from "./CustomerAdd/AdditionalInfoApp/AdditionalInfo";
import PersonalInfo from "./CustomerAdd/PersonalInfo";
import CarInfo from "./CustomerAdd/CarInfo";
import Confirmation from "./CustomerAdd/Confirmation";
import CarApp from "./AdditionalInfo/carStocks/CarApp";
import CarStockShow from "./AdditionalInfo/carStocks/CarAllotment/CarStockShow";
import AddCarStock from "./AdditionalInfo/carStocks/AddCarForUploadCarEXCEL/AddCarStock";
import BookingAmount from "./AdditionalInfo/carStocks/discount/BookingAmount";
import UploadCarEXCEL from "./AdditionalInfo/carStocks/AddCarForUploadCarEXCEL/UploadCarEXCEL";
import DiscountForCarAndAdditional from "./AdditionalInfo/carStocks/discount/DiscountForCarAndAdditional";
import CarManagement from "./AdditionalInfo/carStocks/CarManagement/CarManagement";
import AllotmentStatusApp from "./AdditionalInfo/carStocks/AllotmentStatus/AllotmentStatusApp";
import DiscountApp from "./AdditionalInfo/carStocks/discount/DiscountApp";
import CarAllotment from "./AdditionalInfo/carStocks/CarAllotment/CarAllotment";
import CashierApp from "./AdditionalInfo/cashier/CashierApp";
import Payment from "./AdditionalInfo/cashier/Payments/Payment";
import CarBookings from "./AdditionalInfo/cashier/CarBooking/CarBookings";
import { OrderEditAndCancel } from "./AdditionalInfo/cashier/CarBooking/OrderEditAndCancel";
import { OrderEditAndConfirmed } from "./AdditionalInfo/cashier/CarBooking/OrderEditAndConfirmed";
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
import CustomerPaymentDetails from "./AdditionalInfo/Account/CustomerPaymentDetails/CustomerPaymentDetails";
import ACMApprovedRejected from "./AdditionalInfo/Account/ACMApprovedRejected";
import ExchangeApp from "./AdditionalInfo/Exchange/ExchangeApp";
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
import DashboardCustomer from "./CustomerLogin/ShowCustomerDetails/DashboardCustomer";
import PDIApp from "./AdditionalInfo/PreDeliveryInspection/PADApp";
import PaymentHistory from "./AdditionalInfo/Account/CustomerPaymentDetails/PaymentHistory";
import GatepassApp from "./AdditionalInfo/GatePass/GatePassApp";
import ExchangeApproved from "./AdditionalInfo/Exchange/ExchangeApproved";
import ExchangeRejected from "./AdditionalInfo/Exchange/ExchangeRejected";
import UserManagement from "./UserManagementSystem/UserManagement";
import LogoutPage from "./pages/OfficeNavbar";
import UserManagementLayout from "./UserManagementSystem/UserManagementLayout";
import ExchangeLayout from "./AdditionalInfo/Exchange/ExchangeLayout";
import ExchangePending from "./AdditionalInfo/Exchange/ExchangePending";
import AuthRoute from "./AuthRoute";
import FinanceLayout from "./AdditionalInfo/Finance/FinanceLayout";
import PreDeliveryInspectionLayout from "./AdditionalInfo/PreDeliveryInspection/PreDeliveryInspectionLayout";
import SecurityClearanceLayout from "./AdditionalInfo/SecurityClearance/SecurityClearanceLayout";
import ExtendedWarrantyLayout from "./AdditionalInfo/ExtendedWarranty/ExtendedWarrantyLayout";
import CoatingLayout from "./AdditionalInfo/Coating/CoatingLayout";
import AccessorieLayout from "./AdditionalInfo/Accessories/AccessorieLayout";
import AutoCarLayout from "./AdditionalInfo/AutoCard/AutoCarLayout";
import RTOLayout from "./AdditionalInfo/RTO/RTOLayout";
import CashierLayout from "./AdditionalInfo/cashier/CashierLayout";
import AccountLayout from "./AdditionalInfo/Account/AccountLayout";
import CarStockLayout from "./AdditionalInfo/carStocks/CarStockLayout";
import Productlist from "./Car/Productlist";
import FastTagLayout from "./AdditionalInfo/FastTag/FastTagLayout";
import InsuranceLayout from "./AdditionalInfo/Insurance/InsuranceLayout";
import Services from "./pages/Services";
import ContactUs from "./pages/ContactUs";
import CustomerDetails from "./CustomerLogin/ShowCustomerDetails/CustomerDetails";
import CustomerProfile from "./CustomerLogin/CustomerProfile";
import UserNavbar from "./CustomerLogin/Components/UserNavbar";
import OfficeNavbar from "./pages/OfficeNavbar";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  // Check if user is logged in as customer
  const isCustomerLoggedIn = () => {
    const token = localStorage.getItem("authToken");
    const expiry = localStorage.getItem("tokenExpiry");
    const userData = localStorage.getItem("userData");

    if (token && expiry && Date.now() < parseInt(expiry) && userData) {
      const user = JSON.parse(userData);
      return !!user.customerId; // Returns true if customerId exists
    }
    return false;
  };

  const isOfficeLoggedIn = () => {
    const token = localStorage.getItem("authToken");
    const expiry = localStorage.getItem("tokenExpiry");
    const userData = localStorage.getItem("userData");

    if (token && expiry && Date.now() < parseInt(expiry) && userData) {
      const user = JSON.parse(userData);
      return !!user.emp_id; // Returns true if emp_id exists
    }
    return false;
  };

  const getNavbarComponent = () => {
    if (isCustomerLoggedIn()) {
      return <UserNavbar />;
    } else if (isOfficeLoggedIn()) {
      return <OfficeNavbar />;
    } else {
      return <Navbar />;
    }
  };

  // Inside AppContent component
  const hideFooterPatterns = [
    "/forgot-password",
    "/booking",
    "/success-page",
    "/cashier-app",
    "/car-Booking",
    "/Payment-refund",
    "/payment-refund-add-on",
    "/car-booking-cancel",
    "/car-allotment/:vin",
    "/order-cancel/:customerId",
    "/customer/:customerId",
    "/car/:carId",
    "/additional-info",
    "/PersonalInfo",
    "/CarInfo",
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
    "/exchange-pending",
    "/exchange-approved",
    "/exchange-rejected",
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
    "/pdi-Pending",
    "/pdi-iRejected",
    "/pdi-Approved",
    "/customer-logout",
    "/dashboard",
    "/customer/:customerId",
     "/Exchange-Management",
    "/Exchange-Management/*",
    "/Finance-Management",
    "/Finance-Management/*",

    "/SecurityClearance-Management/",
    "/SecurityClearance-Management/*",
    "/Extended-Warranty-Management/",
    "/Extended-Warranty-Management/*",
    "/Coating-Management/",
    "/Coating-Management/*",

    "/fast-tag-Management/",
    "/fast-tag-Management/*",
    "/RTOApp-Management/",
    "/RTOApp-Management/*",
    "/AutoCard-Management/",
    "/AutoCard-Management/*",
    "/insurance-Management/",
    "/insurance-Management/*",
    "/Accessories-Management/",
    "/Accessories-Management/*",
    "/Cashier-Management/",
    "/Cashier-Management/*",
    "/account-Management/",
    "/account-Management/*",
    "/car-stock-Management/",
    "/car-stock-Management/*",
    "/PreDelivery-Management/",
    "/PreDelivery-Management/*",
    "/User-Management",
    "/customerProfile"
  ];

  const shouldShowFooter = !hideFooterPatterns.some((pattern) =>
    matchPath(pattern, location.pathname)
  );
  return (
    <div className="app-container">
     <div> {getNavbarComponent()} </div> 
      <main>
        <Routes>
          {/* =====================================home pages===================================================== */}

          <Route path="/" element={<HomePage />} />
          <Route path="/car/:carId" element={<CarViewDetails />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/Productlist" element={<Productlist />} />
          <Route path="/services" element={<Services />} />
          <Route path="/ContactUs" element={<ContactUs />} />

          <Route path="/CustomerProfile" element={<CustomerProfile />} />
          <Route path="/dashboard" element={<DashboardCustomer />} />
          <Route path="/customer/:customerId" element={<CustomerDetails />} />

          {/* =====================================booking pages================================================== */}

          <Route path="/booking" element={<Booking />} />
          <Route path="/success-page" element={<SuccessPage />} />

          {/* =====================================login pages===================================================== */}

          <Route path="/login" element={<LoginPage />} />
          <Route path="/LogoutPage" element={<LogoutPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* =====================================login pages===================================================== */}

          <Route path="/additional-info" element={<AdditionalInfo />} />
          <Route path="/PersonalInfo" element={<PersonalInfo />} />
          <Route path="/CarInfo" element={<CarInfo />} />
          <Route path="/Confirmation" element={<Confirmation />} />
          <Route path="/success-page" element={<SuccessPage />} />

          {/* ========================================================================================== */}

          <Route
            element={<AuthRoute allowedRoles={["Car Stocks Management"]} />}
          >
            <Route path="/car-stock-Management" element={<CarStockLayout />}>
              <Route index element={<CarApp />} />

              <Route path="car-stock-show" element={<CarStockShow />} />
              <Route path="Add-Car-Stock" element={<AddCarStock />} />
              <Route path="booking-amount" element={<BookingAmount />} />
              <Route
                path="discount-for-car-and-additional"
                element={<DiscountForCarAndAdditional />}
              />
              <Route path="upload-car-excel" element={<UploadCarEXCEL />} />
              <Route path="car-management" element={<CarManagement />} />
              <Route
                path="allotment-status-app"
                element={<AllotmentStatusApp />}
              />
              <Route path="discount-app" element={<DiscountApp />} />

              <Route path="car-allotment/:vin" element={<CarAllotment />} />
            </Route>
          </Route>

          {/* =============ok============================================================================= */}

          <Route element={<AuthRoute allowedRoles={["Cashier Management"]} />}>
            <Route path="/Cashier-Management" element={<CashierLayout />}>
              <Route index element={<CashierApp />} />

              <Route path="payment" element={<Payment />} />
              <Route path="car-Booking" element={<CarBookings />} />
              <Route
                path="order-cancel/:customerId"
                element={<OrderEditAndCancel />}
              />
              <Route
                path="order-edit-and-confirmed/:customerId"
                element={<OrderEditAndConfirmed />}
              />
              <Route path="payment-details" element={<PaymentDetails />} />
              <Route
                path="payment-successful"
                element={<PaymentSuccessful />}
              />
              <Route path="payment-refund" element={<PaymentRefund />} />
              <Route
                path="payment-refund-add-on"
                element={<PaymentRefundAddOn />}
              />
            </Route>
          </Route>
          {/* ========================================================================================== */}

          <Route
            element={<AuthRoute allowedRoles={["Accessories Management"]} />}
          >
            <Route
              path="/Accessories-Management"
              element={<AccessorieLayout />}
            >
              <Route index element={<AccessorieApp />} />
              <Route
                path="accessories-discount-main"
                element={<AccessoriesDiscount />}
              />
              <Route path="accessorie-upload" element={<AccessorieUpload />} />
              <Route path="add-accessories" element={<AddAccessories />} />
              <Route path="accessorie-view" element={<AccessorieView />} />
              <Route
                path="accessories-Approval"
                element={<AccessoriesApproval />}
              />
              <Route
                path="accessories-Reject"
                element={<AccessoriesReject />}
              />
              <Route
                path="accessories-Pending"
                element={<AccessoriesPending />}
              />
            </Route>
          </Route>

          {/* ========================================================================================== */}

          <Route element={<AuthRoute allowedRoles={["Account Management"]} />}>
            <Route path="/account-Management" element={<AccountLayout />}>
              <Route index element={<AccountApp />} />
              <Route
                path="customer-payment-details"
                element={<CustomerPaymentDetails />}
              />
              <Route
                path="payment-history/:customerId"
                element={<PaymentHistory />}
              />
              <Route path="payment-history/:vin" element={<PaymentHistory />} />
              <Route
                path="ACMApprovedRejected"
                element={<ACMApprovedRejected />}
              />
              <Route path="gatepass-app" element={<GatepassApp />} />
              <Route path="gatepass-approved" element={<GatepassApproved />} />
              <Route path="gatepass-rejected" element={<GatepassRejected />} />
              <Route
                path="car-pending-for-gatepass"
                element={<GatepassPending />}
              />
            </Route>
          </Route>

          {/* ========================================================================================== */}

          <Route
            element={<AuthRoute allowedRoles={["Insurance Management"]} />}
          >
            <Route path="/insurance-Management" element={<InsuranceLayout />}>
              <Route index element={<InsuranceApp />} />

              <Route
                path="insurance-approved"
                element={<InsuranceApproved />}
              />
              <Route
                path="insurance-rejected"
                element={<InsuranceRejected />}
              />
              <Route
                path="car-pending-for-Insurance"
                element={<InsurancePending />}
              />
            </Route>
          </Route>

          {/* ========================================================================================== */}

          <Route element={<AuthRoute allowedRoles={["AutoCard Management"]} />}>
            <Route path="/AutoCard-Management" element={<AutoCarLayout />}>
              <Route index element={<AutoCardApp />} />
              <Route path="autocard-approved" element={<AutocardApproved />} />
              <Route path="autocard-rejected" element={<AutocardRejected />} />
              <Route
                path="car-pending-for-autocard"
                element={<AutocardPending />}
              />
            </Route>
          </Route>

          {/* ========================================================================================== */}

          <Route element={<AuthRoute allowedRoles={["RTO Management"]} />}>
            <Route path="/RTOApp-Management" element={<RTOLayout />}>
              <Route index element={<RTOApp />} />
              <Route path="RTO-approved" element={<RTOApproved />} />
              <Route path="RTO-rejected" element={<RTORejected />} />
              <Route path="car-pending-for-RTO" element={<RTOPending />} />
            </Route>
          </Route>

          {/* ========================================================================================== */}

          <Route element={<AuthRoute allowedRoles={["FastTag Management"]} />}>
            <Route path="/fast-tag-Management" element={<FastTagLayout />}>
              <Route index element={<FastTagApp />} />
              <Route path="fast-tag-approved" element={<FastTagApproved />} />
              <Route path="fast-tag-rejected" element={<FastTagRejected />} />
              <Route
                path="car-pending-for-fast-tag"
                element={<FastTagPending />}
              />
            </Route>
          </Route>

          {/* ========================================================================================== */}

          {/* ========================================================================================== */}

          <Route element={<AuthRoute allowedRoles={["Coating Management"]} />}>
            <Route path="/Coating-Management" element={<CoatingLayout />}>
              <Route index element={<CoatingApp />} />
              <Route path="coating-approved" element={<CoatingApproved />} />
              <Route path="coating-rejected" element={<CoatingRejected />} />
              <Route
                path="car-pending-for-coating"
                element={<CoatingPending />}
              />
            </Route>
          </Route>

          {/* ========================================================================================== */}

          <Route
            element={
              <AuthRoute allowedRoles={["Extended Warranty Management"]} />
            }
          >
            <Route
              path="/Extended-Warranty-Management"
              element={<ExtendedWarrantyLayout />}
            >
              <Route index element={<ExtendedWarrantyApp />} />
              <Route
                path="extended-warranty-approved"
                element={<ExtendedWarrantyApproved />}
              />
              <Route
                path="extended-warranty-rejected"
                element={<ExtendedWarrantyRejected />}
              />
              <Route
                path="car-pending-for-extended-warranty"
                element={<ExtendedWarrantyPending />}
              />
            </Route>
          </Route>

          {/* ========================================================================================== */}

          <Route
            element={
              <AuthRoute allowedRoles={["Security Clearance Management"]} />
            }
          >
            <Route
              path="/SecurityClearance-Management"
              element={<SecurityClearanceLayout />}
            >
              <Route index element={<SecurityClearanceApp />} />

              <Route
                path="securityclearance-approved"
                element={<SecurityclearanceApproved />}
              />
              <Route
                path="securityclearance-rejected"
                element={<SecurityclearanceRejected />}
              />
              <Route
                path="car-pending-for-securityclearance"
                element={<SecurityclearancePending />}
              />
            </Route>
          </Route>

          {/* ========================================================================================== */}

          <Route
            element={
              <AuthRoute
                allowedRoles={["PDI (Pre-Delivery Inspection) Management"]}
              />
            }
          >
            <Route
              path="/PreDelivery-Management"
              element={<PreDeliveryInspectionLayout />}
            >
              <Route index element={<PDIApp />} />
              <Route path="pdi-Pending" element={<PADPending />} />
              <Route path="pdi-iRejected" element={<PADiRejected />} />
              <Route path="pdi-Approved" element={<PADApproved />} />
            </Route>
          </Route>

          {/* ========================================================================================== */}

          {/* ==1======================================================================================== */}

          <Route element={<AuthRoute allowedRoles={["HR Management"]} />}>
            <Route path="/User-Management" element={<UserManagementLayout />} />
          </Route>

          {/* =2========================================================================================= */}

          <Route element={<AuthRoute allowedRoles={["Exchange Management"]} />}>
            <Route path="/Exchange-Management" element={<ExchangeLayout />}>
              <Route index element={<ExchangeApp />} />
              <Route path="exchange-pending" element={<ExchangePending />} />
              <Route path="exchange-approved" element={<ExchangeApproved />} />
              <Route path="exchange-rejected" element={<ExchangeRejected />} />
            </Route>
          </Route>

          {/* ==3======================================================================================= */}

          <Route element={<AuthRoute allowedRoles={["Finance Management"]} />}>
            <Route path="/Finance-Management" element={<FinanceLayout />}>
              <Route index element={<FinanceApp />} />
              <Route path="finance-approved" element={<FinanceApproved />} />
              <Route path="finance-rejected" element={<FinanceRejected />} />
              <Route path="finance-Pending" element={<FinancePending />} />
            </Route>
          </Route>

          {/* ========================================================================================== */}
        </Routes>
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
}

export default App;
