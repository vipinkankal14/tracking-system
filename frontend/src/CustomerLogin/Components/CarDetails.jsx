"use client"

import { Cancel, CheckCircle } from "@mui/icons-material"
import { Typography, Grid, Box, Divider, Chip, Alert, useTheme, useMediaQuery } from "@mui/material"
import GlassMorphism from "../effects/GlassMorphism"
   

const CarDetails = ({ userData }) => {
  const { carBooking, stockInfo, orderInfo } = userData

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"))

  return (
    <div className="car-details">
         <GlassMorphism
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
                Car Information
              </Typography>
             <Typography variant="body2" color="textSecondary" paragraph>
              Details about the booked vehicle
            </Typography>

            <Box mt={3}>
              <Typography variant="subtitle1" className="section-subtitle">
                Vehicle Specifications
              </Typography>
              <Divider
                sx={{ my: 1.5, background: "linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.3), transparent)" }}
              />

              <Grid container spacing={3} mt={1}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Model
                  </Typography>
                  <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                    {carBooking.model || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Version
                  </Typography>
                  <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                    {carBooking.version || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Color
                  </Typography>
                  <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                    {carBooking.color || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Fuel Type
                  </Typography>
                  <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                    {carBooking.fuelType || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Transmission
                  </Typography>
                  <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                    {carBooking.transmission || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Booking Type
                  </Typography>
                  <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                    {carBooking.bookingType || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Mileage
                  </Typography>
                  <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                    {carBooking.mileage ? `${carBooking.mileage} km/l` : "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Engine Capacity
                  </Typography>
                  <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                    {carBooking.engineCapacity ? `${carBooking.engineCapacity} cc` : "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Ground Clearance
                  </Typography>
                  <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                    {carBooking.groundClearance || "N/A"}
                  </Typography>
                </Grid>

                {carBooking.batteryCapacity > 0 && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="textSecondary" display="block">
                      Battery Capacity
                    </Typography>
                    <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                      {carBooking.batteryCapacity} kWh
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>

            <Box mt={4}>
              <Typography variant="subtitle1" className="section-subtitle">
                Pricing
              </Typography>
              <Divider
                sx={{ my: 1.5, background: "linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.3), transparent)" }}
              />

              <Grid container spacing={3} mt={1}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Ex-Showroom Price
                  </Typography>
                     <Typography variant="body2">₹{carBooking.exShowroomPrice?.toLocaleString() || "N/A"}</Typography>
                 </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Booking Amount
                  </Typography>
                     <Typography variant="body2">₹{carBooking.bookingAmount?.toLocaleString() || "N/A"}</Typography>
                 </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Discount
                  </Typography>
                     <Typography variant="body2">₹{carBooking.cardiscount?.toLocaleString() || "0"}</Typography>
                 </Grid>
              </Grid>
            </Box>

            <Box mt={4}>
              <Typography variant="subtitle1" className="section-subtitle">
                Sales Team
              </Typography>
              <Divider
                sx={{ my: 1.5, background: "linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.3), transparent)" }}
              />

              <Grid container spacing={3} mt={1}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Team Leader
                  </Typography>
                  <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                    {carBooking.team_Leader || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Team Member
                  </Typography>
                  <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                    {carBooking.team_Member || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </GlassMorphism>
 
            <GlassMorphism
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
                  Vehicle Status
                </Typography>
               <Typography variant="body2" color="textSecondary" paragraph>
                Current status and vehicle identification
              </Typography>

              {stockInfo ? (
                <Box mt={3}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" className="section-subtitle">
                      Vehicle Identification
                    </Typography>
                    <Chip
                      label={stockInfo.allotmentStatus || "Not Allocated"}
                      color={stockInfo.allotmentStatus === "allocated" ? "success" : "default"}
                      size="small"
                      sx={{
                        boxShadow:
                          stockInfo.allotmentStatus === "allocated" ? "0 0 8px rgba(46, 125, 50, 0.5)" : "none",
                      }}
                    />
                  </Box>
                  <Divider
                    sx={{
                      my: 1.5,
                      background: "linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.3), transparent)",
                    }}
                  />

                  <Grid container spacing={3} mt={1}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        VIN
                      </Typography>
                      <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                        {stockInfo.vin || "N/A"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Chassis Number
                      </Typography>
                      <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                        {stockInfo.chassisNumber || "N/A"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Engine Number
                      </Typography>
                      <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                        {stockInfo.engineNumber || "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <Alert severity="info" sx={{ mt: 2, boxShadow: "0 0 10px rgba(79, 70, 229, 0.3)" }}>
                  No vehicle has been allocated yet.
                </Alert>
              )}

              <>
                <Box mt={4}>
                  <Typography variant="subtitle1" className="section-subtitle">
                    Order Timeline
                  </Typography>
                  <Divider
                    sx={{
                      my: 1.5,
                      background: "linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.3), transparent)",
                    }}
                  />

                  <Grid container spacing={2} mt={1}>
                    {/* Left Column */}
                    <Grid item xs={12} md={6}>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Order Status
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <Typography variant="body2" mr={1} sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                            {orderInfo.order_date === "YES" ? "Confirmed" : "Not requested"}
                          </Typography>
                          {orderInfo.order_date === "YES" ? (
                            <CheckCircle
                              fontSize="small"
                              color="success"
                              sx={{ filter: "drop-shadow(0 0 3px rgba(46, 125, 50, 0.7))" }}
                            />
                          ) : (
                            <Cancel
                              fontSize="small"
                              color="error"
                              sx={{ filter: "drop-shadow(0 0 3px rgba(211, 47, 47, 0.7))" }}
                            />
                          )}
                        </Box>
                      </Grid>

                      {/* Tentative Date */}
                      <Grid item xs={4} sm={6}>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Tentative Date
                        </Typography>
                        <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                          {orderInfo.tentative_date
                            ? new Date(orderInfo.tentative_date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "N/A"}
                        </Typography>
                      </Grid>

                      {/* Preferred Date */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Preferred Date
                        </Typography>
                        <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                          {orderInfo.preferred_date
                            ? new Date(orderInfo.preferred_date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "N/A"}
                        </Typography>
                      </Grid>

                      {/* Request Date */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Request Date
                        </Typography>
                        <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                          {orderInfo.request_date
                            ? new Date(orderInfo.request_date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "N/A"}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} md={6}>
                      {/* Prebooking Status */}
                      <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Prebooking Status
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <Typography variant="body2" mr={1} sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                            {orderInfo.prebooking === "YES" ? "Confirmed" : "Not requested"}
                          </Typography>
                          {orderInfo.prebooking === "YES" ? (
                            <CheckCircle
                              fontSize="small"
                              color="success"
                              sx={{ filter: "drop-shadow(0 0 3px rgba(46, 125, 50, 0.7))" }}
                            />
                          ) : (
                            <Cancel
                              fontSize="small"
                              color="error"
                              sx={{ filter: "drop-shadow(0 0 3px rgba(211, 47, 47, 0.7))" }}
                            />
                          )}
                        </Box>
                      </Grid>

                      {/* Prebooking Date - Only shown if prebooking is YES */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Prebooking Date
                        </Typography>
                        <Typography variant="body2" sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                          {orderInfo.prebooking_date
                            ? new Date(orderInfo.prebooking_date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "N/A"}
                        </Typography>
                      </Grid>

                      {/* Delivery Date */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Delivery Date
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <Typography variant="body2" mr={1} sx={{ textShadow: "0 0 2px rgba(255, 255, 255, 0.2)" }}>
                            {orderInfo.delivery_date
                              ? new Date(orderInfo.delivery_date).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </>
            </Box>
          </GlassMorphism>
     </div>
  )
}

export default CarDetails
