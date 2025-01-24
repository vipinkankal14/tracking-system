import React from "react";
import { TextField, Grid, Checkbox, FormControlLabel } from "@mui/material";
import "./scss/page.scss";

const OrderInfo = ({ data, updateData }) => {
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    if (name === "orderDate" && checked) {
      updateData("orderDate", "yes");
      updateData("prebooking", "no");
    } else if (name === "prebooking" && checked) {
      updateData("prebooking", "yes");
      updateData("orderDate", "no");
    } else {
      updateData(name, "no");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData(name, value);
  };

  return (
    <div>
      {/* Two Mutually Exclusive Checkboxes */}
      <Grid container spacing={2} style={{ marginTop: "-1rem",marginLeft:"1px" }}>
        <Grid item xs={12} sm={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="orderDate"
                checked={data.orderDate === "yes"}
                onChange={handleCheckboxChange}
                size="small"
              />
            }
            label="Order Date"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="prebooking"
                checked={data.prebooking === "yes"}
                onChange={handleCheckboxChange}
                size="small"
              />
            }
            label="Prebooking"
          />
        </Grid>
      </Grid>

      {/* Conditional Fields for Order Date */}
      {data.orderDate === "yes" && (
        <Grid container spacing={3} style={{ marginTop: "-1rem",padding:"10px" }}>
          <Grid item xs={12} sm={4}>
            <TextField
              name="tentativeDate"
              label="Tentative Date"
              type="date"
              value={data.tentativeDate}
              onChange={handleChange}
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="preferredDate"
              label="Preferred Date"
              type="date"
              value={data.preferredDate}
              onChange={handleChange}
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="requestDate"
              label="Request Date"
              type="date"
              value={data.requestDate}
              onChange={handleChange}
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      )}

      {/* Conditional Fields for Prebooking */}
      {data.prebooking === "yes" && (
        <Grid container spacing={3} style={{ marginTop: "-1rem",padding:"10px" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="prebookingDate"
              label="Prebooking Date"
              type="date"
              value={data.prebookingDate}
              onChange={handleChange}
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="deliveryDate"
              label="Delivery Date"
              type="date"
              value={data.deliveryDate}
              onChange={handleChange}
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default OrderInfo;
