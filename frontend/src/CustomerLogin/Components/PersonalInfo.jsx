"use client"

import { Typography, Grid, Box, Divider, useMediaQuery, useTheme } from "@mui/material"
import GlassMorphism from "../effects/GlassMorphism"
  
const PersonalInfo = ({ userData }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"))

  return (
       <GlassMorphism
        elevation={1}
        className="info-section"
        intensity="medium"
        sx={{
          overflow: "hidden",
          mx: isMobile ? 1 : "auto",
          maxWidth: isDesktop ? 1400 : "100%",
        }}
      >
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
            <Divider
              sx={{ my: 1.5, background: "linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.3), transparent)" }}
            />

            <Grid container spacing={3} mt={1}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="caption" color="textSecondary" display="block">
                  First Name
                </Typography>
                <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                  {userData.firstName || "N/A"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="caption" color="textSecondary" display="block">
                  Middle Name
                </Typography>
                <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                  {userData.middleName || "N/A"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="caption" color="textSecondary" display="block">
                  Last Name
                </Typography>
                <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                  {userData.lastName || "N/A"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="caption" color="textSecondary" display="block">
                  Email
                </Typography>
                <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                  {userData.email || "N/A"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="caption" color="textSecondary" display="block">
                  Primary Phone
                </Typography>
                <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                  {userData.mobileNumber1 || "N/A"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="caption" color="textSecondary" display="block">
                  Secondary Phone
                </Typography>
                <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                  {userData.mobileNumber2 || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box mt={4}>
            <Typography variant="subtitle1" className="section-subtitle">
              Address
            </Typography>
            <Divider
              sx={{ my: 1.5, background: "linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.3), transparent)" }}
            />

            <Grid container spacing={3} mt={1}>
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary" display="block">
                  Street Address
                </Typography>
                <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                  {userData.address || "N/A"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="textSecondary" display="block">
                  City
                </Typography>
                <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                  {userData.city || "N/A"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="textSecondary" display="block">
                  State
                </Typography>
                <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                  {userData.state || "N/A"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="textSecondary" display="block">
                  Country
                </Typography>
                <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                  {userData.country || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </GlassMorphism>
   )
}

export default PersonalInfo
