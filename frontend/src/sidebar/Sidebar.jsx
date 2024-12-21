import React from 'react'
 import "./Sidebar.css"
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="booking-steps">
    <NavLink to="/" className={({ isActive }) => 
      `step-item ${isActive ? 'active' : ''}`
    }>
      Customer Details
    </NavLink>
    <NavLink to="/car-details" className={({ isActive }) => 
      `step-item ${isActive ? 'active' : ''}`
    }>
      Car Details
    </NavLink>
    <NavLink to="/order-details" className={({ isActive }) => 
      `step-item ${isActive ? 'active' : ''}`
    }>
      Order Details
    </NavLink>
    <NavLink to="/additional-details" className={({ isActive }) => 
      `step-item ${isActive ? 'active' : ''}`
    }>
      Additional Details
    </NavLink>
  </div>
  )
}

export default Sidebar
