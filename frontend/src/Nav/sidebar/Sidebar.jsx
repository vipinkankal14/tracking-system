import { NavLink } from 'react-router-dom'
import { Home, CircuitBoard, MessageSquare, Code2, } from 'lucide-react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './sidebar.scss'

export default function Sidebar({ isOpen, setIsOpen }) {
  const navItems = [
    { icon: <Home size={20} />, label: 'Home', path: '/Home' },
    { icon: <CircuitBoard size={20} />, label: 'CashierApp', path: '/cashier-app' },
    { icon: <MessageSquare size={20} />, label: 'car', path: '/car' },
    { icon: <Code2 size={20} />, label: 'AccessorieApp', path: '/accessorie-app' },
 
  ]

  return (
    <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="d-flex flex-column h-100" style={{ overflowY: 'auto' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
            onClick={() => setIsOpen(false)}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

