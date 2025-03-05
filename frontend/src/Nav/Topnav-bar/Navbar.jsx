import { Bell, Search, Menu, Mountain } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TopNavbar({ toggleSidebar }) {
  return (
    <nav className="top-navbar">
      <div className="d-flex align-items-center gap-3">
        <button 
          className="d-md-none btn btn-dark"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
        
        <Link to="/" className="navbar-brand d-flex align-items-center text-decoration-none">
          <Mountain className="text-primary" size={28} />
          <span className="ms-2 fw-bold text-dark">Company Name</span>
        </Link> 
      </div>
      
      
    </nav>
  )
}

