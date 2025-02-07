import React, { useState } from "react";
import { Button, Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { AccessoriesModal } from "../../demo/AccessoriesModal";
import { CoatingModal } from "../../demo/CoatingModal";
import { CartModal } from "../../demo/CartModal";
import FinanceModal from "../../demo/FinanceModal";
import AccessoriesModalView from "../../demo/AccessoriesModalView";
import { Link } from "react-router-dom";
import FinanceModalView from "../../demo/FinanceModalView";

function AdditionalApp({ data = {}, updateData, personalInfo, carInfo }) {
  const [showAccessoriesModal, setShowAccessoriesModal] = useState(false);
  const [showCoatingModal, setShowCoatingModal] = useState(false);
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [usershowCartModal, setUserShowCartModal] = useState(false);
  const [usershowFinanceModal, setUserShowFinanceModal] = useState(false);

  const handleChange = (name, value) => {
    updateData(name, value);

    if (name === "accessories" && value === "Yes") {
      setShowAccessoriesModal(true);
    }

    if (name === "coating" && value === "Yes") {
      setShowCoatingModal(true);
    }

    if (name === "finance" && value === "Yes") {
      setShowFinanceModal(true);
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
    <div style={{ padding: "1rem", marginTop: "1rem", marginBottom: "1rem", border: "1px solid #ccc", borderRadius: "5px" , boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"}}>
      <Grid container spacing={2} style={{ marginTop: "-1rem" }}>
        {services.map((service) => (
          <Grid item xs={6} sm={6} md={4} key={service.name} style={{ marginBottom: "1rem" }}>
            <FormControl fullWidth>
              <FormLabel component="legend">
                {service.label}
                
              </FormLabel>
              <RadioGroup
                value={data[service.name] || "No"}
                onChange={(event) => handleChange(service.name, event.target.value)}
                row
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio size="small" />} label="No" />

                {service.name === "accessories" && data[service.name] === "Yes" && (
                  <Button
               
                    color="primary"
                    size="small"
                    onClick={() => setUserShowCartModal(true)}
                    style={{ marginLeft: "1rem"}}
                  >
                   View cart
                  </Button>
          
                )}

                
                {service.name === "finance" && data[service.name] === "Yes" && (
                  <Button
                    color="primary"
                    size="small"
                    style={{ marginLeft: "1rem" }}
                    onClick={() => setUserShowFinanceModal(true)}
                  >
                  finance Details
                  </Button>
                )}

                {service.name === "coating" && data[service.name] === "Yes" && (
                  <Button
                    color="primary"
                    size="small"
                    style={{ marginLeft: "1rem"}}
                  >
                   View coating
                  </Button>
          
                )}

              </RadioGroup>
            </FormControl>
          </Grid>
        ))}
      </Grid>


      {usershowCartModal && (
        <AccessoriesModalView
          open={usershowCartModal}
          onClose={() => setUserShowCartModal(false)}
          onShowCart={() => setShowAccessoriesModal(true)}
          personalInfo={personalInfo}
          carInfo={carInfo}
        />
      )}

      {usershowFinanceModal && (
        <FinanceModalView
          open={usershowFinanceModal}
          onClose={() => setUserShowFinanceModal(false)}
          personalInfo={personalInfo}
          carInfo={carInfo}
        />
      )}



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

      {showFinanceModal && (
        <FinanceModal
          open={showFinanceModal}
          onClose={() => setShowFinanceModal(false)}
          personalInfo={personalInfo}
          carInfo={carInfo}
        />
      )}
    </div>
  );
}

export default AdditionalApp;
