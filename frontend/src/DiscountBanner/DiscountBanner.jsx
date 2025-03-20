import React from 'react';
import { Box, Typography } from '@mui/material';
import '../DiscountBanner/DiscountBanner.scss'; 
import discount from "./assets/discount.jpg";

const DiscountBanner = () => {
  return (
    <Box 
      className="discount-banner"
      style={{
        backgroundImage: `url(${discount})`, // Use the imported image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '44px',

        textAlign: 'center',
        color: '#fff', // Adjust text color for better visibility
        height: '460px', // Set a fixed height for the banner
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
        position: 'relative', // For positioning the button
        
      }}
    >
      {/* Offer Text - Centered */}
      <Typography variant="h4" className="discount-text">
        🎉 Special Offer! Get 20% Off 🎉
      </Typography>
      <Typography variant="body1" className="discount-description">
        Limited time only. Use code <strong>DISCOUNT20</strong> at checkout.
      </Typography>

 
    </Box>
  );
};

export default DiscountBanner;