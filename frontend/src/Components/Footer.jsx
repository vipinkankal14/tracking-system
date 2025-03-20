import { Box, Container, Grid, Typography, Link, IconButton, Divider } from "@mui/material"
import { Facebook, Twitter, Instagram, YouTube, Email, Phone, LocationOn } from "@mui/icons-material"
import { Link as RouterLink } from "react-router-dom"
import "../styles/footer.scss"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom className="footer-heading">
              Premium Auto Dealership
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Your trusted partner in finding the perfect vehicle. We offer a wide selection of new and pre-owned cars,
              trucks, and SUVs.
            </Typography>
            <Box className="social-icons">
              <IconButton color="primary" aria-label="facebook">
                <Facebook />
              </IconButton>
              <IconButton color="primary" aria-label="twitter">
                <Twitter />
              </IconButton>
              <IconButton color="primary" aria-label="instagram">
                <Instagram />
              </IconButton>
              <IconButton color="primary" aria-label="youtube">
                <YouTube />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom className="footer-heading">
              Quick Links
            </Typography>
            <ul className="footer-links">
              <li>
                <Link component={RouterLink} to="/" color="inherit">
                  Home
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/about" color="inherit">
                  About Us
                </Link>
              </li>
        
              <li>
                <Link component={RouterLink} to="/services" color="inherit">
                  Services
                </Link>
              </li>
        
              <li>
                <Link component={RouterLink} to="/login" color="inherit">
                  Login
                </Link>
              </li>
            </ul>
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
            <Typography variant="h6" gutterBottom className="footer-heading">
              Contact Information
            </Typography>
            <Box className="contact-info">
              <Box display="flex" alignItems="center" mb={1}>
                <LocationOn fontSize="small" className="contact-icon" />
                <Typography variant="body2">123 Auto Drive, Car City, CC 12345</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Phone fontSize="small" className="contact-icon" />
                <Typography variant="body2">(555) 123-4567</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Email fontSize="small" className="contact-icon" />
                <Typography variant="body2">info@premiumauto.com</Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="textSecondary" className="hours">
              <strong>Hours:</strong> Monday-Friday: 9AM-8PM
              <br />
              Saturday: 10AM-6PM | Sunday: Closed
            </Typography>
          </Grid>
        </Grid>

        <Divider className="footer-divider" />

        <Box className="copyright">
          <Typography variant="body2" color="textSecondary" align="center">
            © {currentYear} Premium Auto Dealership. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer

