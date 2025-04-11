"use client";

import React from "react";
import { Button, Modal, Box, Typography, Container, Stepper, Step, StepButton, StepLabel, AppBar, Toolbar } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate, useLocation } from "react-router-dom";
import PersonalInfo from "../CustomerAdd/PersonalInfo";
import CarInfo from "../CustomerAdd/CarInfo";
import OrderInfo from "../CustomerAdd/OrderInfo";
import Confirmation from "../CustomerAdd/Confirmation";
import AdditionalInfo from "../CustomerAdd/AdditionalInfoApp/AdditionalInfo";
 
const steps = [
  { id: 1, name: "Personal Info" },
  { id: 2, name: "Car Info" },
 
  { id: 3, name: "Additional Info" },
  { id: 4, name: "Confirmation" },
];

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const carData = location.state?.carData || {};

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
      password:"",
      status: "confirmed",
    },
    carInfo: {
      carType: carData.carType || "",
      model: carData.model || "",
      version: carData.version || "",
      color: carData.color || "",
      fuelType: carData.fuelType || "",
      teamLeader: "",
      
      teamMember: "",
      bookingType: "",
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

  const CustomStepIcon = ({ active, completed, icon }) => {
    return (
      <Box
        sx={{
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          border: '2px solid',
          borderColor: active ? 'primary.main' : completed ? 'primary.main' : 'divider',
          color: active ? 'primary.main' : completed ? 'common.white' : 'text.secondary',
          bgcolor: completed ? 'primary.main' : 'transparent',
        }}
      >
        {completed ? <CheckIcon size={16} /> : icon}
      </Box>
    );
  };

  const handleSubmit = async () => {
    try {
      // Add status: "confirmed" to personalInfo before submission
      const formDataWithStatus = {
        ...formData,
        personalInfo: {
          ...formData.personalInfo,
          status: "confirmed",
        },
      };

      const response = await fetch("http://localhost:5000/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithStatus), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Submission failed");
      }

      const result = await response.json();
      console.log("Form submission result:", result);

      // Update local formData state with the confirmed status
      setFormData(formDataWithStatus);
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
          <>
            <OrderInfo
              data={formData.orderInfo}
              updateData={(key, value) => updateSection("orderInfo", key, value)}
            />
            <CarInfo
              data={formData.carInfo}
              updateData={(key, value) => updateSection("carInfo", key, value)}
              personalInfo={formData.personalInfo}
            />
           
          </>
        );
  
      case 3:
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
      case 4:
        return <Confirmation data={formData} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
          marginTop:'10px'
        }}
      >
        <Toolbar sx={{ px: 0 }}>
          <Stepper 
            alternativeLabel 
            nonLinear 
            activeStep={currentStep - 1}
            sx={{ 
              width: '100%',
              '& .MuiStepLabel-label': {
                fontSize: '0.875rem',
                fontWeight: 500,
              },
              '& .MuiStepLabel-active': {
                fontWeight: 600,
              }
            }}
          >
            {steps.map((step) => (
              <Step key={step.id}>
                <StepButton 
                   sx={{
                    '& .MuiStepLabel-iconContainer': {
                      position: 'relative',
                    },
                    '& .MuiStepLabel-labelContainer': {
                      display: 'flex',
                      alignItems: 'center',
                    }
                  }}
                >
                  <StepLabel
                    StepIconComponent={(props) => <CustomStepIcon {...props} />}
                    optional={
                      currentStep === step.id && (
                        <ChevronRightIcon size={16} style={{ marginLeft: 8 }} />
                      )
                    }
                  >
                    {step.name}
                  </StepLabel>
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Typography  variant="h6" sx={{ mb: 3, fontWeight: 600,justifyContent:'center',display:'flex' }}>
            {steps.find((step) => step.id === currentStep)?.name}
          </Typography>
          
          {renderStep()}
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            gap: 2,
            pt: 2,
            mt: 3,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
            <Button
              onClick={prevStep}
              disabled={currentStep === 1}
              variant="contained"
              sx={{
                bgcolor: currentStep === 1 ? 'action.disabledBackground' : 'primary.main',
                color: currentStep === 1 ? 'text.disabled' : 'common.white',
                '&:hover': {
                  bgcolor: currentStep === 1 ? 'action.disabledBackground' : 'primary.dark'
                }
              }}
              size="small"
            >
              Previous
            </Button>
            
            {currentStep !== steps.length && (
              <Button
                onClick={nextStep}
                variant="contained"
                size="small"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'common.white',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Success Modal */}
      <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            ✅ Submission Successful!
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Your form has been submitted successfully.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setSuccessModalOpen(false);
              navigate("/success-page", {
                state: {
                  formData: {
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      status: "confirmed",
                    },
                  },
                },
              });
            }}
            sx={{ bgcolor: 'primary.main', color: 'common.white' }}
          >
            Continue
          </Button>
        </Box>
      </Modal>

      {/* Error Modal */}
      <Modal open={errorModalOpen} onClose={() => setErrorModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom color="error">
            ❌ Submission Failed
          </Typography>
          <Typography sx={{ mb: 3 }}>
            {errorMessage || "An error occurred while submitting the form."}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setErrorModalOpen(false)}
            sx={{ borderColor: 'primary.main', color: 'primary.main' }}
          >
            Try Again
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default Booking;

