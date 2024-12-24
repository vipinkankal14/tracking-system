import React, { useState } from 'react'
import NavbarUser from '../Nav/Topnav-bar/NavbarUser'
import Sidebar from '../Nav/Customer/Sidebar'

const Home = () => {

   const [sidebarOpen, setSidebarOpen] = useState(false)
  
    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen)
  }
  
  return (
    <>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <NavbarUser toggleSidebar={toggleSidebar} />
       
<div className="row g-4">
    <div className="col-12">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="card-title h3 mb-4">Welcome to Dashboard</h1>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="p-4 border rounded bg-light">
                <h3 className="h5">Recent Activity</h3>
                <p className="mb-0">Your recent activities will appear here</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="p-4 border rounded bg-light">
                <h3 className="h5">Statistics</h3>
                <p className="mb-0">View your statistics and analytics</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="p-4 border rounded bg-light">
                <h3 className="h5">Quick Actions</h3>
                <p className="mb-0">Frequently used actions and shortcuts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>  


   
      
    
</>
    
  )
}

export default Home
