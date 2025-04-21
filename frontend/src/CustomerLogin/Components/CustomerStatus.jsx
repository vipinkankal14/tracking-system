"use client"

import { useState } from "react"
import {
  CheckCircle,
  XCircle,
  Clock,
  Car,
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileText,
  Shield,
  Tag,
  Paintbrush,
  RefreshCw,
  PlusCircle,
  Info,
  Package,
  ClipboardList,
  User,
  Key,
} from "lucide-react"
import "../styles/customer-status.css"

// Status chip component for consistent status display
const StatusChip = ({ status, size = "small" }) => {
  let icon = <Clock className="status-chip-icon" />
  let colorClass = "default"
  let label = status || "Processing"

  switch (status?.toLowerCase()) {
    case "approval":
    case "ready":
    case "completed":
    case "paid":
    case "allocated":
      icon = <CheckCircle className="status-chip-icon" />
      colorClass = "success"
      label = status === "ready" ? "Ready for Delivery" : label
      break

    case "pending":
    case "in process":
    case "processing":
      icon = <Clock className="status-chip-icon" />
      colorClass = "warning"
      break

    case "rejected":
    case "overdue":
    case "delayed":
    case "not ready":
      icon = <XCircle className="status-chip-icon" />
      colorClass = "error"
      break

    case "not applied":
    case "not requested":
      icon = <Info className="status-chip-icon" />
      colorClass = "default"
      label = "Not Applied"
      break

    default:
      break
  }

  return (
    <span className={`status-chip ${colorClass} ${size}`}>
      {icon}
      <span>{label}</span>
    </span>
  )
}

// Progress indicator component
const ProgressIndicator = ({ steps, currentStep, stepDetails }) => {
  const progress = (currentStep / steps) * 100

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-text">
          Progress ({currentStep} of {steps} steps completed)
        </span>
        <span className="progress-text">{Math.round(progress)}% complete</span>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Display step details */}
      <div className="progress-steps">
        {stepDetails?.map((step) => (
          <div key={step.id} className={`progress-step ${step.completed ? "completed" : ""}`}>
             <span className="step-name">{step.name}</span>
            <StatusChip status={step.status} size="small" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Collapsible section component
const CollapsibleSection = ({ title, icon, children, defaultExpanded = true }) => {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className="collapsible-section">
      <div className="collapsible-header" onClick={() => setExpanded(!expanded)}>
        <div className="collapsible-title-container">
          <span className="collapsible-icon">{icon}</span>
          <h3 className="collapsible-title">{title}</h3>
        </div>
        <button className="collapsible-toggle">{expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>
      </div>
      {expanded && <div className="collapsible-content">{children}</div>}
    </div>
  )
}

// Status item component
const StatusItem = ({ icon, title, status, date, amount }) => {
  return (
    <div className="status-item">
      <div className="status-item-content">
        <div className="status-item-header">
          <span className="status-item-icon">{icon}</span>
          <h4 className="status-item-title">{title}</h4>
        </div>
        <div className="status-item-details">
          <StatusChip status={status} />
          {amount && <span className="status-item-amount">₹{amount.toLocaleString("en-IN")}</span>}
        </div>
        {date && (
          <span className="status-item-date">
            {status?.toLowerCase() === "approval" || status?.toLowerCase() === "paid"
              ? `Approved on: ${new Date(date).toLocaleDateString()} at ${new Date(date).toLocaleTimeString()}`
              : `Last updated: ${new Date(date).toLocaleDateString()}`}
          </span>
        )}
      </div>
    </div>
  )
}

// Main CustomerStatus component
const CustomerStatus = ({ userData }) => {
  const {
    loans = [],
    carexchangerequests = [],
    RTORequests = [],
    fasttagRequests = [],
    insuranceRequests = [],
    autocardRequests = [],
    extendedWarrantyRequests = [],
    coatingRequests = [],
    invoiceInfo = {},
    predeliveryinspection = [],
    gate_pass = [],
    additional_info = {},
    management_security_clearance = [],
    account_management = {},
    stockInfo = [],
  } = userData || {}

  // Calculate delivery status
  const getDeliveryStatus = () => {
    const pdiStatus = predeliveryinspection[0]?.status?.toLowerCase()
    const gateStatus = gate_pass[0]?.status?.toLowerCase()

    if (pdiStatus === "rejected" || gateStatus === "rejected") {
      return { status: "rejected", label: "Delivery Delayed" }
    }

    if (pdiStatus === "approval" && gateStatus === "approval") {
      return { status: "ready", label: "Ready for Delivery" }
    }
    return { status: "pending", label: "In Process" }
  }

  // Calculate payment status
  const getPaymentStatus = () => {
    const status = invoiceInfo?.payment_status?.toLowerCase() || "pending"
    return {
      status,
      label: status.charAt(0).toUpperCase() + status.slice(1),
    }
  }

  const calculateProgress = () => {
    // Define all possible steps with their names
    const allSteps = [
      { id: "payment", name: "Payment Completion", required: true },
      { id: "account", name: "Account Management", required: true },
      { id: "stock", name: "Stock Allocation", required: true },
      { id: "pdi", name: "Pre-Delivery Inspection", required: true },
      { id: "gatePass", name: "Gate Pass Approval", required: true },
      { id: "security", name: "Security Clearance", required: true },
      { id: "finance", name: "Finance Approval", required: additional_info?.finance === "YES" },
      { id: "exchange", name: "Car Exchange Approval", required: additional_info?.exchange === "YES" },
    ]

    // Filter to get only the required steps
    const requiredSteps = allSteps.filter((step) => step.required)
    const totalSteps = requiredSteps.length
    let completedSteps = 0

    // Check completion status for each required step
    const stepsWithStatus = requiredSteps.map((step) => {
      let isCompleted = false

      switch (step.id) {
        case "payment":
          isCompleted = invoiceInfo?.payment_status?.toLowerCase() === "paid"
          break
        case "account":
          isCompleted = account_management?.status?.toLowerCase() === "approval"
          break
        case "stock":
          isCompleted = stockInfo?.allotmentStatus?.toLowerCase() === "allocated"
          break
        case "pdi":
          isCompleted = predeliveryinspection[0]?.status?.toLowerCase() === "approval"
          break
        case "gatePass":
          isCompleted = gate_pass[0]?.status?.toLowerCase() === "approval"
          break
        case "security":
          isCompleted = management_security_clearance[0]?.status?.toLowerCase() === "approval"
          break
        case "finance":
          isCompleted = loans[0]?.status?.toLowerCase() === "approval"
          break
        case "exchange":
          isCompleted = carexchangerequests[0]?.status?.toLowerCase() === "approval"
          break
      }

      if (isCompleted) completedSteps++

      return {
        ...step,
        completed: isCompleted,
        // Add additional status info if needed
        status: getStatusForStep(step.id),
      }
    })

    return {
      total: totalSteps,
      completed: completedSteps,
      steps: stepsWithStatus, // Include detailed step information
    }
  }

  // Helper function to get status for each step
  const getStatusForStep = (stepId) => {
    switch (stepId) {
      case "payment":
        return invoiceInfo?.payment_status || "pending"
      case "account":
        return account_management?.status || "pending"
      case "stock":
        return stockInfo?.allotmentStatus || "pending"
      case "pdi":
        return predeliveryinspection[0]?.status || "pending"
      case "gatePass":
        return gate_pass[0]?.status || "pending"
      case "security":
        return management_security_clearance[0]?.status || "pending"
      case "finance":
        return loans[0]?.status || (additional_info?.finance === "YES" ? "pending" : "not applied")
      case "exchange":
        return carexchangerequests[0]?.status || (additional_info?.exchange === "YES" ? "pending" : "not applied")
      default:
        return "pending"
    }
  }

  // Generate service status items
  const generateServiceStatusItems = () => {
    const items = []

    // Finance status
    items.push({
      id: "finance",
      title: "Finance",
      icon: <CreditCard size={16} />,
      status: loans.length > 0 ? loans[0].status : additional_info?.finance === "YES" ? "Pending" : "Not Applied",
      date: loans.length > 0 ? loans[0].updatedAt : null,
      amount: loans.length > 0 ? loans[0].loan_amount : null,
    })

    // Car Exchange status
    items.push({
      id: "exchange",
      title: "Car Exchange",
      icon: <Car size={16} />,
      status:
        carexchangerequests.length > 0
          ? carexchangerequests[0].status
          : additional_info?.exchange === "YES"
            ? "Pending"
            : "Not Applied",
      date: carexchangerequests.length > 0 ? carexchangerequests[0].updatedAt : null,
      amount: carexchangerequests.length > 0 ? carexchangerequests[0].exchangeAmount : null,
    })

    // RTO status
    items.push({
      id: "rto",
      title: "RTO",
      icon: <FileText size={16} />,
      status:
        RTORequests.length > 0 ? RTORequests[0].status : additional_info?.rto === "YES" ? "Pending" : "Not Applied",
      date: RTORequests.length > 0 ? RTORequests[0].updatedAt : null,
      amount: RTORequests.length > 0 ? RTORequests[0].rto_amount : null,
    })

    // Insurance status
    items.push({
      id: "insurance",
      title: "Insurance",
      icon: <Shield size={16} />,
      status:
        insuranceRequests.length > 0
          ? insuranceRequests[0].status
          : additional_info?.insurance === "YES"
            ? "Pending"
            : "Not Applied",
      date: insuranceRequests.length > 0 ? insuranceRequests[0].updatedAt : null,
      amount: insuranceRequests.length > 0 ? insuranceRequests[0].insurance_amount : null,
    })

    // FastTag status
    items.push({
      id: "fasttag",
      title: "FastTag",
      icon: <Tag size={16} />,
      status:
        fasttagRequests.length > 0
          ? fasttagRequests[0].status
          : additional_info?.fast_tag === "YES"
            ? "Pending"
            : "Not Applied",
      date: fasttagRequests.length > 0 ? fasttagRequests[0].updatedAt : null,
      amount: fasttagRequests.length > 0 ? fasttagRequests[0].fasttag_amount : null,
    })

    // Coating status
    items.push({
      id: "coating",
      title: "Coating",
      icon: <Paintbrush size={16} />,
      status:
        coatingRequests.length > 0
          ? coatingRequests[0].status
          : additional_info?.coating === "YES"
            ? "Pending"
            : "Not Applied",
      date: coatingRequests.length > 0 ? coatingRequests[0].updatedAt : null,
      amount: coatingRequests.length > 0 ? coatingRequests[0].coating_amount : null,
    })

    // Extended Warranty status
    items.push({
      id: "warranty",
      title: "Extended Warranty",
      icon: <RefreshCw size={16} />,
      status:
        extendedWarrantyRequests.length > 0
          ? extendedWarrantyRequests[0].status
          : additional_info?.extended_warranty === "YES"
            ? "Pending"
            : "Not Applied",
      date: extendedWarrantyRequests.length > 0 ? extendedWarrantyRequests[0].updatedAt : null,
      amount: extendedWarrantyRequests.length > 0 ? extendedWarrantyRequests[0].extendedwarranty_amount : null,
    })

    // Auto Card status
    items.push({
      id: "AutoCard",
      title: "Auto Card",
      icon: <PlusCircle size={16} />,
      status:
        autocardRequests.length > 0
          ? autocardRequests[0].status
          : additional_info?.auto_card === "YES"
            ? "Pending"
            : "Not Applied",
      date: autocardRequests.length > 0 ? autocardRequests[0].updatedAt : null,
      amount: autocardRequests.length > 0 ? autocardRequests[0].autocard_amount : null,
    })

    return items
  }

  // Calculate values
  const progress = calculateProgress()
  const serviceItems = generateServiceStatusItems()
  const deliveryStatus = getDeliveryStatus()
  const paymentStatus = getPaymentStatus()

  return (
    <div className="status-dashboard">
      {/* Background decorative elements */}
      <div className="decorative-blob-1"></div>
      <div className="decorative-blob-2"></div>

      <div className="dashboard-content">
        <h2 className="dashboard-title">Purchase Status Overview</h2>

        <ProgressIndicator steps={progress.total} currentStep={progress.completed} stepDetails={progress.steps} />

        <div className="status-grid">
          {/* Delivery Status Card */}
          <div className="status-card">
            <div className="status-card-header">
              <h3 className="status-card-title">Delivery Status</h3>
              <StatusChip status={deliveryStatus.status} />
            </div>
            {gate_pass[0]?.updatedAt && (
              <p className="status-card-date">
                {deliveryStatus.status === "ready"
                  ? `Ready since: ${new Date(gate_pass[0].updatedAt).toLocaleDateString()}`
                  : `Last updated: ${new Date(gate_pass[0].updatedAt).toLocaleDateString()}`}
              </p>
            )}
          </div>

          {/* Security Clearance Card */}
          <div className="status-card">
            <div className="status-card-header">
              <h3 className="status-card-title">Security Clearance</h3>
              <StatusChip status={management_security_clearance[0]?.status || "pending"} />
            </div>
            <p className="status-card-date">
              {management_security_clearance[0]?.updatedAt
                ? management_security_clearance[0]?.status?.toLowerCase() === "approval"
                  ? `Approved on: ${new Date(management_security_clearance[0].updatedAt).toLocaleDateString()}`
                  : `Last updated: ${new Date(management_security_clearance[0].updatedAt).toLocaleDateString()}`
                : "Update not available"}
            </p>
          </div>

          {/* Customer Payment Card */}
          <div className="status-card">
            <div className="status-card-header">
              <h3 className="status-card-title">Customer Payment</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="status-card-value">
                  ₹{invoiceInfo?.customer_account_balance?.toLocaleString("en-IN") || "0"}
                </span>
                <StatusChip status={paymentStatus.status} />
              </div>
            </div>
            <p className="status-card-date">
              {invoiceInfo?.inv_updatedAt
                ? paymentStatus.status.toLowerCase() === "paid"
                  ? `Paid on: ${new Date(invoiceInfo.inv_updatedAt).toLocaleDateString()}`
                  : `Last updated: ${new Date(invoiceInfo.inv_updatedAt).toLocaleDateString()}`
                : "Update date not available"}
            </p>
          </div>

          {/* Invoice Amount Card */}
          <div className="status-card">
            <div className="status-card-header">
              <h3 className="status-card-title">Invoice Amount</h3>
              <span className="status-card-value">₹{invoiceInfo?.grand_total?.toLocaleString("en-IN") || "0"}</span>
            </div>
            <p className="status-card-date">
              Invoice Date: {invoiceInfo.invoice_date ? new Date(invoiceInfo.invoice_date).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>

        <CollapsibleSection title="Core Process Status" icon={<ClipboardList size={20} />} defaultExpanded={true}>
          <div className="status-grid">
            <StatusItem
              icon={<User size={16} />}
              title="Account Management"
              status={account_management?.status || "Pending"}
              date={account_management?.updatedAt}
            />
            <StatusItem
              icon={<Package size={16} />}
              title="Stock Allocation"
              status={stockInfo?.allotmentStatus || "Pending"}
              date={stockInfo?.allotmentStatus === "Allocated" ? stockInfo?.updatedAt : null}
            />
            <StatusItem
              icon={<ClipboardList size={16} />}
              title="Pre-Delivery Inspection"
              status={predeliveryinspection[0]?.status || "Pending"}
              date={predeliveryinspection[0]?.updatedAt}
            />
            <StatusItem
              icon={<Key size={16} />}
              title="Gate Pass"
              status={gate_pass[0]?.status || "Pending"}
              date={gate_pass[0]?.updatedAt}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Additional Services" icon={<Car size={20} />} defaultExpanded={true}>
          <div className="status-grid">
            {serviceItems.map((item) => (
              <StatusItem key={item.id} {...item} />
            ))}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  )
}

export default CustomerStatus
