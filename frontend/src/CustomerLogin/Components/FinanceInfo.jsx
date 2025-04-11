import { Paper, Typography, Grid, Box, Divider, Chip, Alert, Card, CardContent } from "@mui/material"
import { InsertDriveFile } from "@mui/icons-material"

const FinanceInfo = ({ userData }) => {
  const { loans = [], additional_info = {}, carexchangerequests = [] } = userData || {}

  const hasFinance = additional_info?.finance === "YES"
  const hasExchange = additional_info?.exchange === "YES"

  const getStatusColor = (status) => {
    if (!status) return "default"
    switch (status.toLowerCase()) {
      case "approved":
        return "success"
      case "pending":
        return "warning"
      case "rejected":
        return "error"
      default:
        return "default"
    }
  }

  const renderDocumentCard = (title, document) => {
    if (!document) return null
    
    return (
      <Grid item xs={12} sm={6} md={4} key={title}>
        <Card variant="outlined" className="document-card">
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box display="flex" alignItems="center">
              <InsertDriveFile color="action" />
              <Box ml={1}>
                <Typography variant="body2" component="div">
                  {title}
                </Typography>
                {typeof document === 'string' && document.startsWith('http') && (
                  <Typography variant="caption" color="primary">
                    <a href={document} target="_blank" rel="noopener noreferrer">
                      View Document
                    </a>
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    )
  }

  const renderLoanDocuments = (documents = []) => {
    if (documents.length === 0) return null

    return (
      <Box mt={3}>
        <Typography variant="subtitle2" gutterBottom>
          Submitted Documents
        </Typography>
        <Grid container spacing={2} mt={0.5}>
          {documents.map((doc, docIndex) => (
            <Grid item xs={12} sm={6} md={4} key={doc.id || docIndex}>
              <Card variant="outlined" className="document-card">
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Box display="flex" alignItems="center">
                    <InsertDriveFile color="action" />
                    <Box ml={1}>
                      <Typography variant="body2" component="div">
                        {doc.document_name || `Document ${docIndex + 1}`}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Type: {doc.employed_type || "N/A"} • Uploaded:{" "}
                        {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : "N/A"}
                      </Typography>
                      {doc.document_path && (
                        <Typography variant="caption" color="primary" display="block">
                          <a href={doc.document_path} target="_blank" rel="noopener noreferrer">
                            View Document
                          </a>
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  const renderExchangeDocuments = (exchange) => {
    if (!exchange) return null

    return (
      <Box mt={3}>
        <Typography variant="subtitle2" gutterBottom>
          Submitted Documents
        </Typography>
        <Grid container spacing={2} mt={0.5}>
          {renderDocumentCard("RC Document", exchange.rcDocument)}
          {renderDocumentCard("Insurance Policy", exchange.insurancePolicy)}
          {renderDocumentCard("PUC Certificate", exchange.pucCertificate)}
          {renderDocumentCard("Identity Proof", exchange.identityProof)}
          {renderDocumentCard("Address Proof", exchange.addressProof)}
          {renderDocumentCard("Loan Clearance", exchange.loanClearance)}
          {renderDocumentCard("Service History", exchange.serviceHistory)}
        </Grid>
      </Box>
    )
  }

  const renderLoanInfo = () => {
    if (!hasFinance) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          No financing has been requested for this vehicle.
        </Alert>
      )
    }

    if (loans.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          Loan information is not available yet.
        </Alert>
      )
    }

    return loans.map((loan, index) => (
      <Box key={loan.id || index} mt={index > 0 ? 4 : 2} className="loan-item">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" className="section-subtitle">
            Loan #{index + 1}
          </Typography>
          <Chip label={loan.status || "Processing"} color={getStatusColor(loan.status)} size="small" />
        </Box>
        <Divider sx={{ my: 1.5 }} />

        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Loan Amount
            </Typography>
            <Typography variant="body2">
              ₹{(loan.loan_amount || 0).toLocaleString('en-IN')}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Interest Rate
            </Typography>
            <Typography variant="body2">{loan.interest_rate ? `${loan.interest_rate}%` : "N/A"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Loan Duration
            </Typography>
            <Typography variant="body2">
              {loan.loan_duration ? `${loan.loan_duration} months` : "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Monthly EMI
            </Typography>
            <Typography variant="body2">
              ₹{(loan.calculated_emi || 0).toLocaleString('en-IN')}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Finance Amount
            </Typography>
            <Typography variant="body2">
              ₹{(loan.financeAmount || 0).toLocaleString('en-IN')}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Application Date
            </Typography>
            <Typography variant="body2">
              {loan.created_at ? new Date(loan.created_at).toLocaleDateString() : "N/A"}
            </Typography>
          </Grid>
        </Grid>

        {loan.financeReason && (
          <Box mt={2} p={2} bgcolor="rgba(0, 0, 0, 0.04)" borderRadius={1}>
            <Typography variant="caption" color="textSecondary" display="block">
              Remarks
            </Typography>
            <Typography variant="body2">{loan.financeReason}</Typography>
          </Box>
        )}

        {renderLoanDocuments(loan.documents)}
      </Box>
    ))
  }

  const renderExchangeInfo = () => {
    if (!hasExchange) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          No car exchange has been requested.
        </Alert>
      )
    }

    if (carexchangerequests.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          Exchange vehicle information is not available yet.
        </Alert>
      )
    }

    return carexchangerequests.map((exchange, index) => (
      <Box key={exchange.id || index} mt={index > 0 ? 4 : 2} className="exchange-item">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" className="section-subtitle">
            Exchange Vehicle #{index + 1}
          </Typography>
          <Chip
            label={exchange.status || "Processing"}
            color={getStatusColor(exchange.status)}
            size="small"
          />
        </Box>
        <Divider sx={{ my: 1.5 }} />

        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Owner Name
            </Typography>
            <Typography variant="body2">{exchange.carOwnerFullName || "N/A"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Make
            </Typography>
            <Typography variant="body2">{exchange.carMake || "N/A"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Model
            </Typography>
            <Typography variant="body2">{exchange.carModel || "N/A"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Color
            </Typography>
            <Typography variant="body2">{exchange.carColor || "N/A"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Registration
            </Typography>
            <Typography variant="body2">{exchange.carRegistration || "N/A"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Year
            </Typography>
            <Typography variant="body2">{exchange.carYear || "N/A"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Exchange Amount
            </Typography>
            <Typography variant="body2">
              ₹{(exchange.exchangeAmount || 0).toLocaleString('en-IN')}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Application Date
            </Typography>
            <Typography variant="body2">
              {exchange.createdAt ? new Date(exchange.createdAt).toLocaleDateString() : "N/A"}
            </Typography>
          </Grid>
        </Grid>

        {exchange.exchangeReason && (
          <Box mt={2} p={2} bgcolor="rgba(0, 0, 0, 0.04)" borderRadius={1}>
            <Typography variant="caption" color="textSecondary" display="block">
              Remarks
            </Typography>
            <Typography variant="body2">{exchange.exchangeReason}</Typography>
          </Box>
        )}

        {renderExchangeDocuments(exchange)}
      </Box>
    ))
  }

  return (
    <div className="finance-info">
      <Paper elevation={1} className="info-section" sx={{ mb: 3 }}>
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Loan Information
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Details about the vehicle financing
          </Typography>
          {renderLoanInfo()}
        </Box>
      </Paper>

      <Paper elevation={1} className="info-section">
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Car Exchange Information
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Details about the exchange vehicle
          </Typography>
          {renderExchangeInfo()}
        </Box>
      </Paper>
    </div>
  )
}

export default FinanceInfo