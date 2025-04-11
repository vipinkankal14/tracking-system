import React from "react"
import { 
  Paper, 
  Typography, 
  Grid, 
  Box, 
  Divider, 
  Card, 
  CardContent,
  Chip,
  Button,
  Collapse,
  Alert
} from "@mui/material"
import { 
  InsertDriveFile,
  ExpandMore,
  ExpandLess,
  Description,
  Receipt,
  CreditCard,
  DirectionsCar,
  LocalOffer
} from "@mui/icons-material"

const DocumentCard = ({ title, document, subtitle, type }) => {
  if (!document) return null

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent sx={{ p: 2 }}>
          <Box display="flex" alignItems="center">
            {type === 'loan' && <Description color="action" />}
            {type === 'rto' && <Receipt color="action" />}
            {type === 'finance' && <CreditCard color="action" />}
            {type === 'exchange' && <DirectionsCar color="action" />}
            {type === 'fastag' && <LocalOffer color="action" />}
            {!type && <InsertDriveFile color="action" />}
            
            <Box ml={1} sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" noWrap>{title}</Typography>
              {subtitle && (
                <Typography variant="caption" color="textSecondary" noWrap>
                  {subtitle}
                </Typography>
              )}
              {typeof document === 'string' && (
                <Button 
                  size="small" 
                  sx={{ mt: 1 }}
                  onClick={() => window.open(document, '_blank')}
                >
                  View Document
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  )
}

const DocumentSection = ({ title, icon, children, defaultExpanded = true }) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded)

  return (
    <Box mt={3}>
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="space-between"
        onClick={() => setExpanded(!expanded)}
        sx={{ cursor: 'pointer' }}
      >
        <Box display="flex" alignItems="center">
          {icon}
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </Box>
      <Divider sx={{ my: 1.5 }} />
      <Collapse in={expanded}>
        <Grid container spacing={2}>
          {children}
        </Grid>
      </Collapse>
    </Box>
  )
}

const DocumentsInfo = ({ userData }) => {
  const {
    loans = [],
    carexchangerequests = [],
    RTORequests = [],
    fasttagRequests = [],
    insuranceRequests = [],
    autocardRequests = [],
    extendedWarrantyRequests = [],
    coatingRequests = []
  } = userData || {}

  // Check if there are any documents
  const hasLoanDocs = loans.some(loan => loan.documents?.length > 0)
  const hasExchangeDocs = carexchangerequests.some(ex => 
    ex.rcDocument || ex.insurancePolicy || ex.pucCertificate || 
    ex.identityProof || ex.addressProof || ex.loanClearance || ex.serviceHistory
  )
  const hasRTODocs = RTORequests.some(rto => 
    rto.form20 || rto.form21 || rto.form22 || rto.form34 || 
    rto.invoice || rto.insurance || rto.puc || rto.idProof || 
    rto.roadTax || rto.tempReg
  )
  const hasFastTagDocs = fasttagRequests.some(tag => 
    tag.rcDocument || tag.panDocument || tag.passportPhoto || tag.aadhaarDocument
  )
  const hasInsuranceDocs = insuranceRequests.some(ins => 
    ins.rcDocument || ins.salesInvoice || ins.identityProof || 
    ins.addressProof || ins.form21 || ins.form22 || ins.tempReg || 
    ins.puc || ins.loanDocuments
  )
  const hasAutocardDocs = autocardRequests.length > 0
  const hasWarrantyDocs = extendedWarrantyRequests.length > 0
  const hasCoatingDocs = coatingRequests.length > 0

  const hasAnyDocuments = hasLoanDocs || hasExchangeDocs || hasRTODocs || 
                         hasFastTagDocs || hasInsuranceDocs || hasAutocardDocs || 
                         hasWarrantyDocs || hasCoatingDocs

  return (
    <Paper elevation={1} sx={{ mb: 3 }}>
      <Box p={3}>
        <Typography variant="h6" gutterBottom>
          Documents Center
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          All submitted documents organized by category
        </Typography>

        {!hasAnyDocuments && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No documents have been submitted yet.
          </Alert>
        )}

        {hasLoanDocs && (
          <DocumentSection 
            title="Loan Documents" 
            icon={<CreditCard color="primary" />}
          >
            {loans.map((loan, loanIndex) => (
              <React.Fragment key={`loan-${loanIndex}`}>
                {loan.documents?.map((doc, docIndex) => (
                  <DocumentCard
                    key={`loan-${loanIndex}-doc-${docIndex}`}
                    title={doc.document_name || `Loan Document ${docIndex + 1}`}
                    document={doc.document_path}
                    subtitle={`Type: ${doc.employed_type || 'N/A'}`}
                    type="loan"
                  />
                ))}
              </React.Fragment>
            ))}
          </DocumentSection>
        )}

        {hasExchangeDocs && (
          <DocumentSection 
            title="Exchange Documents" 
            icon={<DirectionsCar color="primary" />}
          >
            {carexchangerequests.map((exchange, exIndex) => (
              <React.Fragment key={`exchange-${exIndex}`}>
                {exchange.rcDocument && (
                  <DocumentCard
                    title="RC Document"
                    document={exchange.rcDocument}
                    subtitle={`Exchange #${exIndex + 1}`}
                    type="exchange"
                  />
                )}
                {exchange.insurancePolicy && (
                  <DocumentCard
                    title="Insurance Policy"
                    document={exchange.insurancePolicy}
                    subtitle={`Exchange #${exIndex + 1}`}
                    type="exchange"
                  />
                )}
                {exchange.pucCertificate && (
                  <DocumentCard
                    title="PUC Certificate"
                    document={exchange.pucCertificate}
                    subtitle={`Exchange #${exIndex + 1}`}
                    type="exchange"
                  />
                )}
                {exchange.identityProof && (
                  <DocumentCard
                    title="Identity Proof"
                    document={exchange.identityProof}
                    subtitle={`Exchange #${exIndex + 1}`}
                    type="exchange"
                  />
                )}
                {exchange.addressProof && (
                  <DocumentCard
                    title="Address Proof"
                    document={exchange.addressProof}
                    subtitle={`Exchange #${exIndex + 1}`}
                    type="exchange"
                  />
                )}
                {exchange.loanClearance && (
                  <DocumentCard
                    title="Loan Clearance"
                    document={exchange.loanClearance}
                    subtitle={`Exchange #${exIndex + 1}`}
                    type="exchange"
                  />
                )}
                {exchange.serviceHistory && (
                  <DocumentCard
                    title="Service History"
                    document={exchange.serviceHistory}
                    subtitle={`Exchange #${exIndex + 1}`}
                    type="exchange"
                  />
                )}
              </React.Fragment>
            ))}
          </DocumentSection>
        )}

        {hasRTODocs && (
          <DocumentSection 
            title="RTO Documents" 
            icon={<Receipt color="primary" />}
          >
            {RTORequests.map((rto, rtoIndex) => (
              <React.Fragment key={`rto-${rtoIndex}`}>
                {rto.form20 && (
                  <DocumentCard
                    title="Form 20"
                    document={rto.form20}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                  />
                )}
                {rto.form21 && (
                  <DocumentCard
                    title="Form 21"
                    document={rto.form21}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                  />
                )}
                {rto.form22 && (
                  <DocumentCard
                    title="Form 22"
                    document={rto.form22}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                  />
                )}
                {rto.form34 && (
                  <DocumentCard
                    title="Form 34"
                    document={rto.form34}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                  />
                )}
                {rto.invoice && (
                  <DocumentCard
                    title="Invoice"
                    document={rto.invoice}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                  />
                )}
                {rto.insurance && (
                  <DocumentCard
                    title="Insurance"
                    document={rto.insurance}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                  />
                )}
                {rto.puc && (
                  <DocumentCard
                    title="PUC"
                    document={rto.puc}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                  />
                )}
                {rto.idProof && (
                  <DocumentCard
                    title="ID Proof"
                    document={rto.idProof}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                  />
                )}
                {rto.roadTax && (
                  <DocumentCard
                    title="Road Tax"
                    document={rto.roadTax}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                  />
                )}
                {rto.tempReg && (
                  <DocumentCard
                    title="Temp Registration"
                    document={rto.tempReg}
                    subtitle={`RTO Request #${rtoIndex + 1}`}
                    type="rto"
                  />
                )}
              </React.Fragment>
            ))}
          </DocumentSection>
        )}

        {hasFastTagDocs && (
          <DocumentSection 
            title="FASTag Documents" 
            icon={<LocalOffer color="primary" />}
          >
            {fasttagRequests.map((tag, tagIndex) => (
              <React.Fragment key={`fastag-${tagIndex}`}>
                {tag.rcDocument && (
                  <DocumentCard
                    title="RC Document"
                    document={tag.rcDocument}
                    subtitle={`FASTag Request #${tagIndex + 1}`}
                    type="fastag"
                  />
                )}
                {tag.panDocument && (
                  <DocumentCard
                    title="PAN Card"
                    document={tag.panDocument}
                    subtitle={`FASTag Request #${tagIndex + 1}`}
                    type="fastag"
                  />
                )}
                {tag.passportPhoto && (
                  <DocumentCard
                    title="Passport Photo"
                    document={tag.passportPhoto}
                    subtitle={`FASTag Request #${tagIndex + 1}`}
                    type="fastag"
                  />
                )}
                {tag.aadhaarDocument && (
                  <DocumentCard
                    title="Aadhaar Card"
                    document={tag.aadhaarDocument}
                    subtitle={`FASTag Request #${tagIndex + 1}`}
                    type="fastag"
                  />
                )}
              </React.Fragment>
            ))}
          </DocumentSection>
        )}

        {hasInsuranceDocs && (
          <DocumentSection 
            title="Insurance Documents" 
            icon={<Description color="primary" />}
          >
            {insuranceRequests.map((ins, insIndex) => (
              <React.Fragment key={`insurance-${insIndex}`}>
                {ins.rcDocument && (
                  <DocumentCard
                    title="RC Document"
                    document={ins.rcDocument}
                    subtitle={`Insurance Request #${insIndex + 1}`}
                    type="insurance"
                  />
                )}
                {ins.salesInvoice && (
                  <DocumentCard
                    title="Sales Invoice"
                    document={ins.salesInvoice}
                    subtitle={`Insurance Request #${insIndex + 1}`}
                    type="insurance"
                  />
                )}
                {ins.identityProof && (
                  <DocumentCard
                    title="Identity Proof"
                    document={ins.identityProof}
                    subtitle={`Insurance Request #${insIndex + 1}`}
                    type="insurance"
                  />
                )}
                {ins.addressProof && (
                  <DocumentCard
                    title="Address Proof"
                    document={ins.addressProof}
                    subtitle={`Insurance Request #${insIndex + 1}`}
                    type="insurance"
                  />
                )}
                {ins.form21 && (
                  <DocumentCard
                    title="Form 21"
                    document={ins.form21}
                    subtitle={`Insurance Request #${insIndex + 1}`}
                    type="insurance"
                  />
                )}
                {ins.form22 && (
                  <DocumentCard
                    title="Form 22"
                    document={ins.form22}
                    subtitle={`Insurance Request #${insIndex + 1}`}
                    type="insurance"
                  />
                )}
                {ins.tempReg && (
                  <DocumentCard
                    title="Temp Registration"
                    document={ins.tempReg}
                    subtitle={`Insurance Request #${insIndex + 1}`}
                    type="insurance"
                  />
                )}
                {ins.puc && (
                  <DocumentCard
                    title="PUC Certificate"
                    document={ins.puc}
                    subtitle={`Insurance Request #${insIndex + 1}`}
                    type="insurance"
                  />
                )}
                {ins.loanDocuments && (
                  <DocumentCard
                    title="Loan Documents"
                    document={ins.loanDocuments}
                    subtitle={`Insurance Request #${insIndex + 1}`}
                    type="insurance"
                  />
                )}
              </React.Fragment>
            ))}
          </DocumentSection>
        )}

        {/* Additional sections for other document types can be added here */}
      </Box>
    </Paper>
  )
}

export default DocumentsInfo