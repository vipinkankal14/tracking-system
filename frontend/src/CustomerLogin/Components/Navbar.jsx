import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  Stack,
  useTheme
} from "@mui/material";

const Navbar = ({ userData, onLogout }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await onLogout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLogoutLoading(false);
      handleMenuClose();
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "background.paper",
        backgroundImage: "none",
        borderBottom: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
        height: "64px",
      }}
    >
      <Toolbar
        variant="regular"
        sx={{
          padding: "0 16px",
          minHeight: "64px",
          height: "64px",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            color: "text.primary",
            textDecoration: "none",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          Dashboard
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
            onClick={handleMenuOpen}
          >
            <Stack
              sx={{
                textAlign: "right",
                lineHeight: 1.2,
                mr: 1,
              }}
            >
              <Typography variant="caption" color="secondary" noWrap>
                {userData?.firstName || "User"}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                ID: {userData?.customerId || "N/A"}
              </Typography>
            </Stack>

            <Avatar
              src={userData?.profile_image || '/default-profile.png'}
              alt={`${userData?.firstName || 'User'}'s profile`}
              sx={{ width: 40, height: 40 }}
              onError={(e) => {
                e.target.src = '/default-profile.png';
              }}
            />
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                minWidth: 200,
                overflow: 'visible',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem 
              onClick={() => { 
                navigate('/profile'); 
                handleMenuClose(); 
              }}
            >
              <Avatar 
                src={userData?.profile_image || '/default-profile.png'} 
                sx={{ mr: 2 }}
              />
              My Profile
            </MenuItem>
            <Divider />
            <MenuItem 
              onClick={handleLogout}
              disabled={logoutLoading}
            >
              {logoutLoading ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  <Box component="span" sx={{ ml: 1 }}>Logout</Box>
                </>
              )}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;