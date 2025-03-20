"use client";
import { Link as RouterLink } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

function Sidebar({ isMobile, toggleSidebar }) {
  return (
    <Drawer
      anchor="left"
      open={isMobile}
      onClose={toggleSidebar} // Close the sidebar when clicking outside or pressing Esc
      ModalProps={{ keepMounted: true }} // Better open performance on mobile
      PaperProps={{ elevation: 0 }}
      variant="temporary"
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "280px", sm: "350px" },
          boxSizing: "border-box",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Menu</Typography>
        <IconButton edge="end" onClick={toggleSidebar}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ mt: 2 }}>
        {navLinks.map((link) => (
          <ListItem key={link.name} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={link.href}
              sx={{
                borderRadius: 1,
                mx: 1,
                "&.Mui-selected": {
                  backgroundColor: "action.selected",
                  color: "primary.main",
                },
              }}
            >
              <ListItemText primary={link.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: 2 }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/login"
            sx={{ borderRadius: 1, mx: 1 }}
          >
            <ListItemText primary="Login" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/signup"
            sx={{ borderRadius: 1, mx: 1 }}
          >
            <ListItemText primary="Sign Up" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;