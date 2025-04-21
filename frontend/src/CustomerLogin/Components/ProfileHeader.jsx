import { Grid, Typography, Avatar, Box } from "@mui/material"
import { Phone, Email, LocationOn } from "@mui/icons-material"
import GlowingBorder from "../effects/GlowingBorder"
import GlassMorphism from "../effects/GlassMorphism"
 

const ProfileHeader = ({ userData }) => {
  const getInitials = () => {
    const firstName = userData.firstName || ""
    const lastName = userData.lastName || ""
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }
  return (
    <GlowingBorder>
      <GlassMorphism>
        <Box className="profile-header-content" p={3}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={12}>
              <Box className="profile-identity" display="flex" alignItems="center">
                <Avatar
                  className="profile-avatar"
                  sx={{
                    width: 50,
                    height: 50,
                    fontSize: 14,
                    bgcolor: "primary.main",
                    boxShadow: "0 0 15px rgba(79, 70, 229, 0.6)",
                  }}
                >
                  {getInitials()}
                </Avatar>
                <Box ml={2}>
                  <Box display="flex" alignItems="center" mb={-0.8}>
                       <Typography variant="inherit" component="h2" className="customer-name">
                        {userData.firstName} {userData.middleName} {userData.lastName}
                      </Typography>
                   </Box>
                  <Typography variant="caption" color="textSecondary">
                    ID: {userData.customerId}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={2}>
                  <Box display="flex" alignItems="center">
                    <Phone
                      color="action"
                      fontSize="small"
                      sx={{ filter: "drop-shadow(0 0 3px rgba(79, 70, 229, 0.5))" }}
                    />
                    <Box ml={1}>
                      <Typography variant="caption" color="textSecondary">
                        Primary Phone
                      </Typography>
                      <Typography variant="body2">{userData.mobileNumber1 || "N/A"}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Box display="flex" alignItems="center">
                    <Email
                      color="action"
                      fontSize="small"
                      sx={{ filter: "drop-shadow(0 0 3px rgba(79, 70, 229, 0.5))" }}
                    />
                    <Box ml={1}>
                      <Typography variant="caption" color="textSecondary">
                        Email
                      </Typography>
                      <Typography variant="body2">{userData.email || "N/A"}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={7}>
                  <Box display="flex" alignItems="center">
                    <LocationOn
                      color="action"
                      fontSize="small"
                      sx={{ filter: "drop-shadow(0 0 3px rgba(79, 70, 229, 0.5))" }}
                    />
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
      </GlassMorphism>
    </GlowingBorder>
  )
}

export default ProfileHeader
