import React, { useState } from "react";

export default function Confirmation({ data, onSubmit }) {
  const [formData, setFormData] = useState({
    payment: {
      type: ""
    }
  });

  const handleInputChange = (section, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      }
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="confirmation-container" style={{ padding: "2px" }}>
 
      <div className="step-content">
        {/* Summary Section */}
        <div className="summary">           

          {/* Buyer Details */}
          <h5 className="h5 mb-3">Buyer Details</h5>
          <div className="card bg-light mb-3">
            <div className="card-body">
              <p className="mb-1">
              <strong>Name:</strong> {data.personalInfo.firstName} {data.personalInfo.middleName} {data.personalInfo.lastName}
              </p>
              <p className="mb-1">
                <strong>Address:</strong> 123 Green Avenue, New Delhi
              </p>
              <p className="mb-1">
              <strong>Email:</strong> {data.personalInfo.email}
              </p>
              <p className="mb-1">
                <strong>PAN:</strong> AAOPS1234A
              </p>
            </div>
          </div>

          {/* Invoice Summary */}
          <h5 className="h5 mb-3">Invoice Summary</h5>
          <div className="card bg-light">
            <div className="card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Ex-showroom Price</td>
                    <td>{data.carInfo.exShowroomPrice}</td>
                  </tr>
                  <tr>
                    <td>Accessories</td>
                    <td>20,000.00</td>
                  </tr>
                  <tr>
                    <td>Discount</td>
                    <td>cardiscount {data.carInfo.cardiscount}</td>
                  </tr>
                  <tr>
                    <td>Subtotal</td>
                    <td>10,10,000.00</td>
                  </tr>
                  <tr>
                    <td>GST (28%)</td>
                    <td>2,82,800.00</td>
                  </tr>
                  <tr>
                    <td>Cess (20%)</td>
                    <td>2,02,000.00</td>
                  </tr>
                  <tr>
                    <td>Road Tax</td>
                    <td>1,20,000.00</td>
                  </tr>
                  <tr>
                    <td>Registration Charges</td>
                    <td>15,000.00</td>
                  </tr>
                  <tr>
                    <td>Insurance</td>
                    <td>40,000.00</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Total On-Road Price</strong>
                    </td>
                    <td>
                      <strong>16,69,800.00</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
              <h5 className="mt-4 mb-3">Payment Details</h5>

              <form onSubmit={handleFormSubmit}>
                <div>
                  <div className="col-md-3 mb-2">
                    <label htmlFor="paymentType" className="form-label">
                      Payment Type
                    </label>
                    <select
                      id="paymentType"
                      className="form-select"
                      value={formData.payment.type}
                      onChange={(e) =>
                        handleInputChange('payment', 'type', e.target.value)
                      }
                      required
                    >
                      <option value="">Select Payment Type</option>
                      <option value="cash">Cash</option>
                      <option value="creditCard">Credit Card</option>
                      <option value="debitCard">Debit Card</option>
                      <option value="bankTransfer">Bank Transfer</option>
                    </select>
                  </div>

                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="paymentAmount" className="form-label">
                      Booking Amount (₹)
                    </label>
                    <strong>{data.carInfo.bookingAmount}</strong> 

                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  Submit Payment
                </button>
              </form>
            </div>
          </div>

          {/* Payment Details */}
          <div className="card bg-light">
            <div className="card-body">
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
