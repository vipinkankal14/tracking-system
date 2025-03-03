import { NavLink } from 'react-router-dom'
import { Home, CircuitBoard, MessageSquare, Code2, } from 'lucide-react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './sidebar.scss'

export default function Sidebar({ isOpen, setIsOpen }) {
  const navItems = [
    { icon: <Home size={18} />, label: 'Home', path: '/Home' },
    { icon: <CircuitBoard size={18} />, label: 'CashierApp', path: '/cashier-app' },
    { icon: <MessageSquare size={18} />, label: 'car', path: '/car-app' },
    { icon: <Code2 size={18} />, label: 'Account', path: '/account-app' },
    { icon: <Code2 size={18} />, label: 'Exchange', path: '/exchange-app' },
    { icon: <Code2 size={18} />, label: 'Finance', path: '/finance-app' },
    { icon: <Code2 size={18} />, label: 'Insurance', path: '/insurance-app' },
    { icon: <Code2 size={18} />, label: 'Accessorie', path: '/accessorie-app' },
    { icon: <Code2 size={18} />, label: 'Coating', path: '/coating-app' },
    { icon: <Code2 size={18} />, label: 'RTO', path: '/RTO-app' },
    { icon: <Code2 size={18} />, label: 'FastTag', path: '/fast-tag-app' },
    { icon: <Code2 size={18} />, label: 'AutoCard', path: '/autocard-app' },
    { icon: <Code2 size={18} />, label: 'Extended Warranty', path: '/extended-warranty-app' },
    { icon: <Code2 size={18} />, label: 'Get Pass', path: '/gatepass-app' },
    { icon: <Code2 size={18} />, label: 'Security Clearance', path: '/securityclearance-app' },
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

