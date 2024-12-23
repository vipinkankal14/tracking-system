import { Bell, Search, Menu, Mountain } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NavbarUser({ toggleSidebar }) {
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
          <span className="ms-2 fw-bold text-dark">ACME Inc</span>
        </Link> 

         
      </div>
      
      <div className="d-flex align-items-center gap-3">
        <button className="notification-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        
        <div className="dropdown">
          <button 
            className="profile-btn" 
            type="button" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            <img 
              src="/placeholder.svg?height=32&width=32" 
              alt="Profile" 
              className="profile-img"
            />
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
            <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
            <li><hr className="dropdown-divider" /></li>
            <li><Link className="dropdown-item" to="/logout">Logout</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

