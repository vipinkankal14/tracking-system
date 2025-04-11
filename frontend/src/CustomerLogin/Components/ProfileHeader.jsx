import { Paper, Grid, Typography, Avatar, Chip, Box } from "@mui/material"
import { Phone, Email, LocationOn } from "@mui/icons-material"

const ProfileHeader = ({ userData }) => {
  const getInitials = () => {
    const firstName = userData.firstName || ""
    const lastName = userData.lastName || ""
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success"
      case "pending":
        return "warning"
      case "inactive":
        return "default"
      default:
        return "primary"
    }
  }

  return (
    <Paper elevation={2} className="profile-header">
      <Box className="profile-header-content" p={3}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box className="profile-identity" display="flex" alignItems="center">
              <Avatar className="profile-avatar" sx={{ width: 80, height: 80, fontSize: 32, bgcolor: "primary.main" }}>
                {getInitials()}
              </Avatar>
              <Box ml={2}>
                <Box display="flex" alignItems="center" mb={0.5}>
                  <Typography variant="h5" component="h2" className="customer-name">
                    {userData.firstName} {userData.middleName} {userData.lastName}
                  </Typography>
                  <Chip
                    label={userData.status || "N/A"}
                    color={getStatusColor(userData.status)}
                    size="small"
                    className="status-chip"
                    sx={{ ml: 1 }}
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Customer ID: {userData.customerId}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center">
                  <Phone color="action" fontSize="small" />
                  <Box ml={1}>
                    <Typography variant="caption" color="textSecondary">
                      Primary Phone
                    </Typography>
                    <Typography variant="body2">{userData.mobileNumber1 || "N/A"}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center">
                  <Email color="action" fontSize="small" />
                  <Box ml={1}>
                    <Typography variant="caption" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body2">{userData.email || "N/A"}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center">
                  <LocationOn color="action" fontSize="small" />
                  <Box ml={1}>
                    <Typography variant="caption" color="textSecondary">
                      Location
                    </Typography>
                    <Typography variant="body2">
                      {userData.city}
                      {userData.city && userData.state ? ", " : ""}
                      {userData.state}
                      {(userData.city || userData.state) && userData.country ? ", " : ""}
                      {userData.country || "N/A"}
                      
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}

export default ProfileHeader
