import React from "react";
import { TextField, Grid } from "@mui/material";
import "./scss/page.scss";

const CarInfo = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData(name, value);
  };

  return (
    <div>
      <Grid container spacing={3} className="desktop-only-margin-CarInfo">
        

      <Grid item xs={12}>car datalist</Grid>
        {/* team */}
        <Grid item xs={12} sm={3}>
          <TextField
            name="teamLeader"
            label="Team Leader"
            value={data.teamLeader}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            name="teamMember"
            label="Team Member"
            value={data.teamMember}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>

        {/* Spacer */}
        <Grid item xs={12}>car datalist</Grid>
        
        {/* car */}
        <Grid item xs={12} sm={2}>
          <TextField
            name="carType"
            label="Car Type"
            value={data.carType}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            name="model"
            label="Model"
            value={data.model}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            name="version"
            label="Version"
            value={data.version}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            name="color"
            label="Color"
            value={data.color}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>

        {/* Spacer */}
        <Grid item xs={12} style={{marginTop:'-24px'}}></Grid>

        {/* exShowroomPrice */}
        <Grid item xs={12} sm={2}>
          <TextField
            name="exShowroomPrice"
            label="Ex-Showroom Price"
            value={data.exShowroomPrice}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
       
      </Grid>
    </div>
  );
};

export default CarInfo;