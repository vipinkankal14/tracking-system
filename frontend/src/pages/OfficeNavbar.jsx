import { useState, useEffect, useRef, useCallback } from "react";
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
  Skeleton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Cars", path: "/Productlist" },
  { name: "Services", path: "/services" },
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/ContactUs" },
];

const OfficeNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef(null);

  // Menu handlers
  const handleMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    menuButtonRef.current?.focus();
  }, []);

  const handleOpenMobileMenu = () => setMobileOpen(true);
  const handleCloseMobileMenu = () => setMobileOpen(false);

  // Authentication check
  useEffect(() => {
    let isMounted = true;
    
    const fetchUserData = async () => {
      try {
        const data = JSON.parse(localStorage.getItem("userData"));
        const token = localStorage.getItem("authToken");
        const expiry = localStorage.getItem("tokenExpiry");

        if (!isMounted) return;

        if (!data || !token || !expiry) {
          navigate("/login");
          return;
        }

        if (Date.now() > parseInt(expiry)) {
          await handleLogout();
          return;
        }

        if (isMounted) setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (isMounted) navigate("/login");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Logout functionality
  const handleLogout = useCallback(async () => {
    setLogoutLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Logout error:", error);
      }
    } finally {
      localStorage.clear();
      setLogoutLoading(false);
      handleMenuClose();
      handleCloseMobileMenu();
      navigate("/login");
    }
  }, [navigate, handleMenuClose]);

  // Profile navigation
  const handleProfileNavigation = useCallback(() => {
    if (!userData) return;
    navigate(userData.navigate || '/profile');
    handleMenuClose();
  }, [userData, navigate, handleMenuClose]);

  // Loading state
  if (loading) {
    return (
      <AppBar position="static" sx={{ bgcolor: 'background.paper' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Skeleton variant="text" width={120} height={40} />
          <Box display="flex" alignItems="center" gap={2}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="text" width={100} height={40} />
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  const mobileMenu = (
    <Box sx={{ width: 250, display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        p: 2, 
        borderBottom: "1px solid", 
        borderColor: "divider"
      }}>
        <Typography variant="h6">Menu</Typography>
        <IconButton onClick={handleCloseMobileMenu}>
          <CloseIcon />
        </IconButton>
      </Box>

      {userData && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={userData?.profile_image || '/default-profile.png'}
              sx={{ width: 48, height: 48 }}
              onError={(e) => e.target.src = '/default-profile.png'}
            />
            <Stack>
              <Typography variant="subtitle2">
                {userData?.firstName} {userData?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {userData?.emp_id}
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
        {userData ? (
          <>
            <Button
              fullWidth
              variant="contained"
              onClick={handleProfileNavigation}
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
              disabled={logoutLoading}
            >
              {logoutLoading ? <CircularProgress size={24} /> : "Logout"}
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
      <AppBar position="static" sx={{
        bgcolor: "background.paper",
        backgroundImage: "none",
        borderBottom: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
      }}>
        <Toolbar sx={{ padding: "0 16px", minHeight: "64px", height: "64px" }}>
          {/* Mobile Menu Button */}
          <Box sx={{ flexGrow: 0, display: { md: "none" }, mr: 2 }}>
            <IconButton
              size="medium"
              aria-label="open menu"
              edge="start"
              onClick={handleOpenMobileMenu}
              sx={{ color: "text.primary" }}
            >
              <MenuOpenIcon />
            </IconButton>
          </Box>

          {/* Logo/Brand */}
          <Typography
            variant="h6"
            component={Link}
            to="/dashboard"
            sx={{
              color: "text.primary",
              textDecoration: "none",
              mr: "auto",
              "&:hover": { color: "primary.main" },
            }}
          >
            Dashboard
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "end",
            mx: 4,
            gap: 3
          }}>
            {navLinks.map((link) => (
              <Typography
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
              </Typography>
            ))}
          </Box>

          {/* Desktop Profile Section */}
          {userData && (
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              <Box
                ref={menuButtonRef}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                }}
                onClick={handleMenuOpen}
              >
                <Stack sx={{ textAlign: "right", lineHeight: 1.2, mr: 1 }}>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {userData.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    ID: {userData.emp_id}
                  </Typography>
                </Stack>
                <Avatar
                  src={userData.profile_image || "/default-profile.png"}
                  sx={{ width: 40, height: 40 }}
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
                <MenuItem onClick={handleProfileNavigation}>
                  <Avatar src={userData.profile_image} sx={{ mr: 2 }} />
                  My Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} disabled={logoutLoading}>
                  {logoutLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <>
                      <LogoutIcon sx={{ mr: 1.5 }} />
                      Logout
                    </>
                  )}
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
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
};

export default OfficeNavbar;