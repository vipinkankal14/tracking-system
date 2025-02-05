import React, { useState } from "react";
import { Card, RadioGroup, FormControlLabel, Radio, FormLabel, Grid, FormControl } from "@mui/material";
import { AccessoriesModal } from "../../demo/AccessoriesModal";
import { CoatingModal } from "../../demo/CoatingModal";
import { CartModal } from "../../demo/CartModal";
import FinanceModal from "../../demo/FinanceModal";

function AdditionalApp({ data = {}, updateData, personalInfo, carInfo }) {
  const [showAccessoriesModal, setShowAccessoriesModal] = useState(false);
  const [showCoatingModal, setShowCoatingModal] = useState(false);
  const [showfinanceModal, setShowfinanceModal] = useState(false);

  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [addedItems, setAddedItems] = useState([]);

  const handleChange = (name, value) => {
    updateData(name, value);

    if (name === "accessories" && value === "Yes") {
      setShowAccessoriesModal(true);
    }

    if (name === "coating" && value === "Yes") {
      setShowCoatingModal(true);
    }

    if (name === "finance" && value === "Yes") {
      setShowfinanceModal(true);
    }
  };

  const services = [
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
    <div style={{ padding: "1rem" }}>
      <Grid container spacing={4} style={{ marginTop: "-1rem"}}>
        {services.map((service) => (
          <Grid item xs={6} sm={6} md={3} key={service.name} style={{ marginBottom: "1rem"}}>
            
              <FormControl fullWidth>
                <FormLabel component="legend">{service.label}</FormLabel>
                <RadioGroup
                  value={data[service.name] || "No"}
                  onChange={(event) => handleChange(service.name, event.target.value)}
                  row
                >
                  <FormControlLabel value="Yes" control={<Radio size="" />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </FormControl>
         
          </Grid>
        ))}
      </Grid>

      

      {showAccessoriesModal && (
        <AccessoriesModal
          open={showAccessoriesModal}
          onClose={() => setShowAccessoriesModal(false)}
          onShowCart={() => setShowCartModal(true)}
          addedItems={addedItems}
          setAddedItems={setAddedItems}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      )}

      {showCoatingModal && (
        <CoatingModal
          open={showCoatingModal}
          onClose={() => setShowCoatingModal(false)}
          personalInfo={personalInfo}
          carInfo={carInfo}
        />
      )}

      {showCartModal && (
        <CartModal
          open={showCartModal}
          onClose={() => setShowCartModal(false)}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          addedItems={addedItems}
          setAddedItems={setAddedItems}
          personalInfo={personalInfo}
          carInfo={carInfo}
        />
      )}

      {showfinanceModal && (
        <FinanceModal
          open={showfinanceModal}
          onClose={() => setShowfinanceModal(false)}
          personalInfo={personalInfo}
          carInfo={carInfo}
        />
      )}




    </div>
  );
}

export default AdditionalApp;
