import React, { useState } from "react";
import {
  Button,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { AccessoriesModal } from "../ModalPages/Accessorie/AccessoriesModal";
import { CoatingModal } from "../ModalPages/Coating/CoatingModal";
import { CartModal } from "../ModalPages/Accessorie/CartModal";
import FinanceModal from "../ModalPages/Finance/FinanceModal";
import AccessoriesModalView from "../ModalPages/Accessorie/AccessoriesModalView";
import FinanceModalView from "../ModalPages/Finance/FinanceModalView";
import CoatingModalView from "../ModalPages/Coating/CoatingModalView";

function AdditionalApp({ data = {}, updateData, personalInfo, carInfo }) {
  const [showAccessoriesModal, setShowAccessoriesModal] = useState(false);
  const [showCoatingModal, setShowCoatingModal] = useState(false);
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [usershowCartModal, setUserShowCartModal] = useState(false);
  const [usershowFinanceModal, setUserShowFinanceModal] = useState(false);
  const [usershowCoatingModal, setUserShowCoatingModal] = useState(false);

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

  const handleFinanceModalClose = () => {
    setShowFinanceModal(false); // Close the modal
  };

  return (
    <div
      style={{
        padding: "1rem",
        marginTop: "1rem",
        marginBottom: "1rem",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Grid container spacing={2} style={{ marginTop: "-1rem" }}>
        {services.map((service) => (
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            key={service.name}
            style={{ marginBottom: "1rem" }}
          >
            <FormControl fullWidth>
              <FormLabel component="legend">{service.label}</FormLabel>
              <RadioGroup
                value={data[service.name] || "No"}
                onChange={(event) =>
                  handleChange(service.name, event.target.value)
                }
                row
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel
                  value="No"
                  control={<Radio size="small" />}
                  label="No"
                />

                {service.name === "accessories" &&
                  data[service.name] === "Yes" && (
                    <Button
                      color="primary"
                      size="small"
                      onClick={() => setUserShowCartModal(true)}
                      style={{ marginLeft: "1rem" }}
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
                    style={{ marginLeft: "1rem" }}
                    onClick={() => setUserShowCoatingModal(true)}
                  >
                    View coating
                  </Button>
                )}
              </RadioGroup>
            </FormControl>
          </Grid>
        ))}
      </Grid>



      
    
      {/* This is the Exchange Modal */}
      {/* This is the RTO Modal */}
      {/* This is the insurance Modal */}
      {/* This is the FastTag Modal */}
      {/* This is the Extended Warranty Modal */}
      {/* This is the Auto Card Modal */}


      {/* This is the Coating Modal */}

      {showCoatingModal && (
        <CoatingModal
          open={showCoatingModal}
          onClose={() => setShowCoatingModal(false)}
          onShowCoating={() => setShowCoatingModal(true)}
          personalInfo={personalInfo}
          carInfo={carInfo}
        />
      )}

      {usershowCoatingModal && (
        <CoatingModalView
          open={usershowCoatingModal}
          onClose={() => setUserShowCoatingModal(false)}
          personalInfo={personalInfo}
          onShowCoating={() => setShowCoatingModal(true)}
          carInfo={carInfo}
        />
      )}

      {/* This is the Accessories Modal */}

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

      {usershowCartModal && (
        <AccessoriesModalView
          open={usershowCartModal}
          onClose={() => setUserShowCartModal(false)}
          onShowCart={() => setShowAccessoriesModal(true)}
          personalInfo={personalInfo}
          carInfo={carInfo}
        />
      )}

      {/* This is the Finance Modal */}

      {showFinanceModal && (
        <FinanceModal
          open={showFinanceModal}
          onClose={handleFinanceModalClose}
          onShowFinance={() => setShowFinanceModal(true)}
          personalInfo={personalInfo}
          carInfo={carInfo}
        />
      )}

      {usershowFinanceModal && (
        <FinanceModalView
          open={usershowFinanceModal}
          onClose={() => setUserShowFinanceModal(false)}
          onShowFinance={() => setShowFinanceModal(true)}
          personalInfo={personalInfo}
          carInfo={carInfo}
        />
      )}


    </div>
  );
}

export default AdditionalApp;
