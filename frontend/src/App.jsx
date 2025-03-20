import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
 import "./App.css";
import HomePage from "./pages/HomePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import CarViewDetails from "./Car/CarViewDetails";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import AboutPage from "./pages/AboutPage"
 
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const hideFooterPaths = ["/login", "/forgot-password"];
  const isCarDetailsPage = /^\/car\/\d+$/.test(location.pathname); // Matches /car/:carId
  
  const shouldShowFooter = !hideFooterPaths.includes(location.pathname) && !isCarDetailsPage;

  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/car/:carId" element={<CarViewDetails />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
         </Routes>
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
}

export default App;