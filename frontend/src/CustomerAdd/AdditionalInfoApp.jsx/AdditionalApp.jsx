import React from 'react';

const AdditionalApp = ({ data, updateData, personalInfo, carInfo, orderInfo }) => {
  return (
    <div>
      <h2>Additional App</h2>

      {/* Display personal information */}
      <div>
        <h3>Personal Info</h3>
        <p>Name: {`${personalInfo.firstName} ${personalInfo.middleName} ${personalInfo.lastName}`}</p>
        <p>Mobile 1: {personalInfo.mobileNumber1}</p>
        <p>Mobile 2: {personalInfo.mobileNumber2}</p>
        <p>Email: {personalInfo.email}</p>
      </div>

      {/* Display car information */}
      <div>
        <h3>Car Info</h3>
        <p>Car Type: {carInfo.carType}</p>
        <p>Model: {carInfo.model}</p>
        <p>Version: {carInfo.version}</p>
      </div>

      {/* Display order information */}
      <div>
        <h3>Order Info</h3>
        <p>Order Date: {orderInfo.orderDate}</p>
        <p>Delivery Date: {orderInfo.deliveryDate}</p>
      </div>

      {/* Display and update data */}
      <div>
        <h3>Additional Details</h3>
        <p>Exchange: {data.exchange}</p>
        <p>Finance: {data.finance}</p>
        <p>Accessories: {data.accessories}</p>
      </div>
    </div>
  );
};

export default AdditionalApp;
