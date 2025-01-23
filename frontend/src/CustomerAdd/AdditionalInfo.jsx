import React from "react";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Grid } from "@mui/material";
import "./scss/page.scss";


const AdditionalInfo = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData(name, value);
  };

  return (
    <div>
      <Grid container 
        spacing={4} 
        className="desktop-only-margin-AdditionalInfo"
      >
        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset" size="small">
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
        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset" size="small">
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
        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset" size="small">
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
        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset" size="small">
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
        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset" size="small">
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
      </Grid>
    </div>
  );
};

export default AdditionalInfo;