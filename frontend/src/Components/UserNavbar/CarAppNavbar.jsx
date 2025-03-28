import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import NotificationSystem from "../../AdditionalInfo/carStocks/CarManagement/NotificationSystem";
 
function CarAppNavbar() {
  const location = useLocation();

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
        <Toolbar
          variant="regular"
          sx={{
            padding: "0 16px",
            minHeight: "64px",
            height: "64px",
            justifyContent: "space-between", // Add this to space items evenly
          }}
        >
          {/* Dashboard Title */}
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

          {/* Right-side elements */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Notification System */}
            <NotificationSystem />

            {/* Logout Button */}
            <Button
              component={Link}
              to="/logout" // Fixed typo from "loguot" to "logout"
              variant="outlined"
              size="medium"
              sx={{
                color: "text.primary",
                borderColor: "divider",
                "&:hover": {
                  borderColor: "primary.main",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default CarAppNavbar;