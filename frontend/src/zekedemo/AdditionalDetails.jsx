import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import './scss/MultiStepForm.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom';
import './scss/Customercss.css';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';



function AdditionalDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      middleName: '',
      lastName: '',
      mobileNumber1: '',
      mobileNumber2: '',
      customerType: '',
      birthDate: '',
      email: '',
      aadhaarNumber: '',
      panNumber: '',
      city: '',
      state: '',
      country: '',
      address: ''
    },
    CarInfo: {
      model: '',
      version: '',
      color: '',
      teamLeader: '',
      teamMemder: '',
      exShowroomPrice: '',
      bookingAmount: ''
    },
    OrderInfo: {
      orderDate: '',
      tentative_date: '',
      preferred_date: '',
      request_date: '',
      prebooking: '',
      prebooking_date: '',
      delivery_date: ''
    },
    AdditionalInfo: {
      exchange: 'No',
      finance: 'No',
      accessories: 'No',
      coating: 'No',
      fast_tag: 'No'
    },
    PaymentDetails: {
      
    },
    InvoiceSummary: {

    },
    confirmation: {
      terms: false
    }
  });

  const [step, setStep] = useState(1);
  const [carStocks, setCarStocks] = useState([]);

  // Fetch car stocks data
  useEffect(() => {
    // Replace with your API call to fetch car stocks
    fetch('http://localhost:5000/api/showAllCarStocks') // Example API endpoint
      .then(response => response.json())
      .then(data => setCarStocks(data));
  }, []);

  const handleInputChange = (step, field, value) => {
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        [field]: value
      }
    }));
  };

  const handleCarDetailsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      CarInfo: {
        ...prev.CarInfo,
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, 5));
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
    navigate('/SuccessPage', { state: { formData } }); // Pass formData to SuccessPage
  };
  

  const additionalFields = [
    { name: 'exchange', label: 'Exchange' },
    { name: 'finance', label: 'Finance' },
    { name: 'accessories', label: 'Accessories' },
    { name: 'coating', label: 'Coating' },
    { name: 'fast_tag', label: 'Fast Tag' }
   ];

  const [dropdownState, setDropdownState] = useState({
    teamLeader: false,
    teamMember: false,
    model: false,
    version: false,
    color: false,
  });

  const toggleDropdown = (key) => {
    setDropdownState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-11">

          {/* Progress Steps */}
          <div className="d-flex justify-content-between align-items-center">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="text-center">
                <div
                  className={`step-circle d-flex align-items-center justify-content-center mb-2 mx-auto ${step >= num ? 'active' : ''} ${step === num ? 'current' : ''}`}  // Add 'current' class for current step
                  aria-label={`Step ${num}`}  // Add aria-label for better accessibility
                >
                  {step > num ? (
                    <Check size={20} />
                  ) : (
                    num
                  )}
                </div>
                <div className="step-label d-inline">
                  {num === 1 && 'Personal'}
                  {num === 2 && 'CarDetails '}
                  {num === 3 && 'Order'}
                  {num === 4 && 'Additional'}
                  {num === 5 && 'Confirm'}
                </div>
              </div>
            ))}
          </div>
          <h6 style={{ color: 'black' }}><hr /></h6>
           <form onSubmit={handleSubmit}>

            {step === 1 && (
              <div className="row g-4">
                <h6>CUSTOMER DETAILS</h6>

                <div className="col-md-3">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    className="form-control input-underline input-margin input-underline input-margin"
                    id="firstName"
                    value={formData.personalInfo.firstName}
                    onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label htmlFor="middleName">Middle Name</label>
                  <input
                    type="text"
                    className="form-control input-underline input-margin input-underline input-margin"
                    id="middleName"
                    value={formData.personalInfo.middleName}
                    onChange={(e) => handleInputChange('personalInfo', 'middleName', e.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    className="form-control input-underline input-margin input-underline input-margin"
                    id="lastName"
                    value={formData.personalInfo.lastName}
                    onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label htmlFor="customerType">Customer Type</label>
                  <select
                    className="form-control input-underline input-margin input-underline input-margin"
                    id="customerType"
                    value={formData.personalInfo.customerType}
                    onChange={(e) => handleInputChange('personalInfo', 'customerType', e.target.value)}
                  >
                    <option value="">Select Customer Type </option>
                    <option value="individual">Individual</option>
                    <option value="corporate">Corporate</option>
                    <option value="government">Government</option>
                    <option value="business">Business</option>
                    <option value="non-profit">Non-Profit</option>
                    <option value="farmer">Farmer</option>
                  </select>
                </div>

                <div className="col-md-2">
                  <label htmlFor="birthDate">Birth Date</label>
                  <input
                    type="date"
                    className="form-control input-underline input-margin"
                    id="birthDate"
                    value={formData.personalInfo.birthDate}
                    onChange={(e) => handleInputChange('personalInfo', 'birthDate', e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label htmlFor="mobileNumber1">Mobile Number</label>
                  <input
                    type="tel"
                    className="form-control input-underline input-margin"
                    id="mobileNumber1"
                    value={formData.personalInfo.mobileNumber1}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                      handleInputChange('personalInfo', 'mobileNumber1', numericValue);
                    }}
                    placeholder="Enter first  mobile number"
                  />
                </div>



                <div className="col-md-3">
                  <label htmlFor="mobileNumber2">Mobile Number</label>
                  <input
                    type="tel"
                    className="form-control input-underline input-margin"
                    id="mobileNumber2"
                    value={formData.personalInfo.mobileNumber2}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                      handleInputChange('personalInfo', 'mobileNumber2', numericValue);
                    }}
                    placeholder="Enter secondary mobile number"
                  />
                </div>




                <div className="col-md-4">
                  <label htmlFor="email">Email ID</label>
                  <input
                    type="email"
                    className="form-control input-underline input-margin"
                    id="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                    required
                  />
                </div>



                <div className="col-md-2">
                  <label htmlFor="aadhaarNumber">Aadhaar Number</label>
                  <input
                    type="text"
                    className="form-control input-underline input-margin"
                    id="aadhaarNumber"
                    value={formData.personalInfo.aadhaarNumber}
                    onChange={(e) => {
                      // Remove non-numeric characters
                      let input = e.target.value.replace(/\D/g, '');
                      // Format the input as ----/----/----/----
                      input = input
                        .match(/.{1,4}/g) // Break into groups of 4
                        ?.join('/') // Join with '/'
                        .slice(0, 14); // Limit to 19 characters (16 digits + 3 slashes)
                      handleInputChange('personalInfo', 'aadhaarNumber', input || '');
                    }}
                    placeholder="1234/5678/9123"
                    maxLength="14"
                    required
                  />
                </div>


                <div className="col-md-2">
                  <label htmlFor="panNumber">Pan Card</label>
                  <input
                    type="text"
                    className="form-control input-underline input-margin"
                    id="panNumber"
                    value={formData.personalInfo.panNumber}
                    onChange={(e) => handleInputChange('personalInfo', 'panNumber', e.target.value)}
                    required
                    maxLength="16"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>


               

                <div className="col-md-3">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    className="form-control input-underline input-margin"
                    id="city"
                    value={formData.personalInfo.city}
                    onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    className="form-control input-underline input-margin"
                    id="state"
                    value={formData.personalInfo.state}
                    onChange={(e) => handleInputChange('personalInfo', 'state', e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-2">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    className="form-control input-underline input-margin"
                    id="country"
                    value={formData.personalInfo.country}
                    onChange={(e) => handleInputChange('personalInfo', 'country', e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-12">
                  <label htmlFor="address">Address/Apartment/Unit/Suite</label>
                  <input
                    type="text"
                    className="form-control input-underline input-margin"
                    id="address"
                    value={formData.personalInfo.address}
                    onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                    required
                  />
                </div>

             
              </div>
            )}

            {step === 2 && (
              <div className="row g-2">
                {/* Dealership Advisor */}
                <div className="row g-3">
                  <h6>Dealership Advisor</h6>
                  {/* Team Leader */}
                  <div className="col-md-3">
                    <label htmlFor="teamLeader">Team Leader</label>
                    <div className="dropdown-wrapper">
                      <select
                        className="form-control input-underline input-margin"
                        id="teamLeader"
                        value={formData.CarInfo.teamLeader}
                        onChange={(e) => handleInputChange('CarInfo', 'teamLeader', e.target.value)}
                        onClick={() => toggleDropdown('teamLeader')}
                        required
                      >
                        <option value="">Select Team Leader</option>
                        <option value="leader1">Leader 1</option>
                        <option value="leader2">Leader 2</option>
                        <option value="leader3">Leader 3</option>
                      </select>
                      {dropdownState.teamLeader ? (
                        <KeyboardArrowUpOutlinedIcon />
                      ) : (
                        <KeyboardArrowDownOutlinedIcon />
                      )}
                    </div>
                  </div>

                  {/* Team Member */}
                  <div className="col-md-3">
                    <label htmlFor="teamMember">Team Member</label>
                    <div className="dropdown-wrapper">
                      <select
                        className="form-control input-underline input-margin"
                        id="teamMember"
                        value={formData.CarInfo.teamMember}
                        onChange={(e) => handleInputChange('CarInfo', 'teamMember', e.target.value)}
                        onClick={() => toggleDropdown('teamMember')}
                        required
                      >
                        <option value="">Select Team Member</option>
                        <option value="member1">Member 1</option>
                        <option value="member2">Member 2</option>
                        <option value="member3">Member 3</option>
                      </select>
                      {dropdownState.teamMember ? (
                        <KeyboardArrowUpOutlinedIcon />
                      ) : (
                        <KeyboardArrowDownOutlinedIcon />
                      )}
                    </div>
                  </div>
                </div>

                {/* Car Details */}
                <div className="row g-3">
                  <h6>Choose Your Car</h6>

                  {/* Model */}
                  <div className="col-md-3">
                    <label htmlFor="model">Model</label>
                    <div className="dropdown-wrapper">
                      <select
                        className="form-control input-underline input-margin"
                        id="model"
                        value={formData.CarInfo.model}
                        onChange={(e) => handleInputChange('CarInfo', 'model', e.target.value)}
                        onClick={() => toggleDropdown('model')}
                        required
                      >
                        <option value="">Select Model</option>
                        {[...new Set(carStocks.map((stock) => stock.model))].map((model, index) => (
                          <option key={index} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                      {dropdownState.model ? (
                        <KeyboardArrowUpOutlinedIcon />
                      ) : (
                        <KeyboardArrowDownOutlinedIcon />
                      )}
                    </div>
                  </div>

                  {/* Version */}
                  <div className="col-md-3">
                    <label htmlFor="version">Version</label>
                    <div className="dropdown-wrapper">
                      <select
                        className="form-control input-underline input-margin"
                        id="version"
                        value={formData.CarInfo.version}
                        onChange={(e) => handleInputChange('CarInfo', 'version', e.target.value)}
                        onClick={() => toggleDropdown('version')}
                        required
                        disabled={!formData.CarInfo.model}
                      >
                        <option value="">Select Version</option>
                        {carStocks
                          .filter((stock) => stock.model === formData.CarInfo.model)
                          .map((filteredStock, index) => (
                            <option key={index} value={filteredStock.version}>
                              {filteredStock.version}
                            </option>
                          ))}
                      </select>
                      {dropdownState.version ? (
                        <KeyboardArrowUpOutlinedIcon />
                      ) : (
                        <KeyboardArrowDownOutlinedIcon />
                      )}
                    </div>
                  </div>

                  {/* Color */}
                  <div className="col-md-3">
                    <label htmlFor="color">Color</label>
                    <div className="dropdown-wrapper">
                      <select
                        className="form-control input-underline input-margin"
                        id="color"
                        value={formData.CarInfo.color}
                        onChange={(e) => handleInputChange('CarInfo', 'color', e.target.value)}
                        onClick={() => toggleDropdown('color')}
                        required
                        disabled={!formData.CarInfo.version}
                      >
                        <option value="">Select Color</option>
                        {carStocks
                          .filter(
                            (stock) =>
                              stock.model === formData.CarInfo.model &&
                              stock.version === formData.CarInfo.version
                          )
                          .map((filteredStock, index) => (
                            <option key={index} value={filteredStock.color}>
                              {filteredStock.color}
                            </option>
                          ))}
                      </select>
                      {dropdownState.color ? (
                        <KeyboardArrowUpOutlinedIcon />
                      ) : (
                        <KeyboardArrowDownOutlinedIcon />
                      )}
                    </div>
                  </div>
                </div>

                <div className="row g-4">
                  {/* Ex-Showroom Price */}
                  <h6>Your Chosen Car Price</h6>

                  <div className="col-md-3">
                    <label htmlFor="exShowroomPrice">Ex-Showroom Price</label>
                    <input
                      type="number"
                      className="form-control input-underline input-margin"
                      id="exShowroomPrice"
                      placeholder="Ex-Showroom Price"
                      value={formData.CarInfo.exShowroomPrice}
                      onChange={(e) => handleInputChange('CarInfo', 'exShowroomPrice', e.target.value)}
                      required
                    />
                  </div>

                  {/* Booking Amount */}
                  <div className="col-md-3">
                    <label htmlFor="bookingAmount">Booking Amount</label>
                    <input
                      type="number"
                      className="form-control input-underline input-margin"
                      id="bookingAmount"
                      placeholder="Booking Amount"
                      value={formData.CarInfo.bookingAmount}
                      onChange={(e) => handleInputChange('CarInfo', 'bookingAmount', e.target.value)}
                      required
                    />
                  </div>
                </div>

              </div>
            )}

            {step === 3 && (
              <div className="row g-2">
                <h6>ORDER DETAILS</h6>

                <div className="row g-3">
                  {/* Order Date Question */}
                  <div className="col-md-6">
                  
                    <label htmlFor="orderDate" style={{ whiteSpace: 'pre' }}>Order Date: </label>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="orderDate"
                        value="yes"
                        checked={formData.OrderInfo.orderDate === 'yes'}
                        onChange={(e) => handleInputChange('OrderInfo', 'orderDate', e.target.value)}
                        required
                        id="orderDateYes"
                      />
                      <label className="form-check-label" htmlFor="orderDateYes">Yes</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="orderDate"
                        value="no"
                        checked={formData.OrderInfo.orderDate === 'no'}
                        onChange={(e) => handleInputChange('OrderInfo', 'orderDate', e.target.value)}
                        id="orderDateNo"
                      />
                      <label className="form-check-label" htmlFor="orderDateNo">No</label>
                    </div>
                  </div>

                  {/* Pre-booking Date Question */}
                  <div className="col-md-6">
                    <label htmlFor="prebooking" style={{ whiteSpace: 'pre' }}>Pre-booking Date: </label>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="prebooking"
                        value="yes"
                        checked={formData.OrderInfo.prebooking === 'yes'}
                        onChange={(e) => handleInputChange('OrderInfo', 'prebooking', e.target.value)}
                        id="prebookingYes"
                      />
                      <label className="form-check-label" htmlFor="prebookingYes">Yes</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="prebooking"
                        value="no"
                        checked={formData.OrderInfo.prebooking === 'no'}
                        onChange={(e) => handleInputChange('OrderInfo', 'prebooking', e.target.value)}
                        id="prebookingNo"
                      />
                      <label className="form-check-label" htmlFor="prebookingNo">No</label>
                    </div>
                  </div>
                    
                </div>

                <hr />

                {/* Conditional Fields for Order Date */}
                {formData.OrderInfo.orderDate === 'yes' && (
                  <>
                    <div className="col-md-4">
                      <label htmlFor="tentative_date">Tentative Date</label>
                      <input
                        type="date"
                        className="form-control input-underline input-margin"
                        name="tentative_date"
                        value={formData.OrderInfo.tentative_date}
                        onChange={(e) => handleInputChange('OrderInfo', 'tentative_date', e.target.value)}
                        required
                        id="tentative_date"
                      />
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="preferred_date">Preferred Date</label>
                      <input
                        type="date"
                        className="form-control input-underline input-margin"
                        name="preferred_date"
                        value={formData.OrderInfo.preferred_date}
                        onChange={(e) => handleInputChange('OrderInfo', 'preferred_date', e.target.value)}
                        required
                        id="preferred_date"
                      />
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="request_date">Request Date</label>
                      <input
                        type="date"
                        className="form-control input-underline input-margin"
                        name="request_date"
                        value={formData.OrderInfo.request_date}
                        onChange={(e) => handleInputChange('OrderInfo', 'request_date', e.target.value)}
                        required
                        id="request_date"
                      />
                    </div>
                    <hr />
                  </>
                )}

                {/* Conditional Fields for Pre-booking */}
                {formData.OrderInfo.prebooking === 'yes' && (
                  <>
                    <div className="col-md-4">
                      <label htmlFor="prebooking_date">Pre-booking Date</label>
                      <input
                        type="date"
                        className="form-control input-underline input-margin"
                        name="prebooking_date"
                        value={formData.OrderInfo.prebooking_date}
                        onChange={(e) => handleInputChange('OrderInfo', 'prebooking_date', e.target.value)}
                        required
                        id="prebooking_date"
                      />
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="delivery_date">Delivery Date</label>
                      <input
                        type="date"
                        className="form-control input-underline input-margin"
                        name="delivery_date"
                        value={formData.OrderInfo.delivery_date}
                        onChange={(e) => handleInputChange('OrderInfo', 'delivery_date', e.target.value)}
                        required
                        id="delivery_date"
                      />
                    </div>
                    <hr />
                  </>
                )}


              </div>
            )}

            {step === 4 && (
              <div className="row g-3">
                <h6>ADDITIONAL DETAILS</h6>

                {additionalFields.map((field) => (
                  <div className="col-md-4" key={field.name}>
                    <label htmlFor={field.name} style={{ whiteSpace: 'pre' }}>{field.label}: </label>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        className="form-check-input"
                        name={field.name}
                        value="yes"
                        checked={formData.AdditionalInfo[field.name] === 'yes'}
                        onChange={(e) =>
                          handleInputChange('AdditionalInfo', field.name, e.target.value)
                        }
                        id={`${field.name}_yes`}
                      />
                      <label className="form-check-label yes-label" htmlFor={`${field.name}_yes`}>Yes</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        className="form-check-input"
                        name={field.name}
                        value="no"
                        checked={formData.AdditionalInfo[field.name] === 'no'}
                        onChange={(e) =>
                          handleInputChange('AdditionalInfo', field.name, e.target.value)
                        }
                        id={`${field.name}_no`}
                      />
                      <label className="form-check-label no-label" htmlFor={`${field.name}_no`}>No</label>
                    </div>
                  </div>
                ))}
                <hr />
              </div>

            )}

            {step === 5 && (
              <div className="step-content">
                <h3 className="mb-4">Confirmation</h3>
                <div className="mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="terms"
                      checked={formData.confirmation.terms}
                      onChange={(e) =>
                        handleInputChange('confirmation', 'terms', e.target.checked)
                      }
                      required
                    />
                    <label className="form-check-label" htmlFor="terms">
                      Please confirm that all the details are correct.
                    </label>
                  </div>
                </div>

                <div className="summary">
                  <h4 className="h5 mb-3">Summary</h4>
                  <div className="card bg-light mb-3">
                    <div className="card-body">
                      <p className="mb-1">
                        <strong>Name:</strong> {formData.personalInfo.firstName}{" "}
                        {formData.personalInfo.lastName}
                      </p>
                      <p className="mb-1">
                        <strong>Email:</strong> {formData.personalInfo.email}
                      </p>
                    </div>
                  </div>

                  <h5 className="h5 mb-3">Buyer Details</h5>
                  <div className="card bg-light mb-3">
                    <div className="card-body">
                      <p className="mb-1">
                        <strong>Name:</strong> Mr. Raj Sharma
                      </p>
                      <p className="mb-1">
                        <strong>Address:</strong> 123 Green Avenue, New Delhi
                      </p>
                      <p className="mb-1">
                        <strong>Contact:</strong> +91-9876543210
                      </p>
                      <p className="mb-1">
                        <strong>PAN:</strong> AAOPS1234A
                      </p>
                    </div>
                  </div>

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
                          <td>10,00,000.00</td>
                        </tr>
                        <tr>
                          <td>Accessories</td>
                          <td>20,000.00</td>
                        </tr>
                        <tr>
                          <td>Discount</td>
                          <td>-10,000.00</td>
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
                          <td><strong>Total On-Road Price</strong></td>
                          <td><strong>16,69,800.00</strong></td>
                        </tr>
                      </tbody>
                    </table>
                    </div>
                  </div>
                    
                    

                  <h5 className="mt-4 mb-3">Payment Details</h5>    
                  <div className="card bg-light"> 
                    <div className="card-body">
                      <form>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="paymentType" className="form-label">Payment Type</label>
                            <select id="paymentType" className="form-select" required>
                              <option value="">Select Payment Type</option>
                              <option value="cash">Cash</option>
                              <option value="creditCard">Credit Card</option>
                              <option value="debitCard">Debit Card</option>
                              <option value="bankTransfer">Bank Transfer</option>
                            </select>
                          </div>

                          <div className="col-md-6 mb-3">
                            <label htmlFor="paymentAmount" className="form-label">Amount (₹)</label>
                            <input type="number" id="paymentAmount" className="form-control" required />
                          </div>
                        </div>

                        <button type="submit" className="btn btn-primary">Submit Payment</button>
                      </form>
                    </div>
                  </div>



                </div>
              </div>
            )}


            <div className="d-flex justify-content-between mt-4">
              {step > 1 && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handlePrev}
                  disabled={step === 1}
                >
                  Previous
                </button>
              )}

              {step < 5 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNext}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={!formData.confirmation.terms}  // Disable the Submit button if terms are not checked
                >
                  Submit
                </button>
              )}
            </div>

          </form>
          
        </div>
      </div>
    </div>
  );
}

export default AdditionalDetails