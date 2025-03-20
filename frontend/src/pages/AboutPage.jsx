"use client"

import React, { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
  styled,
} from "@mui/material"
import { Email as EmailIcon, LocationOn as LocationIcon, Phone as PhoneIcon } from "@mui/icons-material"

import "../styles/about.scss"

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "40vh",
  minHeight: "300px",
  backgroundImage: "url(/placeholder.svg?height=600&width=1200)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
}))

const HeroContent = styled(Box)({
  position: "relative",
  zIndex: 1,
  textAlign: "center",
  padding: "0 16px",
  maxWidth: "800px",
})

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  fontWeight: "bold",
}))

const TimelineItem = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderLeft: `2px solid ${theme.palette.divider}`,
}))

const TimelineYear = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.primary.main,
  minWidth: "60px",
}))

const TabPanel = (props) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`about-tabpanel-${index}`}
      aria-labelledby={`about-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const tabs = ["History", "Mission", "Team", "Contact"]

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <Typography variant="h2" component="h1" gutterBottom>
            About Premier Motors
          </Typography>
          <Typography variant="h6">Your trusted partner in automotive excellence since 1985</Typography>
        </HeroContent>
      </HeroSection>

      {/* Navigation Tabs */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab} id={`about-tab-${index}`} aria-controls={`about-tabpanel-${index}`} />
            ))}
          </Tabs>
        </Box>

        {/* History Section */}
        <TabPanel value={activeTab} index={0}>
          <SectionTitle variant="h4">Our History</SectionTitle>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography paragraph>
                Founded in 1985 by automotive enthusiast James Miller, Premier Motors began as a small family-owned
                dealership with just five vehicles and three employees. Through our unwavering commitment to customer
                satisfaction and quality service, we've grown into one of the region's most respected automotive
                retailers.
              </Typography>
              <Typography paragraph>
                Over the decades, we've expanded our showroom, added multiple service centers, and built a team of
                dedicated professionals who share our passion for automobiles and customer care.
              </Typography>
              <Typography paragraph>
                Today, Premier Motors offers an extensive selection of new and pre-owned vehicles, comprehensive
                maintenance services, and financing solutions tailored to meet the unique needs of each customer.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/placeholder.svg?height=600&width=800"
                alt="Dealership history"
                sx={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom>
              Our Milestones
            </Typography>
            <Box sx={{ mt: 3 }}>
              {[
                { year: "1985", event: "Premier Motors founded by James Miller" },
                { year: "1992", event: "Expanded to our current main location" },
                { year: "2001", event: "Opened our first dedicated service center" },
                { year: "2010", event: "Celebrated 25 years with our 10,000th customer" },
                { year: "2018", event: "Launched our certified pre-owned program" },
                { year: "2023", event: "Opened our third location and expanded our electric vehicle offerings" },
              ].map((milestone, index) => (
                <TimelineItem key={index}>
                  <TimelineYear>{milestone.year}</TimelineYear>
                  <Typography>{milestone.event}</Typography>
                </TimelineItem>
              ))}
            </Box>
          </Box>
        </TabPanel>

        {/* Mission Section */}
        <TabPanel value={activeTab} index={1}>
          <SectionTitle variant="h4">Our Mission</SectionTitle>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/placeholder.svg?height=600&width=800"
                alt="Dealership showroom"
                sx={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="primary" paragraph sx={{ fontStyle: "italic" }}>
                "To provide exceptional automotive experiences through integrity, expertise, and personalized service
                that exceeds expectations and builds lasting relationships."
              </Typography>
              <Typography paragraph>
                At Premier Motors, we believe that purchasing a vehicle should be an exciting and rewarding experience.
                Our mission guides everything we do, from the moment you step into our showroom to the ongoing
                relationship we build through our service department.
              </Typography>
              <Typography paragraph>
                We're committed to transparency, fair dealing, and creating a pressure-free environment where you can
                make informed decisions about your automotive needs.
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  Our Values
                </Typography>
                <List dense>
                  <ListItem>• Integrity in every interaction</ListItem>
                  <ListItem>• Excellence in service and expertise</ListItem>
                  <ListItem>• Respect for our customers and team members</ListItem>
                  <ListItem>• Community engagement and support</ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  Our Promise
                </Typography>
                <List dense>
                  <ListItem>• Transparent pricing and policies</ListItem>
                  <ListItem>• Knowledgeable, non-pressuring staff</ListItem>
                  <ListItem>• Quality vehicles that meet our standards</ListItem>
                  <ListItem>• Ongoing support after your purchase</ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  Our Vision
                </Typography>
                <Typography>
                  To be the premier automotive destination in our region, recognized for exceptional customer
                  experiences, trusted relationships, and our contribution to a more sustainable automotive future.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Team Section */}
        <TabPanel value={activeTab} index={2}>
          <SectionTitle variant="h4">Our Team</SectionTitle>
          <Typography paragraph>
            The heart of Premier Motors is our dedicated team of professionals who bring expertise, passion, and
            personalized service to every customer interaction. Get to know the people who make Premier Motors
            exceptional.
          </Typography>

          <Grid container spacing={3}>
            {[
              {
                name: "Michael Johnson",
                position: "General Manager",
                bio: "With over 20 years in the automotive industry, Michael leads our team with expertise and a customer-first approach.",
              },
              {
                name: "Sarah Williams",
                position: "Sales Director",
                bio: "Sarah ensures our sales process is transparent, informative, and tailored to each customer's unique needs.",
              },
              {
                name: "David Chen",
                position: "Service Manager",
                bio: "David's technical knowledge and commitment to quality make our service department stand out from the competition.",
              },
              {
                name: "Jennifer Lopez",
                position: "Finance Manager",
                bio: "Jennifer works tirelessly to find the best financing solutions for our customers, making vehicle ownership accessible.",
              },
              {
                name: "Robert Smith",
                position: "Parts Department Head",
                bio: "Robert ensures we stock only quality parts and accessories to maintain the integrity of your vehicle.",
              },
              {
                name: "Lisa Brown",
                position: "Customer Relations",
                bio: "Lisa's dedication to customer satisfaction has helped build our reputation for exceptional service.",
              },
            ].map((member, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`/placeholder.svg?height=400&width=400&text=${encodeURIComponent(member.name)}`}
                    alt={member.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      {member.position}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Contact Section */}
        <TabPanel value={activeTab} index={3}>
          <SectionTitle variant="h4">Contact Us</SectionTitle>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography paragraph>
                We're here to answer your questions and help you find the perfect vehicle for your needs. Reach out to
                us through any of the following methods, or visit our showroom to experience Premier Motors in person.
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Visit Us"
                    secondary={
                      <React.Fragment>
                        123 Automotive Drive
                        <br />
                        Cartown, CT 12345
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Call Us"
                    secondary={
                      <React.Fragment>
                        (555) 123-4567
                        <br />
                        <Typography variant="caption">Mon-Sat: 9am-7pm, Sun: 11am-5pm</Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Us"
                    secondary={
                      <React.Fragment>
                        info@premiermotors.example
                        <br />
                        <Typography variant="caption">We respond within 24 hours</Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </List>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Hours of Operation
                </Typography>
                <List dense>
                  {[
                    { day: "Monday - Friday", hours: "9:00 AM - 7:00 PM" },
                    { day: "Saturday", hours: "9:00 AM - 6:00 PM" },
                    { day: "Sunday", hours: "11:00 AM - 5:00 PM" },
                  ].map((schedule, index) => (
                    <ListItem key={index} sx={{ justifyContent: "space-between" }}>
                      <Typography variant="body2">{schedule.day}</Typography>
                      <Typography variant="body2">{schedule.hours}</Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/placeholder.svg?height=800&width=800&text=Map"
                alt="Dealership location map"
                sx={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            </Grid>
          </Grid>
        </TabPanel>
      </Container>
    </Box>
  )
}

