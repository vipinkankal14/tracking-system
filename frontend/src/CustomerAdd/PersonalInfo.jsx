import React from 'react';
import { TextField, Grid } from '@mui/material';
import './scss/page.scss'

const PersonalInfo = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData(name, value);
  };

  return (
    <div >
       <Grid 
        container 
        spacing={4} 
        className="desktop-only-margin"
      > 
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label="Customer Type"
            name="customerType"
            value={data.customerType}
            onChange={handleChange}
            size='small'
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={data.firstName}
            onChange={handleChange}
            size='small'
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Middle Name"
            name="middleName"
            value={data.middleName}
            onChange={handleChange}
            size='small'
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={data.lastName}
            onChange={handleChange}
            size='small'
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label="Mobile Number 1"
            name="mobileNumber1"
            value={data.mobileNumber1}
            onChange={handleChange}
            size='small'
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label="Mobile Number 2"
            name="mobileNumber2"
            value={data.mobileNumber2}
            onChange={handleChange}
            size='small'
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={data.email}
            onChange={handleChange}
            size='small'
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Birth Date"
            name="birthDate"
            type="date"
            value={data.birthDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            size='small'
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Aadhaar Number"
            name="aadhaarNumber"
            value={data.aadhaarNumber}
            onChange={handleChange}
            size='small'
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="PAN Number"
            name="panNumber"
            value={data.panNumber}
            onChange={handleChange}
            size='small'
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={data.city}
            onChange={handleChange}
            size='small'
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label="State"
            name="state"
            value={data.state}
            onChange={handleChange}
            size='small'
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={data.country}
            onChange={handleChange}
            size='small'
          />
        </Grid>
        <Grid item xs={12} sm={10}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={data.address}
            onChange={handleChange}
            size='small'
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default PersonalInfo;