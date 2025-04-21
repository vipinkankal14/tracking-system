import { useState, useEffect } from "react";
import CarCategories from "./CarCategories/CarCategories";
import SuggestedProducts from "./SuggestedProducts";
import SuggestedProducts1530 from "./SuggestedProducts1530";
import { Box, Typography, CircularProgress, Divider } from "@mui/material";

function Productlist() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // You can add any initialization logic here if needed
    const initializeProductList = async () => {
      try {
        setLoading(true);
        // Any initialization API calls can go here
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        setError("Failed to load product listings");
        console.error("Error initializing product list:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeProductList();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="product-list-container">
      {/* Main car categories section */}
      <CarCategories />
      
      {/* Suggested products sections */}
      <Divider sx={{ my: 4 }} />
      <SuggestedProducts />
      <SuggestedProducts1530 />
    </Box>
  );
}

export default Productlist;
