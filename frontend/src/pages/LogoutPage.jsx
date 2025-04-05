"use client";

import { useEffect, useState } from "react";
import { 
  Avatar, 
  Typography, 
  Box, 
  Button,
 
  Skeleton,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Stack
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
 
  const [anchorEl, setAnchorEl] = useState(null);
 
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = JSON.parse(localStorage.getItem("userData"));
        if (!data) {
          navigate("/login");
        } else {
          // Verify token expiration
          const tokenExpiry = localStorage.getItem("tokenExpiry");
          if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
            localStorage.clear();
            navigate("/login");
            return;
          }
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="circular" width={80} height={80} />
          <Box sx={{ ml: 3 }}>
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="text" width={150} height={30} />
            <Skeleton variant="text" width={100} height={30} />
          </Box>
        </Box>
      </Box>
    );
  }

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
        }}>

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
          {/* User Profile with Menu */}
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
             
              <Typography variant="caption" color="text.secondary" noWrap>
                  {userData.username || "User"}
              </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                ID: {userData.emp_id || "N/A"}
              </Typography>
            </Stack>

            <Avatar
              src={userData.profile_image || '/default-profile.png'}
              alt={`${userData.username || 'User'}'s profile`}
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
            <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
              <Avatar 
                src={userData.profile_image || '/default-profile.png'} 
                sx={{ mr: 2 }}
              />
              My Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { localStorage.clear(); navigate("/login");  }}>Logout</MenuItem>
          </Menu>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default LogoutPage;