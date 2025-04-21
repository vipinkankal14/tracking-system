import React, { useState, useRef, useEffect } from "react";
import "../Components/DocumentsView.scss";

// Helper function for document details
const getDocumentDetails = (documentPath) => {
  if (!documentPath) return { customerId: null, fileName: null };

  const fullPath = documentPath.replace(/\\/g, "/");
  const pathParts = fullPath.split("/");
  const customerId = pathParts[pathParts.length - 2];
  const fileName = pathParts[pathParts.length - 1];

  return { customerId, fileName };
};

// PDF Modal Component
const PDFModal = ({ isOpen, onClose, documentUrl, title }) => {
  const modalRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = "hidden";

      // Focus trap - focus the modal when it opens
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Handle loading state
  const handleLoad = () => setLoading(false);
  const handleError = () => setLoading(false);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content" ref={modalRef} tabIndex="-1">
        <div className="modal-header">
          <h2 id="modal-title">{title || "Document Viewer"}</h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close document viewer"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {loading && (
            <div className="loading-indicator">Loading document...</div>
          )}
          <iframe
            src={documentUrl}
            title="PDF Document Viewer"
            className="pdf-iframe"
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
        <div className="modal-footer">
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="download-btn"
          >
            Download Document
          </a>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Document Card Component
const DocumentCard = ({ title, document, subtitle, type, onClick }) => {
  if (!document) return null;

  // Get icon based on document type
  const getIcon = () => {
    switch (type) {
      case "loan":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        );
      case "rto":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" />
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
            <path d="M12 17.5v.5" />
            <path d="M12 6.5v.5" />
          </svg>
        );
      case "finance":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
            <line x1="7" y1="15" x2="7" y2="15" />
            <line x1="12" y1="15" x2="12" y2="15" />
            <line x1="17" y1="15" x2="17" y2="15" />
          </svg>
        );
      case "exchange":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 9l4-4 4 4" />
            <path d="M3 5h10v4" />
            <path d="M19 15l-4 4-4-4" />
            <path d="M21 19H11v-4" />
          </svg>
        );
      case "fastag":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
            <path d="M21.2 8A10 10 0 0 0 17 3.2" />
            <path d="M12 2a10 10 0 0 0-7 17.1" />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        );
    }
  };

  const { customerId, fileName } = getDocumentDetails(document);
  const documentUrl = fileName
    ? `http://localhost:5000/uploads/${customerId}/${encodeURIComponent(
        fileName
      )}`
    : null;

  return (
    <div className="document-card">
      <div className="document-card-content">
        <div className={`document-icon ${type}`}>{getIcon()}</div>
        <div className="document-info">
          <div className="document-title">{title}</div>
          {subtitle && <div className="document-subtitle">{subtitle}</div>}
          {documentUrl && (
            <button
              className="view-document-btn"
              onClick={() => onClick(documentUrl, title)}
              aria-label={`View ${title}`}
            >
              View Document
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Document Section Component
const DocumentSection = ({ title, icon, children, defaultExpanded = true }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="document-section">
      <div className="section-header" onClick={() => setExpanded(!expanded)}>
        <div className="section-title-container">
          <div className="section-icon">{icon}</div>
          <h3 className="section-title">{title}</h3>
        </div>
        <button
          className="toggle-btn"
          aria-expanded={expanded}
          aria-label={expanded ? `Collapse ${title}` : `Expand ${title}`}
        >
          {expanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 15l-6-6-6 6" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          )}
        </button>
      </div>
      <hr className="divider" />
      {expanded && (
        <div className="section-content">
          <div className="documents-grid">{children}</div>
        </div>
      )}
    </div>
  );
};

// Main DocumentsInfo Component
const DocumentsInfo = ({ userData }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState({
    url: "",
    title: "",
  });

  const {
    loans = [],
    carexchangerequests = [],
    RTORequests = [],
    fasttagRequests = [],
    insuranceRequests = [],
    autocardRequests = [],
    extendedWarrantyRequests = [],
    coatingRequests = [],
  } = userData || {};

  // Check if there are any documents
  const hasLoanDocs = loans.some((loan) => loan.documents?.length > 0);
  const hasExchangeDocs = carexchangerequests.some(
    (ex) =>
      ex.rcDocument ||
      ex.insurancePolicy ||
      ex.pucCertificate ||
      ex.identityProof ||
      ex.addressProof ||
      ex.loanClearance ||
      ex.serviceHistory
  );
  const hasRTODocs = RTORequests.some(
    (rto) =>
      rto.form20 ||
      rto.form21 ||
      rto.form22 ||
      rto.form34 ||
      rto.invoice ||
      rto.insurance ||
      rto.puc ||
      rto.idProof ||
      rto.roadTax ||
      rto.tempReg
  );
  const hasFastTagDocs = fasttagRequests.some(
    (tag) =>
      tag.rcDocument ||
      tag.panDocument ||
      tag.passportPhoto ||
      tag.aadhaarDocument
  );
  const hasInsuranceDocs = insuranceRequests.some(
    (ins) =>
      ins.rcDocument ||
      ins.salesInvoice ||
      ins.identityProof ||
      ins.addressProof ||
      ins.form21 ||
      ins.form22 ||
      ins.tempReg ||
      ins.puc ||
      ins.loanDocuments
  );
  const hasAutocardDocs = autocardRequests.length > 0;
  const hasWarrantyDocs = extendedWarrantyRequests.length > 0;
  const hasCoatingDocs = coatingRequests.length > 0;

  const hasAnyDocuments =
    hasLoanDocs ||
    hasExchangeDocs ||
    hasRTODocs ||
    hasFastTagDocs ||
    hasInsuranceDocs ||
    hasAutocardDocs ||
    hasWarrantyDocs ||
    hasCoatingDocs;

  const openModal = (url, title) => {
    setCurrentDocument({ url, title });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Icons for document sections
  const loanIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon-primary"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="7" y1="15" x2="7" y2="15" />
      <line x1="12" y1="15" x2="12" y2="15" />
      <line x1="17" y1="15" x2="17" y2="15" />
    </svg>
  );

  const exchangeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon-primary"
    >
      <path d="M5 9l4-4 4 4" />
      <path d="M3 5h10v4" />
      <path d="M19 15l-4 4-4-4" />
      <path d="M21 19H11v-4" />
    </svg>
  );

  const rtoIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon-primary"
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17.5v.5" />
      <path d="M12 6.5v.5" />
    </svg>
  );

  const fastagIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon-primary"
    >
      <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
      <path d="M21.2 8A10 10 0 0 0 17 3.2" />
      <path d="M12 2a10 10 0 0 0-7 17.1" />
    </svg>
  );

  const insuranceIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon-primary"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );

  return (
    <div className="documents-info">
      <div className="info-section">
        <h2 className="section-title">Documents Center</h2>
        <p className="section-description">
          All submitted documents organized by category
        </p>

        {!hasAnyDocuments && (
          <div className="alert info">
            <p>No documents have been submitted yet.</p>
          </div>
        )}

        {hasLoanDocs && (
          <DocumentSection title="Loan Documents" icon={loanIcon}>
            {loans.map((loan, loanIndex) => (
              <React.Fragment key={`loan-${loanIndex}`}>
                {loan.documents?.map((doc, docIndex) => (
                  <DocumentCard
                    key={`loan-${loanIndex}-doc-${docIndex}`}
                    title={doc.document_name || `Loan Document ${docIndex + 1}`}
                    document={doc.document_path}
                    subtitle={`Type: ${doc.employed_type || "N/A"}`}
                    type="loan"
                    onClick={openModal}
                  />
                ))}
              </React.Fragment>
            ))}
          </DocumentSection>
        )}

        {hasExchangeDocs && (
          <DocumentSection title="Exchange Documents" icon={exchangeIcon}>
            {carexchangerequests.map((exchange, exIndex) => (
              <React.Fragment key={`exchange-${exIndex}`}>
                {exchange.rcDocument && (
                  <DocumentCard
                    title="RC Document"
                    document={exchange.rcDocument}
                    subtitle={`Exchange #${exIndex + 1}`}
                    type="exchange"
                    onClick={openModal}
                  />
                )}
                {exchange.insurancePolicy && (
                  <DocumentCard
                    title="Insurance Policy"
                    document={exchange.insurancePolicy}
                    subtitle={`Exchange #${exIndex + 1}`}
                    type="exchange"
                    onClick={openModal}
                  />
                )}
                {exchange.pucCertificate && (
                  <DocumentCard
                    title="PUC Certificate"
                    document={exchange.pucCertificate}
                    subtitle={`Exchange #${exIndex + 1}`}
                    type="exchange"
                    onClick={openModal}
                  />
                )}
                {exchange.identityProof && (
                  <DocumentCard
                    title="Identity Proof"
                    document={exchange.identityProof}
                    subtitle={`Exchange #${exIndex + 1}`}
                    type="exchange"
                    onClick={openModal}
                  />
                )}
                {exchange.addressProof && (
                  <DocumentCard
                    title="Address Proof"
                    document={exchange.addressProof}
                    subtitle={`Exchange #${exIndex + 1}`}
                    type="exchange"
                    onClick={openModal}
                  />
                )}
                {exchange.loanClearance && (
                  <DocumentCard
                    title="Loan Clearance"
                    document={exchange.loanClearance}
                    subtitle={`Exchange #${exIndex + 1}`}
                    type="exchange"
                    onClick={openModal}
                  />
                )}
                {exchange.serviceHistory && (
                  <DocumentCard
                    title="Service History"
                    document={exchange.serviceHistory}
                    subtitle={`Exchange #${exIndex + 1}`}
                    type="exchange"
                    onClick={openModal}
                  />
                )}
              </React.Fragment>
            ))}
          </DocumentSection>
        )}

        {hasRTODocs && (
          <DocumentSection title="RTO Documents" icon={rtoIcon}>
            {RTORequests.map((rto, rtoIndex) => (
              <React.Fragment key={`rto-${rtoIndex}`}>
                {rto.form20 && (
                  <DocumentCard
                    title="Form 20"
                    document={rto.form20}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                    onClick={openModal}
                  />
                )}
                {rto.form21 && (
                  <DocumentCard
                    title="Form 21"
                    document={rto.form21}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                    onClick={openModal}
                  />
                )}
                {rto.form22 && (
                  <DocumentCard
                    title="Form 22"
                    document={rto.form22}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                    onClick={openModal}
                  />
                )}
                {rto.form34 && (
                  <DocumentCard
                    title="Form 34"
                    document={rto.form34}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                    onClick={openModal}
                  />
                )}
                {rto.invoice && (
                  <DocumentCard
                    title="Invoice"
                    document={rto.invoice}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                    onClick={openModal}
                  />
                )}
                {rto.insurance && (
                  <DocumentCard
                    title="Insurance"
                    document={rto.insurance}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                    onClick={openModal}
                  />
                )}
                {rto.puc && (
                  <DocumentCard
                    title="PUC"
                    document={rto.puc}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                    onClick={openModal}
                  />
                )}
                {rto.idProof && (
                  <DocumentCard
                    title="ID Proof"
                    document={rto.idProof}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                    onClick={openModal}
                  />
                )}
                {rto.roadTax && (
                  <DocumentCard
                    title="Road Tax"
                    document={rto.roadTax}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                    onClick={openModal}
                  />
                )}
                {rto.tempReg && (
                  <DocumentCard
                    title="Temp Registration"
                    document={rto.tempReg}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                    onClick={openModal}
                  />
                )}
              </React.Fragment>
            ))}
          </DocumentSection>
        )}

        {hasFastTagDocs && (
          <DocumentSection title="FASTag Documents" icon={fastagIcon}>
            {fasttagRequests.map((tag, tagIndex) => (
              <React.Fragment key={`fastag-${tagIndex}`}>
                {tag.rcDocument && (
                  <DocumentCard
                    title="RC Document"
                    document={tag.rcDocument}
                    subtitle={`FASTag Request #${tagIndex + 1}`}
                    type="fastag"
                    onClick={openModal}
                  />
                )}
                {tag.panDocument && (
                  <DocumentCard
                    title="PAN Card"
                    document={tag.panDocument}
                    subtitle={`FASTag Request #${tagIndex + 1}`}
                    type="fastag"
                    onClick={openModal}
                  />
                )}
                {tag.passportPhoto && (
                  <DocumentCard
                    title="Passport Photo"
                    document={tag.passportPhoto}
                    subtitle={`FASTag Request #${tagIndex + 1}`}
                    type="fastag"
                    onClick={openModal}
                  />
                )}
                {tag.aadhaarDocument && (
                  <DocumentCard
                    title="Aadhaar Card"
                    document={tag.aadhaarDocument}
                    subtitle={`FASTag Request #${tagIndex + 1}`}
                    type="fastag"
                    onClick={openModal}
                  />
                )}
              </React.Fragment>
            ))}
          </DocumentSection>
        )}

        {hasInsuranceDocs && (
          <DocumentSection title="Insurance Documents" icon={insuranceIcon}>
            {insuranceRequests.map((ins, insIndex) => (
              <React.Fragment key={`insurance-${insIndex}`}>
                {ins.rcDocument && (
                  <DocumentCard
                    title="RC Document"
                    document={ins.rcDocument}
                    subtitle={`Insurance Request #${insIndex + 1}`}
                    type="insurance"
                    onClick={openModal}
                  />
                )}
                {ins.salesInvoice && (
                  <DocumentCard
                    title="Sales Invoice"
                    document={ins.salesInvoice}
                    subtitle={`Insurance Request #${insIndex + 1}`}
                    type="insurance"
                    onClick={openModal}
                  />
                )}
                {ins.identityProof && (
                  <DocumentCard
                    title="Identity Proof"
                    document={ins.identityProof}
                    subtitle={`Insurance Request #${insIndex + 1}`}
                    type="insurance"
                    onClick={openModal}
                  />
                )}
                {ins.addressProof && (
                  <DocumentCard
                    title="Address Proof"
                    document={ins.addressProof}
                    subtitle={`Insurance Request #${insIndex + 1}`}
                    type="insurance"
                    onClick={openModal}
                  />
                )}
                {ins.form21 && (
                  <DocumentCard
                    title="Form 21"
                    document={ins.form21}
                    subtitle={`Insurance Request #${insIndex + 1}`}
                    type="insurance"
                    onClick={openModal}
                  />
                )}
                {ins.form22 && (
                  <DocumentCard
                    title="Form 22"
                    document={ins.form22}
                    subtitle={`Insurance Request #${insIndex + 1}`}
                    type="insurance"
                    onClick={openModal}
                  />
                )}
                {ins.tempReg && (
                  <DocumentCard
                    title="Temp Registration"
                    document={ins.tempReg}
                    subtitle={`Insurance Request #${insIndex + 1}`}
                    type="insurance"
                    onClick={openModal}
                  />
                )}
                {ins.puc && (
                  <DocumentCard
                    title="PUC Certificate"
                    document={ins.puc}
                    subtitle={`Insurance Request #${insIndex + 1}`}
                    type="insurance"
                    onClick={openModal}
                  />
                )}
                {ins.loanDocuments && (
                  <DocumentCard
                    title="Loan Documents"
                    document={ins.loanDocuments}
                    subtitle={`Insurance Request #${insIndex + 1}`}
                    type="insurance"
                    onClick={openModal}
                  />
                )}
              </React.Fragment>
            ))}
          </DocumentSection>
        )}
      </div>

      {/* PDF Modal */}
      <PDFModal
        isOpen={modalOpen}
        onClose={closeModal}
        documentUrl={currentDocument.url}
        title={currentDocument.title}
      />
    </div>
  );
};

export default DocumentsInfo;
