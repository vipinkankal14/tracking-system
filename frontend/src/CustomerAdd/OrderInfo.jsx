import React from "react";
import { TextField, Grid, Checkbox, FormControlLabel, AppBar, Toolbar, Box, Typography } from "@mui/material";
import "./scss/page.scss";

const OrderInfo = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateData(name, type === "checkbox" ? checked : value);
  };

  return (
    <div>
      {/* Top Navbar */}
      <>
        <>
          <Box sx={{ display: "flex", alignItems: "start", gap: 2 }}>
            {/* Order Date Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  name="orderDate"
                  checked={data.orderDate}
                  onChange={handleChange}
                  size="small"
                />
              }
              label="Order Date"
              style={{ margin: 0 }}
            />

            {/* Prebooking Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  name="prebooking"
                  checked={data.prebooking}
                  onChange={handleChange}
                  size="small"
                />
              }
              label="Prebooking"
              style={{ margin: 0 }}
            />
          </Box>
        </>
      </>

      {/* Main Content */}
      <Grid container spacing={2} className="desktop-only-margin-OrderInfo">
        {/* Conditional Fields for Order Date */}
        {data.orderDate && (
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="tentativeDate"
                label="Tentative Date"
                value={data.tentativeDate}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="preferredDate"
                label="Preferred Date"
                value={data.preferredDate}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="requestDate"
                label="Request Date"
                value={data.requestDate}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>
        )}

        {/* Conditional Fields for Prebooking */}
        {data.prebooking && (
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="prebookingDate"
                label="Prebooking Date"
                value={data.prebookingDate}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="deliveryDate"
                label="Delivery Date"
                value={data.deliveryDate}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default OrderInfo;
