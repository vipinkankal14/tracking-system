import { useNavigate } from 'react-router-dom';
 
export default function CustomerDetails() {
  const navigate = useNavigate();
  

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/car-details');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <div className="row g-3">
        <h6>CUSTOMER DETAILS</h6>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="First Name"
            name="firstName"
          
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Middle Name"
            name="middleName"
          
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Last Name"
            name="lastName"
            
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="col-md-4">
          <input
            type="tel"
            className="form-control"
            placeholder="Mobile Number 1"
            name="mobileNumber1"
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="tel"
            className="form-control"
            placeholder="Mobile Number 2"
            name="mobileNumber2"
             onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <input
            type="tel"
            className="form-control"
            placeholder="Customer Type"
            name="customer_type"
            onChange={handleChange}
          />
        </div>
        
        <div className="col-md-6">
          <input
            type="email"
            className="form-control"
            placeholder="Email ID"
            name="email"
             onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="date"
            className="form-control"
            name="birthDate"
            onChange={handleChange}
            required
          />
        </div>        
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Aadhaar Number"
            name="aadhaarNumber1"
             onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Confirm Aadhaar Number"
            name="aadhaarNumber2"
             onChange={handleChange}
            required
          />
        </div>
        
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Street"
            name="street"
             onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="City"
            name="city"
             onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="State"
            name="state"
             onChange={handleChange}
            required
          />
        </div>
        
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Country"
            name="country"
             onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Address/Apartment/Unit/Suite"
            name="address"
             onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="text-end mt-4">
        <button type="submit" className="btn btn-primary">
          Next
        </button>
      </div>
    </form>
  );
}

