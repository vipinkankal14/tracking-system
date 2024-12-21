import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerDetails from './components/CustomerDetails';
import CarDetails from './components/CarDetails';
import OrderDetails from './components/OrderDetails';
import AdditionalDetails from './components/AdditionalDetails';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Sidebar from './sidebar/Sidebar';

export default function App() {
  return (
    <BrowserRouter>
      <div className="container py-5">
        <h1 className="text-center mb-4">Online Car Booking, Anytime, Anywhere</h1>
        <div className="row">
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <Routes>
              <Route path="/" element={<CustomerDetails />} />
              <Route path="/car-details" element={<CarDetails />} />
              <Route path="/order-details" element={<OrderDetails />} />
              <Route path="/additional-details" element={<AdditionalDetails />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

