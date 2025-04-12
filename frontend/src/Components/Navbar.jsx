import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "cars", path: "/Productlist" },
  { name: "Services", path: "/services" },
  { name: "About Us", path: "/about" }, 
  { name: "Contact Us", path: "/ContactUs" },

];

function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleOpenMobileMenu = () => setMobileOpen(true);
  const handleCloseMobileMenu = () => setMobileOpen(false);

  const mobileMenu = (
    <Box
      sx={{
        width: 250,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      role="presentation"
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6">Menu</Typography>
        <IconButton onClick={handleCloseMobileMenu}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Main Navigation */}
      <List
        sx={{
          flex: 1,
          borderRadius: 1,
          mx: 2,
        }}
      >
        {navLinks.map((link) => (
          <ListItem key={link.path} disablePadding>
            <ListItemButton
              component={Link}
              to={link.path}
              onClick={handleCloseMobileMenu}
              selected={location.pathname === link.path}
              sx={{
                "&.Mui-selected": {
                  bgcolor: "action.selected",
                  color: "primary.main",
                },
              }}
            >
              <ListItemText primary={link.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer with Auth Buttons */}
      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          p: 2,
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          component={Link}
          to="/login"
          onClick={handleCloseMobileMenu}
          sx={{ mb: 1 }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          bgcolor: "background.paper",
          backgroundImage: "none",
          borderBottom: "1px solid",
          borderColor: "divider",
          top: "var(--template-frame-height, 0px)",
          boxShadow: "none",
          height: "64px", // Set a fixed height for the AppBar
        }}
      >
        <Toolbar
          variant="regular"
          sx={{
            padding: "0 16px", // Reduce padding
            minHeight: "64px", // Set a minimum height for the Toolbar
            height: "64px", // Set a fixed height for the Toolbar
          }}
        >
          {/* Mobile menu icon */}
          <Box sx={{ flexGrow: 0, display: { md: "none" }, mr: 2 }}>
            <IconButton
              size="medium" // Use medium size for a compact look
              aria-label="open menu"
              edge="start"
              color="inherit"
              onClick={handleOpenMobileMenu}
              sx={{ color: "text.primary" }}
            >
              <MenuOpenIcon />
            </IconButton>
          </Box>

          {/* Title */}
          <Typography
            variant="h6" // Use h6 for a smaller size
            component={Link}
            to="/"
            sx={{
              color: "text.primary",
              textDecoration: "none",
              mr: "auto",
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            Dashboard
          </Typography>

          {/* Desktop navigation */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "end",
              mx: 4,
            }}
          >
            {navLinks.map((link) => (
              <Typography
                key={link.path}
                component={Link}
                to={link.path}
                size="medium" // Use medium size for a compact look
                sx={{
                  mx: 1,
                  color:
                    location.pathname === link.path
                      ? "primary.main"
                      : "text.secondary",
                  textDecoration: "none",
                  fontWeight: location.pathname === link.path ? 600 : 400,
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                {link.name}
              </Typography>
            ))}
          </Box>

          {/* Login/Signup buttons */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, ml: "auto" }}>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="medium" // Use medium size for a compact look
              sx={{
                color: "text.primary",
                borderColor: "divider",
                "&:hover": {
                  borderColor: "primary.main",
                },
              }}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile menu drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleCloseMobileMenu}
        ModalProps={{ keepMounted: true }}
      >
        {mobileMenu}
      </Drawer>
    </>
  );
}

export default Navbar;
