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
import { RTOModal } from "../ModalPages/RTO/RTOModal";
import { InsuranceModal } from "../ModalPages/Insurance/InsuranceModal";
import { ExtendedWarrantyModal } from "../ModalPages/Extended Warranty/ExtendedWarrantyModal";
import { FastTagModal } from "../ModalPages/FastTag/FastTagModal";
import { AutoCardModal } from "../ModalPages/Auto Card/AutoCardModal";
import { ExchangeModal } from "../ModalPages/Exchange/ExchangeModal";

import FinanceModal from "../ModalPages/Finance/FinanceModal";
import AccessoriesModalView from "../ModalPages/Accessorie/AccessoriesModalView";
import FinanceModalView from "../ModalPages/Finance/FinanceModalView";
import CoatingModalView from "../ModalPages/Coating/CoatingModalView";
import RTOModalView from "../ModalPages/RTO/RTOModalView";
import InsuranceModalView from "../ModalPages/Insurance/InsuranceModalView";
import ExtendedWarrantyModalView from "../ModalPages/Extended Warranty/ExtendedWarrantyModalView";
import FastTagModalView from "../ModalPages/FastTag/FastTagModalView";
import AutoCardModalView from "../ModalPages/Auto Card/AutoCardModalView";
import ExchangeModalView from "../ModalPages/Exchange/ExchangeModalView";

function AdditionalApp({ data = {}, updateData, personalInfo, carInfo }) {
  {
    /* Admin Modal */
  }
  const [showAccessoriesModal, setShowAccessoriesModal] = useState(false);
  const [showCoatingModal, setShowCoatingModal] = useState(false);
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showRTOModal, setShowRTOModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showFastTagModal, setShowFastTagModal] = useState(false);
  const [showExtendedWarrantyModal, setShowExtendedWarrantyModal] =
    useState(false);
  const [showAutoCardModal, setShowAutoCardModal] = useState(false);
  const [showexhangeModal, setShowExchangeModal] = useState(false);

  {
    /* User Modal */
  }
  const [usershowCartModal, setUserShowCartModal] = useState(false);
  const [usershowFinanceModal, setUserShowFinanceModal] = useState(false);
  const [usershowCoatingModal, setUserShowCoatingModal] = useState(false);
  const [usershowRTOModal, setUserShowRTOModal] = useState(false);
  const [usershowInsuranceModal, setUserShowInsuranceModal] = useState(false);
  const [usershowFastTagModal, setUserShowFastTagModal] = useState(false);
  const [usershowExtendedWarrantyModal, setUserShowExtendedWarrantyModal] =
    useState(false);
  const [usershowAutoCardModal, setUserShowAutoCardModal] = useState(false);
  const [usershowexhangeModal, setUserShowExchangeModal] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [addedItems, setAddedItems] = useState([]);

  const handleChange = (name, value) => {
    updateData(name, value);

    if (name === "accessories" && value === "Yes") {
      setShowAccessoriesModal(true);
    } else if (name === "accessories" && value === "No") {
      if (
        window.confirm(
          "Are you sure you want to remove all the items from the cart?"
        )
      ) {
        setSelectedProducts([]);
        setAddedItems([]);
      }
    }

    if (name === "coating" && value === "Yes") {
      setShowCoatingModal(true);
    } else if (name === "coating" && value === "No") {
      if (window.confirm("Are you sure you don't want a coating service?")) {
        updateData(name, "No");
      } else {
        updateData(name, "Yes");
      }
    }

    if (name === "finance" && value === "Yes") {
      setShowFinanceModal(true);
    } else if (name === "finance" && value === "No") {
      if (window.confirm("Are you sure you don't want a finance service?")) {
        updateData(name, "No");
      } else {
        updateData(name, "Yes");
      }
    }

    if (name === "rto" && value === "Yes") {
      setShowRTOModal(true);
    } else if (name === "rto" && value === "no") {
      if (window.confirm("Are you sure you don't want a RTO service?")) {
        updateData(name, "No");
      } else {
        updateData(name, "Yes");
      }
    }

    if (name === "insurance" && value === "Yes") {
      setShowInsuranceModal(true);
    } else if (name === "insurance" && value === "No") {
      if (window.confirm("Are you sure you don't want a insurance service?")) {
        updateData(name, "No");
      } else {
        updateData(name, "Yes");
      }
    }

    if (name === "fastTag" && value === "Yes") {
      setShowFastTagModal(true);
    } else if (name === "fastTag" && value === "No") {
      if (window.confirm("Are you sure you don't want a FastTag service?")) {
        updateData(name, "No");
      } else {
        updateData(name, "Yes");
      }
    }

    if (name === "extendedWarranty" && value === "Yes") {
      setShowExtendedWarrantyModal(true);
    } else if (name === "extendedWarranty" && value === "No") {
      if (
        window.confirm(
          "Are you sure you don't want a Extended Warranty service?"
        )
      ) {
        updateData(name, "No");
      } else {
        updateData(name, "Yes");
      }
    }

    if (name === "autoCard" && value === "Yes") {
      setShowAutoCardModal(true);
    } else if (name === "autoCard" && value === "No") {
      if (window.confirm("Are you sure you don't want a Auto Card service?")) {
        updateData(name, "No");
      } else {
        updateData(name, "Yes");
      }
    }

    if (name === "exchange" && value === "Yes") {
      setShowExchangeModal(true);
    } else if (name === "exchange" && value === "No") {
      if (window.confirm("Are you sure you don't want a Exchange service?")) {
        updateData(name, "No");
      } else {
        updateData(name, "Yes");
      }
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
    setShowFinanceModal(false);
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

                {service.name === "rto" && data[service.name] === "Yes" && (
                  <Button
                    color="primary"
                    size="small"
                    style={{ marginLeft: "1rem" }}
                    onClick={() => setUserShowRTOModal(true)}
                  >
                    View RTO
                  </Button>
                )}

                {service.name === "insurance" &&
                  data[service.name] === "Yes" && (
                    <Button
                      color="primary"
                      size="small"
                      style={{ marginLeft: "1rem" }}
                      onClick={() => setUserShowInsuranceModal(true)}
                    >
                      View insurance
                    </Button>
                  )}

                {service.name === "fastTag" && data[service.name] === "Yes" && (
                  <Button
                    color="primary"
                    size="small"
                    style={{ marginLeft: "1rem" }}
                    onClick={() => setUserShowFastTagModal(true)}
                  >
                    View FastTag
                  </Button>
                )}

                {service.name === "extendedWarranty" &&
                  data[service.name] === "Yes" && (
                    <Button
                      color="primary"
                      size="small"
                      style={{ marginLeft: "1rem" }}
                      onClick={() => setUserShowExtendedWarrantyModal(true)}
                    >
                      View Extended Warranty
                    </Button>
                  )}

                {service.name === "autoCard" &&
                  data[service.name] === "Yes" && (
                    <Button
                      color="primary"
                      size="small"
                      style={{ marginLeft: "1rem" }}
                      onClick={() => setUserShowAutoCardModal(true)}
                    >
                      View Auto Card
                    </Button>
                  )}

                {service.name === "exchange" &&
                  data[service.name] === "Yes" && (
                    <Button
                      color="primary"
                      size="small"
                      style={{ marginLeft: "1rem" }}
                      onClick={() => setUserShowExchangeModal(true)}
                    >
                      View Exchange
                    </Button>
                  )}
              </RadioGroup>
            </FormControl>
          </Grid>
        ))}
      </Grid>

      {/* This is the RTO Modal */}

      {showRTOModal && (
        <RTOModal
          open={showRTOModal}
          onClose={() => setShowRTOModal(false)}
          onShowRTO={() => setShowRTOModal(true)}
          personalInfo={personalInfo}
          carInfo={carInfo}
        />
      )}

      {usershowRTOModal && (
        <RTOModalView
          open={usershowRTOModal}
          onClose={() => setUserShowRTOModal(false)}
          personalInfo={personalInfo}
          onShowRTO={() => setShowRTOModal(true)}
          carInfo={carInfo}
        />
      )}

      {/* This is the insurance Modal */}

      {showInsuranceModal && (
        <InsuranceModal
          open={showInsuranceModal}
          onClose={() => setShowInsuranceModal(false)}
          onShowInsurance={() => setShowInsuranceModal(true)}
          personalInfo={personalInfo}
          carInfo={carInfo}
        />
      )}

      {usershowInsuranceModal && (
        <InsuranceModalView
          open={usershowInsuranceModal}
          onClose={() => setUserShowInsuranceModal(false)}
          personalInfo={personalInfo}
          onShowInsurance={() => setShowInsuranceModal(true)}
          carInfo={carInfo}
        />
      )}

      {/* This is the FastTag Modal */}

      {showFastTagModal && (
        <FastTagModal
          open={showFastTagModal}
          onClose={() => setShowFastTagModal(false)}
          onShowFastTag={() => setShowFastTagModal(true)}
          personalInfo={personalInfo}
          carInfo={carInfo}
        />
      )}

      {usershowFastTagModal && (
        <FastTagModalView
          open={usershowFastTagModal}
          onClose={() => setUserShowFastTagModal(false)}
          personalInfo={personalInfo}
          onShowFastTag={() => setShowFastTagModal(true)}
          carInfo={carInfo}
        />
      )}

      {/* This is the Extended Warranty Modal */}

      {showExtendedWarrantyModal && (
        <ExtendedWarrantyModal
          open={showExtendedWarrantyModal}
          onClose={() => setShowExtendedWarrantyModal(false)}
          onShowExtendedWarranty={() => setShowExtendedWarrantyModal(true)}
          personalInfo={personalInfo}
          carInfo={carInfo}
        />
      )}

      {usershowExtendedWarrantyModal && (
        <ExtendedWarrantyModalView
          open={usershowExtendedWarrantyModal}
          onClose={() => setUserShowExtendedWarrantyModal(false)}
          personalInfo={personalInfo}
          onShowExtendedWarranty={() => setShowExtendedWarrantyModal(true)}
          carInfo={carInfo}
        />
      )}

      {/* This is the Auto Card Modal */}

      {showAutoCardModal && (
        <AutoCardModal
          open={showAutoCardModal}
          onClose={() => setShowAutoCardModal(false)}
          onShowAutoCard={() => setShowAutoCardModal(true)}
          personalInfo={personalInfo}
          carInfo={carInfo}
        />
      )}

      {usershowAutoCardModal && (
        <AutoCardModalView
          open={usershowAutoCardModal}
          onClose={() => setUserShowAutoCardModal(false)}
          personalInfo={personalInfo}
          onShowAutoCard={() => setShowAutoCardModal(true)}
          carInfo={carInfo}
        />
      )}

      {/* This is the Exchange Modal */}

      {showexhangeModal && (
        <ExchangeModal
          open={showexhangeModal}
          onClose={() => setShowExchangeModal(false)}
          onShowExchange={() => setShowExchangeModal(true)}
          personalInfo={personalInfo}
          carInfo={carInfo}
        />
      )}

      {usershowexhangeModal && (
        <ExchangeModalView
          open={usershowexhangeModal}
          onClose={() => setUserShowExchangeModal(false)}
          personalInfo={personalInfo}
          onShowExchange={() => setShowExchangeModal(true)}
          carInfo={carInfo}
        />
      )}

      {/* ------------------------------------------------------------------------------------------------------------------ */}

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
