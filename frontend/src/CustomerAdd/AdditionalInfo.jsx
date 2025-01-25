import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
} from "@mui/material";
import "./scss/page.scss";
import { useNavigate } from "react-router-dom";

const AdditionalInfo = ({ data, updateData }) => {

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData(name, value);
  
     
  };
  

  return (
    <div className="desktop-only-margin-AdditionalInfo">
      <Grid container spacing={4} style={{ marginTop: "-1rem"}}>
        {/* Exchange */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl component="fieldset" size="small" fullWidth>
            <FormLabel component="legend">Exchange</FormLabel>
            <RadioGroup
              name="exchange"
              value={data.exchange}
              onChange={handleChange}
              row
            >
              <FormControlLabel
                value="Yes"
                control={<Radio size="small" />}
                label="Yes"
              />
              <FormControlLabel
                value="No"
                control={<Radio size="small" />}
                label="No"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Finance */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl component="fieldset" size="small" fullWidth>
            <FormLabel component="legend">Finance</FormLabel>
            <RadioGroup
              name="finance"
              value={data.finance}
              onChange={handleChange}
              row
            >
              <FormControlLabel
                value="Yes"
                control={<Radio size="small" />}
                label="Yes"
              />
              <FormControlLabel
                value="No"
                control={<Radio size="small" />}
                label="No"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Accessories */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl component="fieldset" size="small" fullWidth>
            <FormLabel component="legend">Accessories</FormLabel>
            <RadioGroup
              name="accessories"
              value={data.accessories}
              onChange={handleChange}
              row
            >
              <FormControlLabel
                value="Yes"
                control={<Radio size="small" />}
                label="Yes"
              />
              <FormControlLabel
                value="No"
                control={<Radio size="small" />}
                label="No"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Coating */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl component="fieldset" size="small" fullWidth>
            <FormLabel component="legend">Coating</FormLabel>
            <RadioGroup
              name="coating"
              value={data.coating}
              onChange={handleChange}
              row
            >
              <FormControlLabel
                value="Yes"
                control={<Radio size="small" />}
                label="Yes"
              />
              <FormControlLabel
                value="No"
                control={<Radio size="small" />}
                label="No"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* FastTag */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl component="fieldset" size="small" fullWidth>
            <FormLabel component="legend">FastTag</FormLabel>
            <RadioGroup
              name="fastTag"
              value={data.fastTag}
              onChange={handleChange}
              row
            >
              <FormControlLabel
                value="Yes"
                control={<Radio size="small" />}
                label="Yes"
              />
              <FormControlLabel
                value="No"
                control={<Radio size="small" />}
                label="No"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* RTO */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl component="fieldset" size="small" fullWidth>
            <FormLabel component="legend">RTO</FormLabel>
            <RadioGroup
              name="rto"
              value={data.rto}
              onChange={handleChange}
              row
            >
              <FormControlLabel
                value="Yes"
                control={<Radio size="small" />}
                label="Yes"
              />
              <FormControlLabel
                value="No"
                control={<Radio size="small" />}
                label="No"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdditionalInfo;
