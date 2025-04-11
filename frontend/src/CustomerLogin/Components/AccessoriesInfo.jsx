import {
  Paper,
  Typography,
  Grid,
  Box,
  Divider,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import { Inventory } from "@mui/icons-material"

const AccessoriesInfo = ({ userData }) => {
  const { accessoriesRequests = [], additional_info = {} } = userData

  const hasAccessories = additional_info.accessories === "YES"

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  return (
    <Paper elevation={1} className="info-section">
      <Box p={3}>
        <Typography variant="h6" gutterBottom>
          Accessories Information
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Details about requested vehicle accessories
        </Typography>

        {hasAccessories ? (
          accessoriesRequests.length > 0 ? (
            accessoriesRequests.map((request, index) => (
              <Box key={request.id || index} mt={index > 0 ? 4 : 2} className="accessories-item">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" className="section-subtitle">
                    Accessories Request #{index + 1}
                  </Typography>
                  <Chip label={request.status || "Processing"} color={getStatusColor(request.status)} size="small" />
                </Box>
                <Divider sx={{ my: 1.5 }} />

                <Grid container spacing={3} mt={1}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="textSecondary" display="block">
                      Total Amount
                    </Typography>
                    <Typography variant="body2">₹{request.totalAmount?.toLocaleString() || "N/A"}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="textSecondary" display="block">
                      Request Date
                    </Typography>
                    <Typography variant="body2">
                      {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "N/A"}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="textSecondary" display="block">
                      Last Updated
                    </Typography>
                    <Typography variant="body2">
                      {request.updatedAt ? new Date(request.updatedAt).toLocaleDateString() : "N/A"}
                    </Typography>
                  </Grid>
                </Grid>

                {request.accessorieReason && (
                  <Box mt={2} p={2} bgcolor="rgba(0, 0, 0, 0.04)" borderRadius={1}>
                    <Typography variant="caption" color="textSecondary" display="block">
                      Remarks
                    </Typography>
                    <Typography variant="body2">{request.accessorieReason}</Typography>
                  </Box>
                )}

                {request.products && request.products.length > 0 && (
                  <Box mt={3}>
                    <Typography variant="subtitle2" gutterBottom>
                      Selected Products
                    </Typography>
                    <TableContainer className="accessories-table">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {request.products.map((product, productIndex) => (
                            <TableRow key={product.id || productIndex}>
                              <TableCell>{product.name}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell align="right">₹{product.price?.toLocaleString() || "N/A"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </Box>
            ))
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              Accessories have been requested but details are not available yet.
            </Alert>
          )
        ) : (
          <Alert severity="info" sx={{ mt: 2 }} icon={<Inventory />}>
            No accessories have been requested for this vehicle.
          </Alert>
        )}
      </Box>
    </Paper>
  )
}

export default AccessoriesInfo
