import React from "react";
import clsx from "clsx";
import PersonalInfo from "../CustomerAdd/PersonalInfo";
import CarInfo from "../CustomerAdd/CarInfo";
import OrderInfo from "../CustomerAdd/OrderInfo";
import Confirmation from "../CustomerAdd/Confirmation";
import { Button, Modal, Box, Typography } from "@mui/material"; // Added Modal, Box, Typography
import { Check, ChevronRight } from "lucide-react";
import "../CustomerAdd/scss/MultiStepForm.scss";
import { useNavigate } from "react-router-dom";
import AdditionalInfo from "../CustomerAdd/AdditionalInfoApp/AdditionalInfo";

const steps = [
  { id: 1, name: "Personal Info" },
  { id: 2, name: "Car Info" },
  { id: 3, name: "Order Info" },
  { id: 4, name: "Additional Info" },
  { id: 5, name: "Confirmation" },
];

export function Home() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [successModalOpen, setSuccessModalOpen] = React.useState(false);
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const [formData, setFormData] = React.useState({
    personalInfo: {
      customerId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      mobileNumber1: "",
      mobileNumber2: "",
      customerType: "",
      birthDate: "",
      email: "",
      aadhaarNumber: "",
      panNumber: "",
      city: "",
      state: "",
      country: "",
      address: "",
    },
    carInfo: {
      carType: "",
      model: "",
      version: "",
      color: "",
      teamLeader: "",
      teamMember: "",
    },
    orderInfo: {
      orderDate: "NO",
      tentativeDate: "",
      preferredDate: "",
      requestDate: "",
      prebooking: "NO",
      prebookingDate: "",
      deliveryDate: "",
    },
    additionalInfo: {
      exchange: "No",
      finance: "No",
      accessories: "No",
      coating: "No",
      fastTag: "No",
      rto: "No",
      insurance: "No",
      extendedWarranty: "No",
      autoCard: "No",
    },
  });

  const updateSection = React.useCallback((section, key, value) => {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      };

      // Generate customerId if firstName is updated
      if (section === "personalInfo" && key === "firstName") {
        const firstName = value;
        const randomDigits = Math.floor(100000 + Math.random() * 900000);
        updatedData.personalInfo.customerId = `${firstName
          .substring(0, 4)
          .toUpperCase()}${randomDigits}`;
      }

      return updatedData;
    });
  }, []);

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Submission failed");
      }

      const result = await response.json();
      console.log("Form submission result:", result);
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Form submission error:", error);
      setErrorMessage(error.message);
      setErrorModalOpen(true);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfo
            data={formData.personalInfo}
            updateData={(key, value) =>
              updateSection("personalInfo", key, value)
            }
          />
        );
      case 2:
        return (
          <CarInfo
            data={formData.carInfo}
            updateData={(key, value) => updateSection("carInfo", key, value)}
            personalInfo={formData.personalInfo}
          />
        );
      case 3:
        return (
          <OrderInfo
            data={formData.orderInfo}
            updateData={(key, value) => updateSection("orderInfo", key, value)}
          />
        );
      case 4:
        return (
          <AdditionalInfo
            data={{
              ...formData.additionalInfo,
              personalInfo: formData.personalInfo,
              carInfo: formData.carInfo,
              orderInfo: formData.orderInfo,
            }}
            updateData={(key, value) =>
              updateSection("additionalInfo", key, value)
            }
            personalInfo={formData.personalInfo}
            carInfo={formData.carInfo}
            orderInfo={formData.orderInfo}
          />
        );
      case 5:
        return <Confirmation data={formData} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-col items-center gap-2">
      {/* Progress Header */}
      <header className="p-2">
        <nav aria-label="Progress">
          <ol className="flex justify-between md:space-x-2">
            {steps.map((step) => (
              <li key={step.id} className="flex-1">
                <button
                  className={clsx(
                    "flex flex-col items-center gap-1",
                    currentStep === step.id && "text-primary"
                  )}
                  style={{
                    color: currentStep === step.id ? "#040278" : "inherit",
                  }}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div
                    className={clsx(
                      "h-6 w-6 flex items-center justify-center rounded-full border-2",
                      currentStep === step.id
                        ? "border-primary bg-#040278 text-white"
                        : currentStep > step.id
                        ? "border-primary bg-#040278 text-white"
                        : "border-gray-300 text-gray-500"
                    )}
                  >
                    {currentStep > step.id ? <Check /> : step.id}
                  </div>
                  <span className="step-name text-sm font-medium">
                    {step.name}
                  </span>
                  {currentStep === step.id && (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </header>
      {/* Step Title */}
      <h6
        style={{
          display: "flex",
          margin: "10px",
          marginTop: "10px",
          justifyContent: "center",
        }}
      >
        {steps.find((step) => step.id === currentStep)?.name}
      </h6>

      {/* Main Content // Main Content and Navigation Buttons */}

      <main style={{ height: "100%", overflowY: "auto" }}>
        <style>
          {`
      main::-webkit-scrollbar {
        display: none;
      }
    `}
        </style>
        <div>{renderStep()}</div>

        {/* Navigation Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            width: "100%",
            paddingTop: "0.5rem",
            marginTop: "10px",
          }}
        >
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="contained"
            color="primary"
            style={{
              backgroundColor: currentStep === 1 ? "#e0e0e0" : "#040278",
              color: currentStep === 1 ? "#9e9e9e" : "white",
            }}
            aria-disabled={currentStep === 1}
            size="small"
          >
            Previous
          </Button>
          {/* Only show Next button if not on the last step */}
          {currentStep !== steps.length && (
            <Button
              onClick={nextStep}
              variant="contained"
              color="primary"
              style={{
                backgroundColor: "#040278",
                color: "white",
              }}
              size="small"
            >
              Next
            </Button>
          )}
        </div>
      </main>
      {/* Success Modal */}
      <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            ✅ Submission Successful!
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Your form has been submitted successfully.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setSuccessModalOpen(false);
              navigate("/success-page", { state: { formData } });
            }}
            style={{ backgroundColor: "#040278", color: "white" }}
          >
            Continue
          </Button>
        </Box>
      </Modal>
      {/* Error Modal */}
      <Modal open={errorModalOpen} onClose={() => setErrorModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom color="error">
            ❌ Submission Failed
          </Typography>
          <Typography sx={{ mb: 2 }}>
            {errorMessage || "An error occurred while submitting the form."}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setErrorModalOpen(false)}
            style={{ borderColor: "#040278", color: "#040278" }}
          >
            Try Again
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
