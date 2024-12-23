import { useNavigate } from 'react-router-dom';

export default function CustomerDetails() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/car-details');
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
        <h6>CUSTOMER DETAILS</h6>

        <div className="col-md-4">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            name="firstName"
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="middleName">Middle Name</label>
          <input
            type="text"
            className="form-control"
            id="middleName"
            name="middleName"
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            name="lastName"
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="mobileNumber1">Mobile Number 1</label>
          <input
            type="tel"
            className="form-control"
            id="mobileNumber1"
            name="mobileNumber1"
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="mobileNumber2">Mobile Number 2</label>
          <input
            type="tel"
            className="form-control"
            id="mobileNumber2"
            name="mobileNumber2"
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="customerType">Customer Type</label>
          <select
            className="form-control"
            id="customerType"
            name="customer_type"
            onChange={handleChange}
          >
            <option value="">Select Customer Type</option>
            <option value="individual">Individual</option>
            <option value="corporate">Corporate</option>
            <option value="government">Government</option>
            <option value="biasness">Biasness</option>
            <option value="non-profit">Non-Profit</option>
            <option value="farmer">Farmer</option>
          </select>
        </div>


        <div className="col-md-6">
          <label htmlFor="email">Email ID</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="birthDate">Birth Date</label>
          <input
            type="date"
            className="form-control"
            id="birthDate"
            name="birthDate"
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="aadhaarNumber1">Aadhaar Number</label>
          <input
            type="text"
            className="form-control"
            id="aadhaarNumber1"
            name="aadhaarNumber1"
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="aadhaarNumber2">Confirm Aadhaar Number</label>
          <input
            type="text"
            className="form-control"
            id="aadhaarNumber2"
            name="aadhaarNumber2"
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="street">Street</label>
          <input
            type="text"
            className="form-control"
            id="street"
            name="street"
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="city">City</label>
            
          <input
            type="text"
            className="form-control"
            id="city"
            name="city"
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="state">State</label>
          <input
            type="text"
            className="form-control"
            id="state"
            name="state"
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            className="form-control"
            id="country"
            name="country"
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-8">
          <label htmlFor="address">Address/Apartment/Unit/Suite</label>
          <input
            type="text"
            className="form-control"
            id="address"
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
