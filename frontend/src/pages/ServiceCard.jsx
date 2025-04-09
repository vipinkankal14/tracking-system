import { Card, CardContent, CardActions, Typography, Button, Box } from "@mui/material"

const ServiceCard = ({ title, description, icon, actionText, colorIndex }) => {
  // Array of vibrant gradient backgrounds
  const gradients = [
    "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    "linear-gradient(135deg, #a6c0fe 0%, #f68084 100%)",
    "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
    "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  ]

  // Button colors that complement the gradients
  const buttonColors = ["#ff6b6b", "#4e8cff", "#ff8c42", "#2dd4bf", "#f43f5e", "#a855f7", "#3b82f6", "#ec4899"]

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s, box-shadow 0.3s, filter 0.3s",
        background: gradients[colorIndex % gradients.length],
        "&:hover": {
          transform: "translateY(-8px) scale(1.03)",
          boxShadow: "0 12px 20px rgba(0, 0, 0, 0.2)",
          filter: "brightness(1.05)",
        },
        borderRadius: "12px",
        overflow: "hidden",
      }}
      elevation={3}
    >
      <CardContent sx={{ flexGrow: 1, color: "white" }}>
        <Box
          display="flex"
          justifyContent="center"
          mb={2}
          sx={{
            color: "white",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "50%",
            padding: "16px",
            width: "64px",
            height: "64px",
            margin: "0 auto 16px auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
        <Typography
          gutterBottom
          variant="h5"
          component="h2"
          align="center"
          sx={{
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          component="p"
          align="center"
          sx={{
            color: "rgba(255, 255, 255, 0.9)",
            fontWeight: "medium",
          }}
        >
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "center", pb: 3 }}>
        
      </CardActions>
    </Card>
  )
}

export default ServiceCard
