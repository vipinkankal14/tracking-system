import { Paper, Typography, Grid, Box, Divider } from "@mui/material"

const PersonalInfo = ({ userData }) => {
  return (
    <Paper elevation={1} className="info-section">
      <Box p={3}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Customer personal and contact details
        </Typography>

        <Box mt={3}>
          <Typography variant="subtitle1" className="section-subtitle">
            Contact Information
          </Typography>
          <Divider sx={{ my: 1.5 }} />

          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="textSecondary" display="block">
                First Name
              </Typography>
              <Typography variant="body2">{userData.firstName || "N/A"}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="textSecondary" display="block">
                Middle Name
              </Typography>
              <Typography variant="body2">{userData.middleName || "N/A"}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="textSecondary" display="block">
                Last Name
              </Typography>
              <Typography variant="body2">{userData.lastName || "N/A"}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="textSecondary" display="block">
                Email
              </Typography>
              <Typography variant="body2">{userData.email || "N/A"}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="textSecondary" display="block">
                Primary Phone
              </Typography>
              <Typography variant="body2">{userData.mobileNumber1 || "N/A"}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="textSecondary" display="block">
                Secondary Phone
              </Typography>
              <Typography variant="body2">{userData.mobileNumber2 || "N/A"}</Typography>
            </Grid>
          </Grid>
        </Box>

              <Box mt={4}>
                  

          <Typography variant="subtitle1" className="section-subtitle">
            Address
          </Typography>
          <Divider sx={{ my: 1.5 }} />

          <Grid container spacing={3} mt={1}>
            <Grid item xs={12}>
              <Typography variant="caption" color="textSecondary" display="block">
                Street Address
              </Typography>
              <Typography variant="body2">{userData.address || "N/A"}</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="textSecondary" display="block">
                City
              </Typography>
              <Typography variant="body2">{userData.city || "N/A"}</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="textSecondary" display="block">
                State
              </Typography>
              <Typography variant="body2">{userData.state || "N/A"}</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="textSecondary" display="block">
                Country
              </Typography>
              <Typography variant="body2">{userData.country || "N/A"}</Typography>
            </Grid>
                      
          </Grid>
        </Box>
              
 

              



      </Box>
    </Paper>
  )
}

export default PersonalInfo
