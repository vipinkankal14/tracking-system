 import PaymentSummary from "../Account/PaymentSummary/PaymentSummary"
import "./OwnerAdmin.css"
import StatusCounts from "./SatusCounts"

const OwnerAdmin = () => {
  return (
    <div className="owner-admin-container">
      <header className="admin-header">
        <h1>Owner Dashboard</h1>
      </header>

      <div className="dashboard-grid">
        <section>
           <PaymentSummary />
        </section>

        <section className="status-counts-section">
          <StatusCounts />
        </section>
      </div>
    </div>
  )
}

export default OwnerAdmin
