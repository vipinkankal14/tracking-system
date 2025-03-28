"use client";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Container,
} from "@mui/material";

function PersonalInfo({ data, updateData }) {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="First Name"
            value={data.firstName}
            onChange={(e) => updateData("firstName", e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Middle Name"
            value={data.middleName}
            onChange={(e) => updateData("middleName", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Last Name"
            value={data.lastName}
            onChange={(e) => updateData("lastName", e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Customer Type</InputLabel>
            <Select
              value={data.customerType}
              label="Customer Type"
              onChange={(e) => updateData("customerType", e.target.value)}
            >
              <MenuItem value="Individual">Individual</MenuItem>
              <MenuItem value="Corporate">Corporate</MenuItem>
              <MenuItem value="Government">Government</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Mobile Number 1"
            value={data.mobileNumber1}
            onChange={(e) => updateData("mobileNumber1", e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Mobile Number 2"
            value={data.mobileNumber2}
            onChange={(e) => updateData("mobileNumber2", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="date"
            label="Birth Date"
            value={data.birthDate || ""}
            onChange={(e) =>
              updateData(
                "birthDate", // ← Missing field name parameter
                e.target.value
              )
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={data.email}
            onChange={(e) => updateData("email", e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Aadhaar Number"
            value={data.aadhaarNumber}
            onChange={(e) => updateData("aadhaarNumber", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="PAN Number"
            value={data.panNumber}
            onChange={(e) => updateData("panNumber", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="City"
            value={data.city}
            onChange={(e) => updateData("city", e.target.value)}
            required
          />{" "}
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="State"
            value={data.state}
            onChange={(e) => updateData("state", e.target.value)}
            required
          />{" "}
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Country"
            value={data.country}
            onChange={(e) => updateData("country", e.target.value)}
            required
          />{" "}
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            label="Address"
            multiline
            rows={3}
            value={data.address}
            onChange={(e) => updateData("address", e.target.value)}
            required
          />
        </Grid>
      </Grid>
    </>
  );
}

export default PersonalInfo;
