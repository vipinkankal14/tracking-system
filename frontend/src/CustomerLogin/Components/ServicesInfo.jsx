"use client"

import { useState } from "react"
import { 
  Paper, 
  Typography, 
  Grid, 
  Box, 
  Divider, 
  Chip, 
  Alert, 
  Tabs, 
  Tab, 
  Card, 
  CardContent,
  Button,
  Collapse
} from "@mui/material"
import {
  Brush,
  Description,
  LocalOffer,
  Security,
  CreditCard,
  Autorenew,
  VpnKey,
  InsertDriveFile,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Pending,
  Cancel
} from "@mui/icons-material"

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`services-tabpanel-${index}`}
      aria-labelledby={`services-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `services-tab-${index}`,
    "aria-controls": `services-tabpanel-${index}`,
  }
}

const StatusChip = ({ status }) => {
  let icon = <Pending color="inherit" />
  let color = "default"
  
  switch (status?.toLowerCase()) {
    case "approved":
      icon = <CheckCircle color="inherit" />
      color = "success"
      break
    case "pending":
      icon = <Pending color="inherit" />
      color = "warning"
      break
    case "rejected":
      icon = <Cancel color="inherit" />
      color = "error"
      break
    default:
      break
  }

  return (
    <Chip 
      icon={icon}
      label={status || "Processing"} 
      color={color} 
      size="small" 
      variant="outlined"
    />
  )
}

const ServiceSection = ({ title, children, defaultExpanded = true }) => {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <Box sx={{ mb: 3 }}>
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="space-between"
        onClick={() => setExpanded(!expanded)}
        sx={{ cursor: 'pointer', mb: 1 }}
      >
        <Typography variant="subtitle1" fontWeight="medium">
          {title}
        </Typography>
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </Box>
      <Divider />
      <Collapse in={expanded}>
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  )
}

const DocumentItem = ({ label, value }) => {
  if (!value) return null

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card variant="outlined">
        <CardContent sx={{ p: 2 }}>
          <Box display="flex" alignItems="center">
            <InsertDriveFile color="action" />
            <Box ml={1}>
              <Typography variant="body2">{label}</Typography>
              {typeof value === 'string' && value.startsWith('http') && (
                <Button 
                  size="small" 
                  sx={{ mt: 1 }}
                  onClick={() => window.open(value, '_blank')}
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

const ServicesInfo = ({ userData }) => {
  const [tabValue, setTabValue] = useState(0)

  const {
    additional_info = {},
    coatingRequests = [],
    RTORequests = [],
    fasttagRequests = [],
    insuranceRequests = [],
    autocardRequests = [],
    extendedWarrantyRequests = [],
    predeliveryinspection = [],
    gate_pass = [],
    management_security_clearance = [],
  } = userData || {}

  const hasCoating = additional_info?.coating === "YES"
  const hasRTO = additional_info?.rto === "YES"
  const hasFastTag = additional_info?.fast_tag === "YES"
  const hasInsurance = additional_info?.insurance === "YES"
  const hasAutoCard = additional_info?.auto_card === "YES"
  const hasExtendedWarranty = additional_info?.extended_warranty === "YES"

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Paper elevation={1} sx={{ mb: 3 }}>
      <Box p={3}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="services tabs"
          sx={{ mb: 3 }}
        >
          <Tab icon={<Brush />} label="Coating" {...a11yProps(0)} />
          <Tab icon={<Description />} label="RTO" {...a11yProps(1)} />
          <Tab icon={<LocalOffer />} label="FastTag" {...a11yProps(2)} />
          <Tab icon={<Security />} label="Insurance" {...a11yProps(3)} />
          <Tab icon={<CreditCard />} label="AutoCard" {...a11yProps(4)} />
          <Tab icon={<Autorenew />} label="Warranty" {...a11yProps(5)} />
          <Tab icon={<VpnKey />} label="Inspection" {...a11yProps(6)} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Coating Services
          </Typography>
          
          {hasCoating ? (
            coatingRequests.length > 0 ? (
              coatingRequests.map((coating, index) => (
                <ServiceSection 
                  key={coating.id || index} 
                  title={`Coating Request #${index + 1}`}
                  defaultExpanded={index === 0}
                >
                  <Box display="flex" justifyContent="flex-end" mb={2}>
                    <StatusChip status={coating.status} />
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary">
                        Coating Type
                      </Typography>
                      <Typography>{coating.coatingType || "N/A"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary">
                        Amount
                      </Typography>
                      <Typography>₹{coating.coating_amount?.toLocaleString('en-IN') || "N/A"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary">
                        Durability
                      </Typography>
                      <Typography>{coating.durability || "N/A"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary">
                        Preferred Date
                      </Typography>
                      <Typography>
                        {coating.preferredDate ? new Date(coating.preferredDate).toLocaleDateString() : "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary">
                        Preferred Time
                      </Typography>
                      <Typography>{coating.preferredTime || "N/A"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary">
                        Request Date
                      </Typography>
                      <Typography>
                        {coating.createdAt ? new Date(coating.createdAt).toLocaleDateString() : "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>

                  {coating.additionalNotes && (
                    <Box mt={2} p={2} bgcolor="action.hover" borderRadius={1}>
                      <Typography variant="caption" color="textSecondary">
                        Additional Notes
                      </Typography>
                      <Typography>{coating.additionalNotes}</Typography>
                    </Box>
                  )}

                  {coating.reason && (
                    <Box mt={2} p={2} bgcolor="action.hover" borderRadius={1}>
                      <Typography variant="caption" color="textSecondary">
                        Remarks
                      </Typography>
                      <Typography>{coating.reason}</Typography>
                    </Box>
                  )}
                </ServiceSection>
              ))
            ) : (
              <Alert severity="info" icon={<Brush />}>
                Coating has been requested but details are not available yet.
              </Alert>
            )
          ) : (
            <Alert severity="info" icon={<Brush />}>
              No coating services have been requested for this vehicle.
            </Alert>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            RTO Services
          </Typography>
          
          {hasRTO ? (
            RTORequests.length > 0 ? (
              RTORequests.map((rto, index) => (
                <ServiceSection 
                  key={rto.id || index} 
                  title={`RTO Request #${index + 1}`}
                  defaultExpanded={index === 0}
                >
                  <Box display="flex" justifyContent="flex-end" mb={2}>
                    <StatusChip status={rto.status} />
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary">
                        Amount
                      </Typography>
                      <Typography>₹{rto.rto_amount?.toLocaleString('en-IN') || "N/A"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary">
                        Request Date
                      </Typography>
                      <Typography>
                        {rto.createdAt ? new Date(rto.createdAt).toLocaleDateString() : "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary">
                        Last Updated
                      </Typography>
                      <Typography>
                        {rto.updatedAt ? new Date(rto.updatedAt).toLocaleDateString() : "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>

                  {rto.rtoReason && (
                    <Box mt={2} p={2} bgcolor="action.hover" borderRadius={1}>
                      <Typography variant="caption" color="textSecondary">
                        Remarks
                      </Typography>
                      <Typography>{rto.rtoReason}</Typography>
                    </Box>
                  )}

                  <Typography variant="subtitle2" mt={3} mb={1}>
                    Submitted Documents
                  </Typography>
                  <Grid container spacing={2}>
                    <DocumentItem label="Form 20" value={rto.form20} />
                    <DocumentItem label="Form 21" value={rto.form21} />
                    <DocumentItem label="Form 22" value={rto.form22} />
                    <DocumentItem label="Form 34" value={rto.form34} />
                    <DocumentItem label="Invoice" value={rto.invoice} />
                    <DocumentItem label="Insurance" value={rto.insurance} />
                    <DocumentItem label="PUC" value={rto.puc} />
                    <DocumentItem label="ID Proof" value={rto.idProof} />
                    <DocumentItem label="Road Tax" value={rto.roadTax} />
                    <DocumentItem label="Temp Registration" value={rto.tempReg} />
                  </Grid>
                </ServiceSection>
              ))
            ) : (
              <Alert severity="info" icon={<Description />}>
                RTO services have been requested but details are not available yet.
              </Alert>
            )
          ) : (
            <Alert severity="info" icon={<Description />}>
              No RTO services have been requested for this vehicle.
            </Alert>
          )}
        </TabPanel>

        {/* Similar enhanced implementations for other tabs */}
        {/* FastTag Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            FASTag Services
          </Typography>
          
          {hasFastTag ? (
            fasttagRequests.length > 0 ? (
              fasttagRequests.map((tag, index) => (
                <ServiceSection 
                  key={tag.id || index} 
                  title={`FASTag Request #${index + 1}`}
                  defaultExpanded={index === 0}
                >
                  <Box display="flex" justifyContent="flex-end" mb={2}>
                    <StatusChip status={tag.status} />
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary">
                        Amount
                      </Typography>
                      <Typography>₹{tag.fasttag_amount?.toLocaleString('en-IN') || "N/A"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary">
                        Request Date
                      </Typography>
                      <Typography>
                        {tag.createdAt ? new Date(tag.createdAt).toLocaleDateString() : "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>

                  {tag.fasttagReason && (
                    <Box mt={2} p={2} bgcolor="action.hover" borderRadius={1}>
                      <Typography variant="caption" color="textSecondary">
                        Remarks
                      </Typography>
                      <Typography>{tag.fasttagReason}</Typography>
                    </Box>
                  )}

                  <Typography variant="subtitle2" mt={3} mb={1}>
                    Submitted Documents
                  </Typography>
                  <Grid container spacing={2}>
                    <DocumentItem label="RC Document" value={tag.rcDocument} />
                    <DocumentItem label="PAN Card" value={tag.panDocument} />
                    <DocumentItem label="Passport Photo" value={tag.passportPhoto} />
                    <DocumentItem label="Aadhaar Card" value={tag.aadhaarDocument} />
                  </Grid>
                </ServiceSection>
              ))
            ) : (
              <Alert severity="info" icon={<LocalOffer />}>
                FASTag has been requested but details are not available yet.
              </Alert>
            )
          ) : (
            <Alert severity="info" icon={<LocalOffer />}>
              No FASTag has been requested for this vehicle.
            </Alert>
          )}
        </TabPanel>

        {/* Insurance Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Insurance Services
          </Typography>
          
          {hasInsurance ? (
            insuranceRequests.length > 0 ? (
              insuranceRequests.map((ins, index) => (
                <ServiceSection 
                  key={ins.id || index} 
                  title={`Insurance Request #${index + 1}`}
                  defaultExpanded={index === 0}
                >
                  <Box display="flex" justifyContent="flex-end" mb={2}>
                    <StatusChip status={ins.status} />
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary">
                        Amount
                      </Typography>
                      <Typography>₹{ins.insurance_amount?.toLocaleString('en-IN') || "N/A"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary">
                        Request Date
                      </Typography>
                      <Typography>
                        {ins.createdAt ? new Date(ins.createdAt).toLocaleDateString() : "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>

                  {ins.insuranceReason && (
                    <Box mt={2} p={2} bgcolor="action.hover" borderRadius={1}>
                      <Typography variant="caption" color="textSecondary">
                        Remarks
                      </Typography>
                      <Typography>{ins.insuranceReason}</Typography>
                    </Box>
                  )}

                  <Typography variant="subtitle2" mt={3} mb={1}>
                    Submitted Documents
                  </Typography>
                  <Grid container spacing={2}>
                    <DocumentItem label="RC Document" value={ins.rcDocument} />
                    <DocumentItem label="Sales Invoice" value={ins.salesInvoice} />
                    <DocumentItem label="Identity Proof" value={ins.identityProof} />
                    <DocumentItem label="Address Proof" value={ins.addressProof} />
                    <DocumentItem label="Form 21" value={ins.form21} />
                    <DocumentItem label="Form 22" value={ins.form22} />
                    <DocumentItem label="Temp Registration" value={ins.tempReg} />
                    <DocumentItem label="PUC Certificate" value={ins.puc} />
                    <DocumentItem label="Loan Documents" value={ins.loanDocuments} />
                  </Grid>
                </ServiceSection>
              ))
            ) : (
              <Alert severity="info" icon={<Security />}>
                Insurance has been requested but details are not available yet.
              </Alert>
            )
          ) : (
            <Alert severity="info" icon={<Security />}>
              No insurance has been requested for this vehicle.
            </Alert>
          )}
        </TabPanel>

        {/* AutoCard Tab */}
        <TabPanel value={tabValue} index={4}>
  <Typography variant="h6" gutterBottom>
    AutoCard Services
  </Typography>
  
  {hasAutoCard ? (
    autocardRequests.length > 0 ? (
      autocardRequests.map((card, index) => (
        <ServiceSection 
          key={card.id || index} 
          title={`AutoCard Request #${index + 1}`}
          defaultExpanded={index === 0}
        >
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <StatusChip status={card.status} />
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="textSecondary">
                Amount
              </Typography>
              <Typography>₹{card.autocard_amount?.toLocaleString('en-IN') || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="textSecondary">
                Request Date
              </Typography>
              <Typography>
                {card.createdAt ? new Date(card.createdAt).toLocaleDateString() : "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <Typography variant="caption" color="textSecondary">
                Benefits Confirmed
              </Typography>
              <Typography>
                {card.confirm_Benefits}
              </Typography>
            </Grid>
          </Grid>

          {card.autoCardReason && (
            <Box mt={2} p={2} bgcolor="action.hover" borderRadius={1}>
              <Typography variant="caption" color="textSecondary">
                Remarks
              </Typography>
              <Typography>{card.autoCardReason}</Typography>
            </Box>
          )}

          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>
              AutoCard Benefits
            </Typography>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="flex-start" mb={2}>
                      <CheckCircle color="success" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="subtitle2">Free/Discounted Car Services</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Free car washes, interior cleaning, and exterior polishing. Special discounts on periodic maintenance.
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="flex-start" mb={2}>
                      <CheckCircle color="success" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="subtitle2">Extended Warranty Offers</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Special pricing on extended warranty plans. Hassle-free claim process for repairs.
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="flex-start" mb={2}>
                      <CheckCircle color="success" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="subtitle2">Roadside Assistance (RSA)</Typography>
                        <Typography variant="body2" color="textSecondary">
                          24/7 emergency towing services. Battery jumpstart, fuel delivery, flat tire assistance.
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="flex-start" mb={2}>
                      <CheckCircle color="success" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="subtitle2">Exclusive Discounts</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Savings on genuine spare parts and car accessories. Special offers on premium add-ons.
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="flex-start" mb={2}>
                      <CheckCircle color="success" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="subtitle2">Insurance Benefits</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Discounts on insurance renewals and add-on covers. Hassle-free cashless claim settlement.
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="flex-start" mb={2}>
                      <CheckCircle color="success" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="subtitle2">Loyalty Rewards</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Earn reward points on each service & purchase. Redeem points for services and accessories.
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Box mt={2} pt={2} borderTop="1px dashed #ddd">
                  <Typography variant="subtitle2">Additional Benefits:</Typography>
                  <ul style={{ marginTop: 8, paddingLeft: 24 }}>
                    <li>
                      <Typography variant="body2">Faster service appointments & priority handling</Typography>
                    </li>
                    <li>
                      <Typography variant="body2">Free vehicle pick-up & drop for servicing</Typography>
                    </li>
                  </ul>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </ServiceSection>
      ))
    ) : (
      <Alert severity="info" icon={<CreditCard />}>
        AutoCard has been requested but details are not available yet.
      </Alert>
    )
  ) : (
    <Alert severity="info" icon={<CreditCard />}>
      No AutoCard has been requested for this vehicle.
    </Alert>
  )}
</TabPanel>

        {/* Extended Warranty Tab */}
        <TabPanel value={tabValue} index={5}>
          <Typography variant="h6" gutterBottom>
            Extended Warranty
          </Typography>
          
          {hasExtendedWarranty ? (
            extendedWarrantyRequests.length > 0 ? (
              extendedWarrantyRequests.map((warranty, index) => (
                <ServiceSection 
                  key={warranty.id || index} 
                  title={`Warranty Request #${index + 1}`}
                  defaultExpanded={index === 0}
                >
                  <Box display="flex" justifyContent="flex-end" mb={2}>
                    <StatusChip status={warranty.status} />
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary">
                        Amount
                      </Typography>
                      <Typography>₹{warranty.extendedwarranty_amount?.toLocaleString('en-IN') || "N/A"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary">
                        Request Date
                      </Typography>
                      <Typography>
                        {warranty.createdAt ? new Date(warranty.createdAt).toLocaleDateString() : "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={12}>
              <Typography variant="caption" color="textSecondary">
                Benefits Confirmed
              </Typography>
              <Typography>
                {warranty.request_extended_warranty}
              </Typography>
            </Grid>
                  </Grid>

                  {warranty.ex_Reason && (
                    <Box mt={2} p={2} bgcolor="action.hover" borderRadius={1}>
                      <Typography variant="caption" color="textSecondary">
                        Remarks
                      </Typography>
                      <Typography>{warranty.ex_Reason}</Typography>
                    </Box>
                  )}
                </ServiceSection>
              ))
            ) : (
              <Alert severity="info" icon={<Autorenew />}>
                Extended warranty has been requested but details are not available yet.
              </Alert>
            )
          ) : (
            <Alert severity="info" icon={<Autorenew />}>
              No extended warranty has been requested for this vehicle.
            </Alert>
          )}
        </TabPanel>

        {/* Inspection Tab */}
        <TabPanel value={tabValue} index={6}>
          <Typography variant="h6" gutterBottom>
            Inspection & Clearance
          </Typography>
          
          <ServiceSection title="Pre-Delivery Inspection">
            {predeliveryinspection.length > 0 ? (
              predeliveryinspection.map((pdi, index) => (
                <Box key={pdi.id || index} mb={3}>
                  <Box display="flex" justifyContent="flex-end" mb={2}>
                    <StatusChip status={pdi.status} />
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary">
                        Request Date
                      </Typography>
                      <Typography>
                        {pdi.createdAt ? new Date(pdi.createdAt).toLocaleDateString() : "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>

                  {pdi.PreDeliveryInspectionReason && (
                    <Box mt={2} p={2} bgcolor="action.hover" borderRadius={1}>
                      <Typography variant="caption" color="textSecondary">
                        Remarks
                      </Typography>
                      <Typography>{pdi.PreDeliveryInspectionReason}</Typography>
                    </Box>
                  )}
                </Box>
              ))
            ) : (
              <Alert severity="info">
                No pre-delivery inspection records found.
              </Alert>
            )}
          </ServiceSection>

          <ServiceSection title="Gate Pass">
            {gate_pass.length > 0 ? (
              gate_pass.map((gate, index) => (
                <Box key={gate.id || index} mb={3}>
                  <Box display="flex" justifyContent="flex-end" mb={2}>
                    <StatusChip status={gate.status} />
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary">
                        Request Date
                      </Typography>
                      <Typography>
                        {gate.createdAt ? new Date(gate.createdAt).toLocaleDateString() : "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>

                  {gate.gatepassReason && (
                    <Box mt={2} p={2} bgcolor="action.hover" borderRadius={1}>
                      <Typography variant="caption" color="textSecondary">
                        Remarks
                      </Typography>
                      <Typography>{gate.gatepassReason}</Typography>
                    </Box>
                  )}
                </Box>
              ))
            ) : (
              <Alert severity="info">
                No gate pass records found.
              </Alert>
            )}
          </ServiceSection>

          <ServiceSection title="Security Clearance">
            {management_security_clearance.length > 0 ? (
              management_security_clearance.map((clearance, index) => (
                <Box key={clearance.id || index} mb={3}>
                  <Box display="flex" justifyContent="flex-end" mb={2}>
                    <StatusChip status={clearance.status} />
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="textSecondary">
                        Request Date
                      </Typography>
                      <Typography>
                        {clearance.createdAt ? new Date(clearance.createdAt).toLocaleDateString() : "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>

                  {clearance.securityClearanceReason && (
                    <Box mt={2} p={2} bgcolor="action.hover" borderRadius={1}>
                      <Typography variant="caption" color="textSecondary">
                        Remarks
                      </Typography>
                      <Typography>{clearance.securityClearanceReason}</Typography>
                    </Box>
                  )}
                </Box>
              ))
            ) : (
              <Alert severity="info">
                No security clearance records found.
              </Alert>
            )}
          </ServiceSection>
        </TabPanel>
      </Box>
    </Paper>
  )
}

export default ServicesInfo