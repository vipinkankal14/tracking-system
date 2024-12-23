import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
 
const OrderDetails = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    orderDate: '', // Order Date selection (Yes/No)
    tentative_date: '',
    preferred_date: '',
    request_date: '',
    prebooking: '', // Pre-booking Date selection (Yes/No)
    prebooking_date: '', // Pre-booking Date
    delivery_date: '', // Delivery Date
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData); // Replace with API call
    navigate('/additional-details');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <div className="row g-3">
        <h6>ORDER DETAILS</h6>

        <div className="col-md-6">
          <label htmlFor="orderDate"  style={{ whiteSpace: 'pre' }} >Order Date :  </label> 
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              name="orderDate"
              value="yes"
              checked={formData.orderDate === 'yes'}
              onChange={handleChange}
              id="orderDateYes"
            
            />
            <label className="form-check-label yes-label" htmlFor="orderDateYes">
              Yes
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              name="orderDate"
              value="no"
              checked={formData.orderDate === 'no'}
              onChange={handleChange}
              id="orderDateNo"
            />
            <label className="form-check-label no-label" htmlFor="orderDateNo">
              No
            </label>
          </div>
        </div>

        {/* Pre-booking Date Question */}
        <div className="col-md-6">
          <label htmlFor="prebooking" style={{ whiteSpace: 'pre' }}>Pre-booking Date :  </label>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              name="prebooking"
              value="yes"
              checked={formData.prebooking === 'yes'}
              onChange={handleChange}
              id="prebookingYes"
            />
            <label className="form-check-label yes-label" htmlFor="prebookingYes">
              Yes
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              name="prebooking"
              value="no"
              checked={formData.prebooking === 'no'}
              onChange={handleChange}
              id="prebookingNo"
            />
            <label className="form-check-label no-label" htmlFor="prebookingNo">
              No
            </label>
          </div>
        </div>

        <hr />





        {/* Conditional Fields (Show if ORDER Date is Yes) */}
        {formData.orderDate === 'yes' && (
          <>
            {/* Tentative Date */}
            <div className="col-md-4">
              <label htmlFor="tentative_date">Tentative Date</label>
              <input
                type="date"
                className="form-control"
                name="tentative_date"
                onChange={handleChange}
                value={formData.tentative_date}
                required
                id="tentative_date"
              />
            </div>

            {/* Preferred Date */}
            <div className="col-md-4">
              <label htmlFor="preferred_date">Preferred Date</label>
              <input
                type="date"
                className="form-control"
                name="preferred_date"
                onChange={handleChange}
                value={formData.preferred_date}
                required
                id="preferred_date"
              />
            </div>

            {/* Request Date */}
            <div className="col-md-4">
              <label htmlFor="request_date">Request Date</label>
              <input
                type="date"
                className="form-control"
                name="request_date"
                onChange={handleChange}
                value={formData.request_date}
                required
                id="request_date"
              />
            </div>
            <hr />
          </>
        )}

       

        {/* Conditional Fields (Show if Pre-booking Date is Yes) */}
        {formData.prebooking === 'yes' && (
          <>
            {/* Pre-booking Date */}
            <div className="col-md-4">
              <label htmlFor="prebooking_date">Pre-booking Date</label>
              <input
                type="date"
                className="form-control"
                name="prebooking_date"
                onChange={handleChange}
                value={formData.prebooking_date}
                required
                id="prebooking_date"
              />
            </div>

            {/* Delivery Date */}
            <div className="col-md-4">
              <label htmlFor="delivery_date">Delivery Date</label>
              <input
                type="date"
                className="form-control"
                name="delivery_date"
                onChange={handleChange}
                value={formData.delivery_date}
                required
                id="delivery_date"
              />
            </div>
            <hr />
          </>
        )}
      </div>
    

      <div className="d-flex justify-content-between mt-4">
        {/* Back Button */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate('/car-details')}
        >
          Back
        </button>

        {/* Next Button */}
        <button type="submit" className="btn btn-primary">
          Next
        </button>
      </div>
    </form>
  );
};

export default OrderDetails;
