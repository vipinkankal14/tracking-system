 "use client";

 import { 
 
  Box, 
 
  AppBar,
  Toolbar,
 
} from "@mui/material";
 import NotificationSystem from "../../AdditionalInfo/carStocks/CarManagement/NotificationSystem";

const CarAppNavbar = () => {
 
 
  
 

  return (
    < 
    >
      <Box
        variant="regular"
        sx={{
          padding: "0 16px",
          minHeight: "64px",
          height: "64px",
          justifyContent: "end",
          display: 'flex',
          position:'relative'
        }}
      >
         
      

        <Box sx={{ display: "flex", alignItems: "end", gap: 2 }}>
          <NotificationSystem />
        </Box>
      </Box>
    </>
  );
};

export default CarAppNavbar;