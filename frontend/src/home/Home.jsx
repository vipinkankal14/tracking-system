import React from "react";
import clsx from "clsx";
import PersonalInfo from "../CustomerAdd/PersonalInfo";
import CarInfo from "../CustomerAdd/CarInfo";
import OrderInfo from "../CustomerAdd/OrderInfo";
 import Confirmation from "../CustomerAdd/Confirmation";
import { Button } from "@mui/material"; // MUI components
import { Check, ChevronRight } from "lucide-react"; // Replace with MUI Icons if needed
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
    documentUpload: {
      document: null, // Stores the uploaded document file
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

      // If the section is personalInfo and the key is firstName, generate the customerId
      if (section === "personalInfo" && key === "firstName") {
        const firstName = value;
        const randomDigits = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit number
        updatedData.personalInfo.customerId = `${firstName.substring(0, 4).toUpperCase()}${randomDigits}`;
      }

      

      return updatedData;
    });
  }, []);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    try {
      // Check if the accessories field is updated to "yes"
      if (formData.additionalInfo.accessories === "Yes") {
        // If yes, navigate to the Accessories page
        navigate("/accessories");
        return; // Exit the function to avoid submitting the form
      }
  
      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach((section) => {
        Object.entries(formData[section]).forEach(([key, value]) => {
          formDataToSubmit.append(`${section}.${key}`, value);
        });
      });
  
      // Log the form data for debugging
      formDataToSubmit.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
  
      // Display success alert
      alert("Form submitted successfully!");
  
      // Pass formData to the SuccessPage
      navigate("/success-page", { state: { formData } });
    } catch (error) {
      console.error("Error handling form submission:", error);
      alert("An error occurred while handling the form submission.");
    }
  };
  

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfo
            data={formData.personalInfo}
            updateData={(key, value) => updateSection("personalInfo", key, value)}
          />
        );
      case 2:
        return (
          <CarInfo
            data={formData.carInfo}
            updateData={(key, value) => updateSection("carInfo", key, value)}
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
      data={{ ...formData.additionalInfo, personalInfo: formData.personalInfo, carInfo: formData.carInfo, orderInfo: formData.orderInfo }}
      updateData={(key, value) => updateSection("additionalInfo", key, value)}
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
              style={{ color: currentStep === step.id ? '#040278' : 'inherit' }}
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
              <span
                className={clsx(
                  "step-name text-sm font-medium",
                  // Always show step name
                )}
              >
                {step.name}
              </span>
              {currentStep === step.id && <ChevronRight className="ml-auto h-4 w-4" />}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  </header>
 

 
      <h6 style={{ display: 'flex', margin: '10px', marginTop: '10px', justifyContent: 'center' }}>
        {steps.find(step => step.id === currentStep)?.name}
      </h6>
 

      <main style={{ height: '100%', overflowY: 'auto' }}>
        <style>
          {`
            main::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        <div>{renderStep()}</div>


         <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '1rem',
        width: '100%',
        paddingTop: '0.5rem',
        marginTop: '10px',
      }}>
    <>
      <Button
        onClick={prevStep}
        disabled={currentStep === 1}
        variant="contained"
        color="primary"
        style={{
          backgroundColor: currentStep === 1 ? '#e0e0e0' : '#040278',
          color: currentStep === 1 ? '#9e9e9e' : 'white',
        }}
        aria-disabled={currentStep === 1}
        size="small"
      >
        Previous
      </Button>
      <Button
        onClick={currentStep === steps.length ? handleSubmit : nextStep}
        variant="contained"
        color="primary"
        style={{
          backgroundColor: '#040278',
          color: 'white',
        }}
        size="small"
      >
        {currentStep === steps.length ? "Submit" : "Next"}
      </Button>
          </>
          </div>
  
      </main>
 
    </div>
  );
}

 