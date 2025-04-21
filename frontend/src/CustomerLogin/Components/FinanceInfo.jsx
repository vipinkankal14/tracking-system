"use client"

import { useState, useRef, useEffect } from "react"
import "./finance-info.css"

// Helper function for document details
const getDocumentDetails = (documentPath) => {
  if (!documentPath) return { customerId: null, fileName: null }

  const fullPath = documentPath.replace(/\\/g, "/")
  const pathParts = fullPath.split("/")
  const customerId = pathParts[pathParts.length - 2]
  const fileName = pathParts[pathParts.length - 1]

  return { customerId, fileName }
}

// PDF Modal Component
const PDFModal = ({ isOpen, onClose, documentUrl, title }) => {
  const modalRef = useRef(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose()
    }

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.addEventListener("mousedown", handleClickOutside)
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = "hidden"

      // Focus trap - focus the modal when it opens
      modalRef.current?.focus()
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  // Handle loading state
  const handleLoad = () => setLoading(false)
  const handleError = () => setLoading(false)

  if (!isOpen) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content" ref={modalRef} tabIndex="-1">
        <div className="modal-header">
          <h2 id="modal-title">{title || "Document Viewer"}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close document viewer">
            ×
          </button>
        </div>
        <div className="modal-body">
          {loading && <div className="loading-indicator">Loading document...</div>}
          <iframe
            src={documentUrl}
            title="PDF Document Viewer"
            className="pdf-iframe"
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
        <div className="modal-footer">
          <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="download-btn">
            Download Document
          </a>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Status Chip Component
const StatusChip = ({ status }) => {
  const getStatusClass = (status) => {
    if (!status) return "status-default"
    switch (status.toLowerCase()) {
      case "approved":
        return "status-success"
      case "pending":
        return "status-warning"
      case "rejected":
        return "status-error"
      default:
        return "status-default"
    }
  }

  return <span className={`status-chip ${getStatusClass(status)}`}>{status || "Processing"}</span>
}

// Document Card Component
const DocumentCard = ({ title, document, onClick }) => {
  if (!document) return null

  const { customerId, fileName } = getDocumentDetails(document)
  const documentUrl = fileName ? `http://localhost:5000/uploads/${customerId}/${encodeURIComponent(fileName)}` : null

  return (
    <div className="document-card">
      <div className="document-card-content">
        <div className="document-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div className="document-info">
          <div className="document-title">{title}</div>
          {documentUrl ? (
            <button
              className="view-document-btn"
              onClick={() => onClick(documentUrl, title)}
              aria-label={`View ${title} document`}
            >
              View Document
            </button>
          ) : (
            <span className="document-na">N/A</span>
          )}
        </div>
      </div>
    </div>
  )
}

// Main FinanceInfo Component
const FinanceInfo = ({ userData }) => {
  const { loans = [], additional_info = {}, carexchangerequests = [] } = userData || {}
  const [modalOpen, setModalOpen] = useState(false)
  const [currentDocument, setCurrentDocument] = useState({ url: "", title: "" })

  const hasFinance = additional_info?.finance === "YES"
  const hasExchange = additional_info?.exchange === "YES"

  const openModal = (url, title) => {
    setCurrentDocument({ url, title })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const renderLoanDocuments = (documents = []) => {
    if (documents.length === 0) return null

    return (
      <div className="documents-section">
        <h4 className="section-subtitle">Submitted Documents</h4>
        <div className="documents-grid">
          {documents.map((doc, docIndex) => {
            const { customerId, fileName } = getDocumentDetails(doc.document_path)
            const documentUrl = fileName
              ? `http://localhost:5000/uploads/${customerId}/${encodeURIComponent(fileName)}`
              : null

            return (
              <div className="document-card-wrapper" key={doc.id || `loan-doc-${docIndex}`}>
                <div className="document-card">
                  <div className="document-card-content">
                    <div className="document-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div className="document-info">
                      <div className="document-title">{doc.document_name || `Document ${docIndex + 1}`}</div>
                      <div className="document-meta">
                        Type: {doc.employed_type || "N/A"} • Uploaded:{" "}
                        {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : "N/A"}
                      </div>
                      {documentUrl && (
                        <button
                          className="view-document-btn"
                          onClick={() => openModal(documentUrl, doc.document_name || `Document ${docIndex + 1}`)}
                          aria-label={`View ${doc.document_name || `Document ${docIndex + 1}`}`}
                        >
                          View Document
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderExchangeDocuments = (exchange) => {
    if (!exchange) return null

    return (
      <div className="documents-section">
        <h4 className="section-subtitle">Submitted Documents</h4>
        <div className="documents-grid">
          {exchange.rcDocument && (
            <div className="document-card-wrapper">
              <DocumentCard 
                title="RC Document" 
                document={exchange.rcDocument} 
                onClick={openModal}
              />
            </div>
          )}
          {exchange.insurance_Policy && (
            <div className="document-card-wrapper">
              <DocumentCard 
                title="Insurance Policy" 
                document={exchange.insurance_Policy} 
                onClick={openModal}
              />
            </div>
          )}
          {exchange.pucCertificate && (
            <div className="document-card-wrapper">
              <DocumentCard 
                title="PUC Certificate" 
                document={exchange.pucCertificate} 
                onClick={openModal}
              />
            </div>
          )}
          {exchange.identityProof && (
            <div className="document-card-wrapper">
              <DocumentCard 
                title="Identity Proof" 
                document={exchange.identityProof} 
                onClick={openModal}
              />
            </div>
          )}
          {exchange.addressProof && (
            <div className="document-card-wrapper">
              <DocumentCard 
                title="Address Proof" 
                document={exchange.addressProof} 
                onClick={openModal}
              />
            </div>
          )}
          {exchange.loan && (
            <div>
                onClick={openModal}
            
            </div>
          )}
          {exchange.loanClearance && (
            <div className="document-card-wrapper">
              <DocumentCard 
                title="Loan Clearance" 
                document={exchange.loanClearance} 
                onClick={openModal}
              />
            </div>
          )}
          {exchange.serviceHistory && (
            <div className="document-card-wrapper">
              <DocumentCard 
                title="Service History" 
                document={exchange.serviceHistory} 
                onClick={openModal}
              />
            </div>
          )}
        </div>
    </div>
    )
  }

  const renderLoanInfo = () => {
    if (!hasFinance) {
      return (
        <div className="alert info">
          <p>No financing has been requested for this vehicle.</p>
        </div>
      )
    }

    if (loans.length === 0) {
      return (
        <div className="alert info">
          <p>Loan information is not available yet.</p>
        </div>
      )
    }

    return loans.map((loan, index) => (
      <div className="loan-item" key={loan.id || `loan-${index}`}>
        <div className="section-header">
          <h3 className="section-subtitle">Loan #{index + 1}</h3>
          <StatusChip status={loan.status} />
        </div>
        <hr className="divider" />

        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Loan Amount</span>
            <span className="info-value">₹{(loan.loan_amount || 0).toLocaleString("en-IN")}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Interest Rate</span>
            <span className="info-value">{loan.interest_rate ? `${loan.interest_rate}%` : "N/A"}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Loan Duration</span>
            <span className="info-value">{loan.loan_duration ? `${loan.loan_duration} months` : "N/A"}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Monthly EMI</span>
            <span className="info-value">₹{(loan.calculated_emi || 0).toLocaleString("en-IN")}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Application Date</span>
            <span className="info-value">
              {loan.created_at ? new Date(loan.created_at).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>

        {loan.financeReason && loan.status?.toLowerCase() === "rejected" && (
          <div className="remarks-box">
            <span className="info-label">Remarks</span>
            <p>{loan.financeReason}</p>
          </div>
        )}

        {renderLoanDocuments(loan.documents)}
      </div>
    ))
  }

  const renderExchangeInfo = () => {
    if (!hasExchange) {
      return (
        <div className="alert info">
          <p>No car exchange has been requested.</p>
        </div>
      )
    }

    if (carexchangerequests.length === 0) {
      return (
        <div className="alert info">
          <p>Exchange vehicle information is not available yet.</p>
        </div>
      )
    }

    return carexchangerequests.map((exchange, index) => (
      <div className="exchange-item" key={exchange.id || `exchange-${index}`}>
        <div className="section-header">
          <h3 className="section-subtitle">Exchange Vehicle #{index + 1}</h3>
          <StatusChip status={exchange.status} />
        </div>
        <hr className="divider" />

        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Owner Name</span>
            <span className="info-value">{exchange.carOwnerFullName || "N/A"}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Make</span>
            <span className="info-value">{exchange.carMake || "N/A"}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Model</span>
            <span className="info-value">{exchange.carModel || "N/A"}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Color</span>
            <span className="info-value">{exchange.carColor || "N/A"}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Registration</span>
            <span className="info-value">{exchange.carRegistration || "N/A"}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Year</span>
            <span className="info-value">{exchange.carYear || "N/A"}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Exchange Amount</span>
            <span className="info-value">₹{(exchange.exchangeAmount || 0).toLocaleString("en-IN")}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Application Date</span>
            <span className="info-value">
              {exchange.createdAt ? new Date(exchange.createdAt).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>

        {exchange.exchangeReason && exchange.status?.toLowerCase() === "rejected" && (
          <div className="remarks-box">
            <span className="info-label">Remarks</span>
            <p>{exchange.exchangeReason}</p>
          </div>
        )}

        {renderExchangeDocuments(exchange)}
      </div>
    ))
  }

  return (
    <div className="finance-info">
      <div className="info-section">
        <h2 className="section-title">Loan Information</h2>
        <p className="section-description">Details about the vehicle financing</p>
        {renderLoanInfo()}
      </div>

      <div className="info-section">
        <h2 className="section-title">Car Exchange Information</h2>
        <p className="section-description">Details about the exchange vehicle</p>
        {renderExchangeInfo()}
      </div>

      {/* PDF Modal */}
      <PDFModal
        isOpen={modalOpen}
        onClose={closeModal}
        documentUrl={currentDocument.url}
        title={currentDocument.title}
      />
    </div>
  )
}

export default FinanceInfo
