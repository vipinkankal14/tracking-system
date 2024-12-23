import React from 'react';
import { NavLink} from 'react-router-dom';
import './Customer.css';  // Assuming you have styling for your Sidebar
 

const Customer = () => {
  return (
    <div className="booking-steps">
      <NavLink to="/customer/customer-details" className={({ isActive }) => `step-item ${isActive ? 'active' : ''}`}>
        Customer Details
      </NavLink>
      <NavLink to="/customer/car-details" className={({ isActive }) => `step-item ${isActive ? 'active' : ''}`}>
        Car Details
      </NavLink>
      <NavLink to="/customer/order-details" className={({ isActive }) => `step-item ${isActive ? 'active' : ''}`}>
        Order Details
      </NavLink>
      <NavLink to="/customer/additional-details" className={({ isActive }) => `step-item ${isActive ? 'active' : ''}`}>
        Additional Details
      </NavLink>

    </div>
  );
};

export default Customer;
