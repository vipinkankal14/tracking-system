import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, GitPullRequest, CircuitBoard, MessageSquare, Code2, Cpu, Compass, ShoppingBag } from 'lucide-react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './sidebar.scss'

export default function Sidebar({ isOpen, setIsOpen }) {
  const navItems = [
    { icon: <Home size={20} />, label: 'Home', path: '/' },
    { icon: <GitPullRequest size={20} />, label: 'Customers', path: '/AdditionalDetails' },
    { icon: <CircuitBoard size={20} />, label: 'CashierApp', path: '/CashierApp' },
    { icon: <MessageSquare size={20} />, label: 'Discussions', path: '/discussions' },
    { icon: <Code2 size={20} />, label: 'Codespaces', path: '/codespaces' },
    { icon: <Cpu size={20} />, label: 'Copilot', path: '/copilot' },
    { icon: <Compass size={20} />, label: 'Explore', path: '/explore' },
    { icon: <ShoppingBag size={20} />, label: 'Marketplace', path: '/marketplace' },
  ]

  return (
    <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="d-flex flex-column h-100">
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

