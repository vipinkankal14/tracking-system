import React from "react";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  Typography,
  Container,
} from "@mui/material";
import {
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";

import OTTO1959 from "../DiscountBanner/assets/OTTO1959.jpg";

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  fontWeight: "bold",
}));

// Simple Icon Container (no animations)
const IconContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
}));

function ContactUs() {
  return (
    <Box>
      <br />
      {/* Contact Section */}
      <Container maxWidth="lg">
        <Grid container spacing={0}>
          <Grid item xs={12} md={5}>
            <SectionTitle className="footer-title" variant="h4">
              Contact Us
            </SectionTitle>
            <Typography paragraph>
              We're here to answer your questions and help you find the perfect
              vehicle for your needs. Reach out to us through any of the
              following methods, or visit our showroom to experience Premier
              Motors in person.
            </Typography>

            <List>
              <ListItem>
                <ListItemIcon>
                  <IconContainer>
                    <LocationIcon color="primary" />
                  </IconContainer>
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
                  <IconContainer>
                    <PhoneIcon color="primary" />
                  </IconContainer>
                </ListItemIcon>
                <ListItemText
                  primary="Call Us"
                  secondary={
                    <React.Fragment>
                      (555) 123-4567
                      <br />
                      <Typography variant="caption">
                        Mon-Sat: 9am-7pm, Sun: 11am-5pm
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <IconContainer>
                    <EmailIcon color="primary" />
                  </IconContainer>
                </ListItemIcon>
                <ListItemText
                  primary="Email Us"
                  secondary={
                    <React.Fragment>
                      info@premiermotors.example
                      <br />
                      <Typography variant="caption">
                        We respond within 24 hours
                      </Typography>
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
                  <ListItem
                    key={index}
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Typography variant="body2">{schedule.day}</Typography>
                    <Typography variant="body2">{schedule.hours}</Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}></Grid> {/* Added item prop here */}

          <Grid item xs={12} md={5} mt={5}>
            <Typography variant="h6" gutterBottom>
              Dealership location map
            </Typography>
            <Box
              component="img"
              src={OTTO1959}
              alt="Dealership location map"
              sx={{
                width: "100%",
                height: "600px",
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
          </Grid>
        </Grid>
      </Container>
      <br />
    </Box>
  );
}

export default ContactUs;