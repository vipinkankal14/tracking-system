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
  Typography,
  styled,
} from "@mui/material"
 
// Import the image
import OTTO1959 from "../DiscountBanner/assets/OTTO1959.jpg"
import OTTO2170 from "../DiscountBanner/assets/OTTO2170.jpg"
import MEN201801250011 from "../DiscountBanner/assets/MEN201801250011.jpg"




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

 

// Simple Bullet Container (no animations)
const BulletContainer = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 30,
  height: 30,
  borderRadius: "50%",
  marginRight: theme.spacing(1),
  background: theme.palette.primary.main,
  color: "#fff",
}))

// Team Member Icon Container (no animations)
const TeamMemberIconContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 10,
  right: 10,
  width: 40,
  height: 40,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  zIndex: 2,
}))

export default function AboutUs() {
 
  return (
    <Box>
  

         

      {/* Navigation Tabs */}
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* History Section */}
        
            <Box
              textAlign="center"
              mb={6}
              sx={{
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                padding: "40px 20px",
                borderRadius: "16px",
                color: "white",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                About Premier Motors
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  maxWidth: "800px",
                  margin: "0 auto",
                  opacity: 0.9,
                }}
              >
               Your trusted partner in automotive excellence since 1985
              </Typography>
            </Box>

        <Grid container spacing={0}>
          
          <Grid item xs={12} md={6}>
          <SectionTitle className="footer-title" variant="h4">
          Our History
           </SectionTitle>
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
            <Box sx={{ mt: 6 }}>
              <Typography className="footer-title" variant="h5" gutterBottom>
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
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={OTTO1959}
              alt="Dealership history"
              sx={{
                width: "100%",
                height: "700px",
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={0}>
          <SectionTitle className="footer-title" variant="h4" sx={{ justifyContent: "center", display: "flex" }}>
            Our Mission
          </SectionTitle>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={OTTO2170}
                alt="Dealership showroom"
                sx={{
                  width: "100%",
                  height: "760px",
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
              <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
                <Typography className="footer-title" variant="h6" gutterBottom>
                  Our Values
                </Typography>
                <List dense>
                  <ListItem>
                    <BulletContainer>•</BulletContainer>
                    <ListItemText primary="Integrity in every interaction" />
                  </ListItem>
                  <ListItem>
                    <BulletContainer>•</BulletContainer>
                    <ListItemText primary="Excellence in service and expertise" />
                  </ListItem>
                  <ListItem>
                    <BulletContainer>•</BulletContainer>
                    <ListItemText primary="Respect for our customers and team members" />
                  </ListItem>
                  <ListItem>
                    <BulletContainer>•</BulletContainer>
                    <ListItemText primary="Community engagement and support" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
                <Typography className="footer-title"  variant="h6" gutterBottom>
                  Our Promise
                </Typography>
                <List dense>
                  <ListItem>
                    <BulletContainer>•</BulletContainer>
                    <ListItemText primary="Transparent pricing and policies" />
                  </ListItem>
                  <ListItem>
                    <BulletContainer>•</BulletContainer>
                    <ListItemText primary="Knowledgeable, non-pressuring staff" />
                  </ListItem>
                  <ListItem>
                    <BulletContainer>•</BulletContainer>
                    <ListItemText primary="Quality vehicles that meet our standards" />
                  </ListItem>
                  <ListItem>
                    <BulletContainer>•</BulletContainer>
                    <ListItemText primary="Ongoing support after your purchase" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={12}>
              <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
                <Typography className="footer-title" variant="h6" gutterBottom>
                  Our Vision
                </Typography>
                <Typography>
                  To be the premier automotive destination in our region, recognized for exceptional customer
                  experiences, trusted relationships, and our contribution to a more sustainable automotive future.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
            </Grid>
            
          </Grid>
        
        </Grid>

        {/* Team Section */}
        <Grid container spacing={0}>
          <SectionTitle className="footer-title" variant="h4">Our Team</SectionTitle>
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
                icon: "👨‍💼",
              },
              {
                name: "Sarah Williams",
                position: "Sales Director",
                bio: "Sarah ensures our sales process is transparent, informative, and tailored to each customer's unique needs.",
                icon: "👩‍💼",
              },
              {
                name: "David Chen",
                position: "Service Manager",
                bio: "David's technical knowledge and commitment to quality make our service department stand out from the competition.",
                icon: "🔧",
              },
              {
                name: "Jennifer Lopez",
                position: "Finance Manager",
                bio: "Jennifer works tirelessly to find the best financing solutions for our customers, making vehicle ownership accessible.",
                icon: "💰",
              },
              {
                name: "Robert Smith",
                position: "Parts Department Head",
                bio: "Robert ensures we stock only quality parts and accessories to maintain the integrity of your vehicle.",
                icon: "🔩",
              },
              {
                name: "Lisa Brown",
                position: "Customer Relations",
                bio: "Lisa's dedication to customer satisfaction has helped build our reputation for exceptional service.",
                icon: "🤝",
              },
            ].map((member, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card sx={{ display: "flex", flexDirection: "column", position: "relative" }}>
                  <TeamMemberIconContainer>{member.icon}</TeamMemberIconContainer>
                  <CardMedia
                    component="img"
                    
               
                  image={MEN201801250011}
                  alt={member.name}
                  sx={{
                    objectFit: 'cover',
                     height:"300px",
                    width:"351px",
                    filter: 'brightness(0.8)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
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
        </Grid>

  
      </Container>
      <br /><br />
    </Box>
  )
}
