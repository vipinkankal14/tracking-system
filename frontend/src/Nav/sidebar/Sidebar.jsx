import { NavLink } from 'react-router-dom'
import { Home, CircuitBoard, MessageSquare, Code2, } from 'lucide-react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './sidebar.scss'

export default function Sidebar({ isOpen, setIsOpen }) {
  const navItems = [
    { icon: <Home size={20} />, label: 'Home', path: '/Home' },
    { icon: <CircuitBoard size={20} />, label: 'CashierApp', path: '/cashier-app' },
    { icon: <MessageSquare size={20} />, label: 'car', path: '/car' },
    { icon: <Code2 size={20} />, label: 'Account', path: '/account-app' },
    { icon: <Code2 size={20} />, label: 'Exchange', path: '/exchange-app' },
    { icon: <Code2 size={20} />, label: 'Finance', path: '/accessorie-app' },
    { icon: <Code2 size={20} />, label: 'Insurance', path: '/accessorie-app' },
    { icon: <Code2 size={20} />, label: 'Accessorie', path: '/accessorie-app' },
    { icon: <Code2 size={20} />, label: 'Coating', path: '/accessorie-app' },
    { icon: <Code2 size={20} />, label: 'RTO', path: '/accessorie-app' },
    { icon: <Code2 size={20} />, label: 'FastTag', path: '/accessorie-app' },
    { icon: <Code2 size={20} />, label: 'AutoCard', path: '/accessorie-app' },
    { icon: <Code2 size={20} />, label: 'Extended Warranty', path: '/accessorie-app' },
    { icon: <Code2 size={20} />, label: 'Get Pass', path: '/accessorie-app' },
    { icon: <Code2 size={20} />, label: 'Security Clearance', path: '/accessorie-app' },
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

