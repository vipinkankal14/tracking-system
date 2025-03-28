"use client"

import React, { useState, useEffect } from "react"
import {
  IconButton,
  Menu,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Chip,
  CircularProgress,
  Box,
  Stack,
  Badge,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
  Tooltip,
  Fade,
} from "@mui/material"
import {
  NotificationsNoneOutlined,
 
  AccessTimeOutlined,
  DoneAll as DoneAllIcon,
} from "@mui/icons-material"
import axios from "axios"
import { useNavigate } from "react-router-dom"
 
const NotificationSystem = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [approvedCustomers, setApprovedCustomers] = useState([])
  const [fetchingCustomers, setFetchingCustomers] = useState(false)
  const [readNotifications, setReadNotifications] = useState([])
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const navigate = useNavigate()

  useEffect(() => {
    const savedReadNotifications = localStorage.getItem("readNotifications")
    if (savedReadNotifications) {
      setReadNotifications(JSON.parse(savedReadNotifications))
    }

    const fetchApprovedCustomers = async () => {
      try {
        setFetchingCustomers(true)
        const response = await axios.get("http://localhost:5000/api/Customers/Request")
        
        const approved = response.data?.data?.filter(
          (customer) =>
            (customer.status === "approved" ||
             (customer.invoiceInfo?.payment_status === "Paid")) &&
            (!customer.stockInfo || customer.stockInfo.allotmentStatus !== "Allocated") &&
            (!customer.stockInfo || customer.stockInfo.allotmentStatus !== "Not Allocated")

        )

        const customersWithTimestamp = approved.map((customer) => ({
          ...customer,
          notificationTimestamp: customer.account_management?.updatedAt || new Date().toISOString()
        }))

        const sortedCustomers = customersWithTimestamp.sort(
          (a, b) => new Date(b.notificationTimestamp) - new Date(a.notificationTimestamp)
        )

        setApprovedCustomers(sortedCustomers || [])
      } catch (err) {
        console.error("Error fetching approved customers:", err)
      } finally {
        setFetchingCustomers(false)
      }
    }

    fetchApprovedCustomers()
  }, [])

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const markAsRead = (customerId) => {
    const updatedReadNotifications = [...readNotifications, customerId]
    setReadNotifications(updatedReadNotifications)
    localStorage.setItem("readNotifications", JSON.stringify(updatedReadNotifications))
  }

  const handleCustomerClick = (customer) => {
    markAsRead(customer.customerId)
    navigate("/car-stock-show", {
      state: {
        model: customer.carBooking?.model,
        version: customer.carBooking?.version,
        color: customer.carBooking?.color,
        fuelType: customer.carBooking?.fuelType,
        customerId: customer.customerId
      }
    })
  }

  const markAllAsRead = () => {
    const allIds = approvedCustomers.map((customer) => customer.customerId)
    setReadNotifications(allIds)
    localStorage.setItem("readNotifications", JSON.stringify(allIds))
  }

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return ""
    const seconds = Math.floor((Date.now() - new Date(timestamp)) / 1000)
    
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 }
    ]

    for (const { label, seconds: divisor } of intervals) {
      const interval = Math.floor(seconds / divisor)
      if (interval >= 1) return `${interval} ${label}${interval === 1 ? "" : "s"} ago`
    }
    return "Just now"
  }

  const unreadCount = approvedCustomers.filter(
    (customer) => !readNotifications.includes(customer.customerId)
  ).length

  return (
    <Box>
      <Tooltip title="Notifications" arrow>
        <IconButton
          color="inherit"
          onClick={handleMenuOpen}
          sx={{
            position: "relative",
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.05)" },
          }}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            sx={{ "& .MuiBadge-badge": { fontSize: "0.75rem", fontWeight: "bold" } }}
          >
            <NotificationsNoneOutlined
              sx={{
                fontSize: 28,
                color: anchorEl ? "primary.main" : "text.primary",
                transition: "color 0.3s",
              }}
            />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  transformOrigin={{ vertical: "top", horizontal: "right" }}
  PaperProps={{
    elevation: 3,
    sx: {
      maxHeight: "calc(100vh - 100px)",
      width: isMobile ? "92vw" : 360,
      maxWidth: "100vw",
      borderRadius: isMobile ? 0 : 1,
      mt: 0.5,
      "& .MuiList-root": { p: 0 },
    },
  }}
  TransitionComponent={Fade}
>
  <Box sx={{
    py: 1.5,
    px: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
  }}>
    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
      Notifications ({approvedCustomers.length})
    </Typography>
    {approvedCustomers.length > 0 && unreadCount > 0 && (
      <Button
        size="small"
        onClick={markAllAsRead}
        startIcon={<DoneAllIcon fontSize="small" />}
        sx={{ fontSize: "0.75rem" }}
      >
        Mark all read
      </Button>
    )}
  </Box>

  {fetchingCustomers ? (
    <Box sx={{ py: 4, textAlign: "center" }}>
      <CircularProgress size={28} />
      <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
        Loading notifications...
      </Typography>
    </Box>
  ) : approvedCustomers.length === 0 ? (
    <Box sx={{ py: 4, textAlign: "center" }}>
      <Typography variant="body2" color="text.secondary">
        No new notifications
      </Typography>
    </Box>
  ) : (
    <List sx={{ maxHeight: 400, overflowY: "auto" }}>
      {approvedCustomers.map((customer, index) => {
        const isRead = readNotifications.includes(customer.customerId)
        return (
          <React.Fragment key={customer.customerId}>
            <ListItemButton
              onClick={() => handleCustomerClick(customer)}
              sx={{
                bgcolor: isRead ? "transparent" : 
                  theme.palette.mode === "dark" ? 
                  "rgba(144, 202, 249, 0.08)" : 
                  "rgba(33, 150, 243, 0.04)",
                "&:hover": {
                  bgcolor: theme.palette.mode === "dark" ? 
                    "rgba(255,255,255,0.08)" : 
                    "rgba(0,0,0,0.04)",
                },
              }}
            >
              <ListItem sx={{ 
                borderLeft: isRead ? "none" : `3px solid ${theme.palette.primary.main}`,
                pl: isRead ? 2 : 1.7,
              }}>
                <ListItemText
                  primary={
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    
                    }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: isRead ? "normal" : "bold",
                          color: isRead ? "text.primary" : "primary.main",
                        }}
                      >
                        {customer.customerId}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 0.1,
                          color: 'text.secondary'
                        }}
                      >
                        <AccessTimeOutlined fontSize="inherit" />
                        {formatTimeAgo(customer.notificationTimestamp)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                        {customer.firstName} {customer.lastName}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 0.1,
                        fontSize: '0.75rem',
                        color: 'text.secondary'
                      }}>
                        <span><strong>Model:</strong> {customer.carBooking?.model || "N/A"},{customer.carBooking?.version || "N/A"} Color:{customer.carBooking?.color || "N/A"} </span>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            </ListItemButton>
            {index < approvedCustomers.length - 1 && <Divider variant="inset" />}
          </React.Fragment>
        )
      })}
    </List>
  )}

  {approvedCustomers.length > 0 && (
    <Box sx={{
      p: 1.5,
      borderTop: "1px solid rgba(0,0,0,0.08)",
      bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
    }}>
      <Button fullWidth onClick={handleMenuClose}>
        Close
      </Button>
    </Box>
  )}
</Menu>
      
    </Box>
  )
}

export default NotificationSystem