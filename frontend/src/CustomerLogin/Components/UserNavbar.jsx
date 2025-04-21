import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  Menu,
  Stack,
  Avatar,
  MenuItem,
  Divider,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { LogOutIcon } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Cars", path: "/Productlist" },
  { name: "Services", path: "/services" },
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/ContactUs" },
];

function UserNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleOpenMobileMenu = () => setMobileOpen(true);
  const handleCloseMobileMenu = () => setMobileOpen(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const expiry = localStorage.getItem("tokenExpiry");
      const isAuthenticated = !!(
        token &&
        expiry &&
        Date.now() < parseInt(expiry)
      );

      if (isAuthenticated) {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }
      }
      setIsLoggedIn(isAuthenticated);
    };

    checkAuth();
  }, [location]);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      // Add any API call for logout here if needed
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("tokenExpiry");
      setIsLoggedIn(false);
      setLogoutLoading(false);
      handleMenuClose();
      navigate("/login");
    }
  };

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
      {/* Mobile Profile Section */}
      {isLoggedIn && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={userData?.profile_image || '/default-profile.png'}
              sx={{ width: 48, height: 48 }}
              onError={(e) => e.target.src = '/default-profile.png'}
            />
            <Stack>
              <Typography variant="subtitle2">
                {userData?.firstName || "User"}  {userData?.lastName || "User"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {userData?.customerId || "N/A"}
              </Typography>
            </Stack>
          </Box>
        </Box>
      )}

      <List sx={{ flex: 1, mx: 2 }}>
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

      <Box sx={{ borderTop: "1px solid", borderColor: "divider", p: 2 }}>
        {isLoggedIn ? (
          <>
            <Button
              fullWidth
              variant="contained"
              component={Link}
              to="/customerProfile"
              onClick={handleCloseMobileMenu}
              startIcon={<AccountCircleIcon />}
              sx={{ mb: 1 }}
            >
              Profile
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            fullWidth
            variant="outlined"
            component={Link}
            to="/login"
            onClick={handleCloseMobileMenu}
          >
            Login
          </Button>
        )}
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
          boxShadow: "none",
          height: "64px",
        }}
      >
        <Toolbar sx={{ padding: "0 16px", minHeight: "64px!", height: "64px" }}>
          <Box sx={{ flexGrow: 0, display: { md: "none" }, mr: 2 }}>
            <IconButton
              size="medium"
              aria-label="open menu"
              edge="start"
              color="inherit"
              onClick={handleOpenMobileMenu}
              sx={{ color: "text.primary" }}
            >
              <MenuOpenIcon />
            </IconButton>
          </Box>

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              color: "text.primary",
              textDecoration: "none",
              mr: "auto",
              "&:hover": { color: "primary.main" },
            }}
          >
            Dashboard
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "end",
              mx: 4,
            }}
          >
            {navLinks.map((link) => (
              <Button
                key={link.path}
                component={Link}
                to={link.path}
                sx={{
                  mx: 1,
                  color:
                    location.pathname === link.path
                      ? "primary.main"
                      : "text.secondary",
                  textDecoration: "none",
                  fontWeight: location.pathname === link.path ? 600 : 400,
                  "&:hover": { color: "primary.main" },
                }}
              >
                {link.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {/* Desktop Profile Section */}
            {isLoggedIn ? (
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                  }}
                  onClick={handleMenuOpen}
                >
                  <Stack sx={{ textAlign: "right", lineHeight: 1.2 }}>
                    <Typography variant="caption" color="secondary">
                      {userData?.firstName || "User"}{" "}
                      {userData?.lastName || "User"}
                    </Typography>
                  </Stack>
                  <Avatar
                    src={userData?.profile_image || "/default-profile.png"}
                    sx={{ width: 20, height: 20 }}
                  />
                </Box>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      minWidth: 200,
                      mt: 1.5,
                      "& .MuiAvatar-root": { width: 32, height: 32, mr: 1 },
                    },
                  }}
                >
                  <MenuItem onClick={() => navigate("/customerProfile")}>
                    <Avatar src={userData?.profile_image} sx={{ mr: 2 }} />
                    My Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} disabled={logoutLoading}>
                    {logoutLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <>
                        <LogOutIcon sx={{ mr: 1.5 }} />
                        Logout
                      </>
                    )}
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                variant="outlined"
                component={Link}
                to="/login"
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

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

export default UserNavbar;
