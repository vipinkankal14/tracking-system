import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const location = useLocation();
  const { formData } = location.state || {};

  const navigate = useNavigate();

  return (
    <div className="success-page">
      <h1>Form Submission Successful!</h1>
      <h2>Submitted Information:</h2>
      <div>
        <h3>Personal Information</h3>
        <p>Customer ID: {formData.personalInfo.customerId}</p>
        <p>Name: {formData.personalInfo.firstName} {formData.personalInfo.lastName}</p>
        <p>Email: {formData.personalInfo.email}</p>
        <p>Mobile Number: {formData.personalInfo.mobileNumber1}</p>
      </div>

      <div>
        <h3>Car Information</h3>
        <p>Model: {formData.carInfo.model}</p>
        <p>Color: {formData.carInfo.color}</p>
      </div>

      <div>
        <h3>Order Information</h3>
        <p>Order Date: {formData.orderInfo.orderDate}</p>
        <p>Delivery Date: {formData.orderInfo.deliveryDate}</p>
      </div>

      <div>
        <h3>Additional Information</h3>
        <p>Exchange: {formData.additionalInfo.exchange}</p>
        <p>Accessories: {formData.additionalInfo.accessories}</p>
      </div>

      <button onClick={() => navigate("/home")}>Go Back to Home</button>
    </div>
  );
};

export default SuccessPage;
