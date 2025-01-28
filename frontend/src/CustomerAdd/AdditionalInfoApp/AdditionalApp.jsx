import React, { useState } from "react";
import {
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Modal,
} from "@mui/material";

const AdditionalApp = ({ data, updateData }) => {
  const [show, setShow] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (content) => {
    setModalContent(content);
    setShow(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData(name, value);
    if (name === "accessories" && value === "Yes") {
      handleShow("Accessories Details");
    }
  };

  const fields = [
    { name: "exchange", label: "Exchange" },
    { name: "finance", label: "Finance" },
    { name: "accessories", label: "Accessories" },
    { name: "coating", label: "Coating" },
    { name: "fastTag", label: "FastTag" },
    { name: "rto", label: "RTO" },
    { name: "insurance", label: "Insurance" },
    { name: "extendedWarranty", label: "Extended Warranty" },
    { name: "autoCard", label: "Auto Card" },
  ];

  return (
    <div className="desktop-only-margin-AdditionalInfo">
      <Grid container spacing={4} style={{ marginTop: "-1rem" }}>
        {fields.map((field) => (
          <Grid item xs={12} sm={6} md={3} key={field.name}>
            <FormControl component="fieldset" size="small" fullWidth>
              <FormLabel component="legend">{field.label}</FormLabel>
              <RadioGroup
                name={field.name}
                value={data[field.name]}
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
        ))}
      </Grid>

      <Modal open={show}  backdrop="static"
        keyboard={false} style={{justifyContent: "end",alignItems: "end",display: "flex",}}>
        <div style={{ padding: "20px", background: "#fff", margin: "10px", maxWidth: "1000px", borderRadius: "8px",height:'98vh',}}>
          <h3>{modalContent}</h3>
          <p>This modal provides additional information related to the selected option.</p>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdditionalApp;
