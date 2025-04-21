"use client"

import { useState, useEffect, useMemo } from "react"
import { FiClock, FiCheckCircle, FiXCircle, FiAlertTriangle, FiRefreshCw } from "react-icons/fi"
import "./StatusCard.scss"

const StatusCounts = () => {
  const [statusCounts, setStatusCounts] = useState(null)
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchStatusCounts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/getCustomerDetailsWithStatuses")
      if (!response.ok) {
        throw new Error("Failed to fetch status counts")
      }
      const data = await response.json()

      if (data.success) {
        setStatusCounts(data.data.counts)
        setCustomers(data.data.customers)
        setLastUpdated(new Date())
      } else {
        throw new Error(data.message || "Failed to fetch status counts")
      }
    } catch (error) {
      console.error("Error fetching status counts:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStatusCounts()

    const refreshInterval = setInterval(
      () => {
        fetchStatusCounts()
      },
      5 * 60 * 1000,
    )

    return () => clearInterval(refreshInterval)
  }, [])

  const sortedCategories = useMemo(() => {
    if (!statusCounts) return []

    const categories = [
      { key: "exchange", title: "Exchange", icon: "🔄" },
      { key: "finance", title: "Finance", icon: "💰" },
      { key: "accessories", title: "Accessories", icon: "🔧" },
      { key: "coating", title: "Coating", icon: "🎨" },
      { key: "rto", title: "RTO", icon: "📝" },
      { key: "fastTag", title: "Fast Tag", icon: "🏷️" },
      { key: "insurance", title: "Insurance", icon: "🛡️" },
      { key: "autoCard", title: "Auto Card", icon: "💳" },
      { key: "extendedWarranty", title: "Extended Warranty", icon: "⏱️" },
      { key: "account", title: "Account", icon: "👤" },
      { key: "preDelivery", title: "Pre-Delivery", icon: "🔍" },
      { key: "gatePass", title: "Gate Pass", icon: "🚪" },
      { key: "securityClearance", title: "Security Clearance", icon: "🔒" },
    ]

    return categories.sort((a, b) => {
      const countA = statusCounts[a.key]?.Pending || 0
      const countB = statusCounts[b.key]?.Pending || 0
      return countB - countA
    })
  }, [statusCounts])

  const totalCounts = useMemo(() => {
    if (!statusCounts || !customers) return { pending: 0, approved: 0, rejected: 0, deliveryTotal: 0 }

    let pending = 0,
      approved = 0,
      rejected = 0

    Object.values(statusCounts).forEach((category) => {
      pending += category.Pending || 0
      approved += category.Approval || 0
      rejected += category.Rejected || 0
    })

    // Calculate delivery total
    const deliveryTotal = customers.filter(customer => {
      // Check mandatory process statuses
      const mandatoryStatuses = ['account', 'preDelivery', 'gatePass', 'securityClearance']
      const allMandatoryApproved = mandatoryStatuses.every(key => 
        customer.statuses[key] === 'Approval'
      )

      if (!allMandatoryApproved) return false

      // Check interested services
      const interestedServices = Object.entries(customer.interests)
        .filter(([_, value]) => value === 'YES')
        .map(([key]) => key)

      return interestedServices.every(serviceKey => 
        customer.statuses[serviceKey] === 'Approval'
      )
    }).length

    return { pending, approved, rejected, deliveryTotal }
  }, [statusCounts, customers])

  const renderStatusCategory = (categoryKey, title, icon) => {
    const data = statusCounts[categoryKey]
    if (!data) return null

    const pendingCount = data.Pending || 0
    const approvedCount = data.Approval || 0
    const rejectedCount = data.Rejected || 0
    const total = data.total || pendingCount + approvedCount + rejectedCount
    const isHighPriority = pendingCount > 5

    return (
      <div key={categoryKey} className={`status-category ${isHighPriority ? "high-priority" : ""}`}>
        <div className="category-header">
          <div className="category-title">
            <span className="category-icon">{icon}</span>
            <h3>{title}</h3>
          </div>
          <span className="total-count">{total}</span>
        </div>
        <div className="status-items">
          <div className={`status-item pending ${pendingCount > 0 ? "has-count" : ""}`}>
            <div className="content">
              <span className="count">{pendingCount}</span>
              <span className="label">
                <FiClock className="icon" /> Pending
              </span>
            </div>
            {isHighPriority && (
              <div className="priority-flag">
                <FiAlertTriangle /> Attention
              </div>
            )}
          </div>

          <div className={`status-item approved ${approvedCount > 0 ? "has-count" : ""}`}>
            <div className="content">
              <span className="count">{approvedCount}</span>
              <span className="label">
                <FiCheckCircle className="icon" /> Approved
              </span>
            </div>
          </div>

          <div className={`status-item rejected ${rejectedCount > 0 ? "has-count" : ""}`}>
            <div className="content">
              <span className="count">{rejectedCount}</span>
              <span className="label">
                <FiXCircle className="icon" /> Rejected
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading && !statusCounts) {
    return (
      <div className="status-count-card loading">
        <h2>Work Flow Status</h2>
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading status counts...</p>
        </div>
      </div>
    )
  }

  if (error && !statusCounts) {
    return (
      <div className="status-count-card error">
        <h2>Work Flow Status</h2>
        <div className="error-message">
          <FiAlertTriangle className="error-icon" />
          <p>{error}</p>
          <button onClick={fetchStatusCounts} className="retry-button">
            <FiRefreshCw /> Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="status-count-card">
      <div className="card-header">
        <h2>Work Flow Status</h2>
        <div className="header-actions">
          {isLoading ? (
            <div className="refreshing-indicator">
              <div className="spinner-small"></div> Refreshing...
            </div>
          ) : (
            <>
              <button onClick={fetchStatusCounts} className="refresh-button" disabled={isLoading}>
                <FiRefreshCw className={isLoading ? "rotating" : ""} /> Refresh
              </button>
              {lastUpdated && <div className="last-updated">Last updated: {lastUpdated.toLocaleTimeString()}</div>}
            </>
          )}
        </div>
      </div>

      <div className="status-summary">
        <div className="summary-item">
          <div className="summary-label">Total Pending</div>
          <div className="summary-count pending">{totalCounts.pending}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Total Approved</div>
          <div className="summary-count approved">{totalCounts.approved}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Total Rejected</div>
          <div className="summary-count rejected">{totalCounts.rejected}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Delivery Ready</div>
          <div className="summary-count total">{totalCounts.deliveryTotal}</div>
        </div>
      </div>

      <div className="status-grid">
        <div className="status-section">
          <h3 className="section-title">Services</h3>
          <div className="status-categories">
            {sortedCategories
              .filter((cat) =>
                [
                  "exchange",
                  "finance",
                  "accessories",
                  "coating",
                  "rto",
                  "fastTag",
                  "insurance",
                  "autoCard",
                  "extendedWarranty",
                ].includes(cat.key),
              )
              .map((cat) => renderStatusCategory(cat.key, cat.title, cat.icon))}
          </div>
        </div>

        <div className="status-section">
          <h3 className="section-title">Process Statuses</h3>
          <div className="status-categories">
            {sortedCategories
              .filter((cat) => ["account", "preDelivery", "gatePass", "securityClearance"].includes(cat.key))
              .map((cat) => renderStatusCategory(cat.key, cat.title, cat.icon))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatusCounts