import React from "react";
import { 
  TextField, 
  Grid, 
  Checkbox, 
  FormControlLabel, 
  Container, 
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";

const OrderInfo = ({ data, updateData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    <Container maxWidth={false} sx={{ p: isMobile ? 1 : 3 }}>
      <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
        Order Info
      </Typography>
      
      <Grid container spacing={isMobile ? 1 : 2}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="orderDate"
                checked={data.orderDate === "yes"}
                onChange={handleCheckboxChange}
                size={isMobile ? "small" : "medium"}
              />
            }
            label="Order Date"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="prebooking"
                checked={data.prebooking === "yes"}
                onChange={handleCheckboxChange}
                size={isMobile ? "small" : "medium"}
              />
            }
            label="Prebooking"
          />
        </Grid>
      </Grid>

      {/* Conditional Fields for Order Date */}
      {data.orderDate === "yes" && (
        <Grid 
          container 
          spacing={isMobile ? 1 : 2} 
          sx={{ 
            mt: isMobile ? -0.5 : -1,
            p: isMobile ? 0.5 : 2
          }}
        >
          {["tentativeDate", "preferredDate", "requestDate"].map((field) => (
            <Grid item xs={12} sm={4} key={field}>
              <TextField
                fullWidth
                name={field}
                label={field.replace(/([A-Z])/g, ' $1')}
                type="date"
                value={data[field]}
                onChange={handleChange}
                size={isMobile ? "small" : "medium"}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Conditional Fields for Prebooking */}
      {data.prebooking === "yes" && (
        <Grid 
          container 
          spacing={isMobile ? 1 : 2}
          sx={{ 
            mt: isMobile ? -0.5 : -1,
            p: isMobile ? 0.5 : 2
          }}
        >
          {["prebookingDate", "deliveryDate"].map((field) => (
            <Grid item xs={12} sm={6} key={field}>
              <TextField
                fullWidth
                name={field}
                label={field.replace(/([A-Z])/g, ' $1')}
                type="date"
                value={data[field]}
                onChange={handleChange}
                size={isMobile ? "small" : "medium"}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default OrderInfo;