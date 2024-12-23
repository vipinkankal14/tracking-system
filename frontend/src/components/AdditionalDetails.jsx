import { useState } from 'react'
import { Check } from 'lucide-react'
import './MultiStepForm.scss'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function AdditionalDetails() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      middleName:'',
      lastName: '',
      mobileNumber1: '',
      mobileNumber2: '',
      customerType: '',
      birthDate: '',
      email: '',
      aadhaarNumber: '',
      panNumber: '',
      street: '',
      city: '',
      state: '',
      country: '',
      address: '',
      phone: ''
    },
    CarInfo: {
      model: '',
      variant: '',
      color: '',
      rmName: '',
      srmName: '',
      exShowroomPrice: '',
      bookingAmount: '',
    },
    OrderInfo: {
    orderDate: '', // Order Date selection (Yes/No)
    tentative_date: '',
    preferred_date: '',
    request_date: '',
    prebooking: '', // Pre-booking Date selection (Yes/No)
    prebooking_date: '', // Pre-booking Date
    delivery_date: '',
    },
    AdditionalInfo: {
      exchange: '',
      finance: '',
      accessories: '',
      coating: '',
      auto_card: '',
      extended_warranty: '',
      rto_tax: '',
      fast_tag: '',
      insurance: '',

    },
    confirmation: {
      terms: false
    }
  })

  const handleInputChange = (step, field, value) => {
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        [field]: value
      }
    }))
  }

  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, 5))
  }

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
  }

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
        {num === 2 && 'Car'}
        {num === 3 && 'Order'}
        {num === 4 && 'Additional'}
        {num === 5 && 'Confirm'}
      </div>
    </div>
  ))}
</div>

          <br />

          {/* Form Steps */}
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="step-content">
                <div className="row g-1">

                  <h6>CUSTOMER DETAILS</h6>
                  <hr />
                  <div className="col-md-4">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      value={formData.personalInfo.firstName}
                      onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="middleName">Middle Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="middleName"
                      onChange={(e) => handleInputChange('personalInfo', 'middleName', e.target.value)}
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      value={formData.personalInfo.lastName}
                      onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="mobileNumber1">Mobile Number 1</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="mobileNumber1"
                      onChange={(e) => handleInputChange('personalInfo', 'mobileNumber1', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="mobileNumber2">Mobile Number 2</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="mobileNumber2"
                      onChange={(e) => handleInputChange('personalInfo', 'mobileNumber2', e.target.value)}
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="customerType">Customer Type</label>
                    <select
                      className="form-control"
                      id="customerType"
                      onChange={(e) => handleInputChange('personalInfo', 'customerType', e.target.value)}
                    >
                      <option value="">Select Customer Type</option>
                      <option value="individual">Individual</option>
                      <option value="corporate">Corporate</option>
                      <option value="government">Government</option>
                      <option value="business">Business</option>
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
                      value={formData.personalInfo.email}
                      onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="birthDate">Birth Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="birthDate"
                      onChange={(e) => handleInputChange('personalInfo', 'birthDate', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="aadhaarNumber">Aadhaar Number</label>
                    <input
                      type="text"
                      className="form-control"
                      id="aadhaarNumber1"
                      onChange={(e) => handleInputChange('personalInfo', 'aadhaarNumber1', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="panNumber">Pan Card</label>
                    <input
                      type="text"
                      className="form-control"
                      id="panNumber"
                      onChange={(e) => handleInputChange('personalInfo', 'panNumber', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="street">Street</label>
                    <input
                      type="text"
                      className="form-control"
                      id="street"
                      onChange={(e) => handleInputChange('personalInfo', 'street', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      onChange={(e) => handleInputChange('personalInfo', 'state', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      id="country"
                      onChange={(e) => handleInputChange('personalInfo', 'country', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-8">
                    <label htmlFor="address">Address/Apartment/Unit/Suite</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}


            {step === 2 && (
              <div className="row g-3">
                <h6>CAR DETAILS</h6>

                {/* Model */}
                <div className="col-md-4">
                  <label htmlFor="model">Model</label>
                  <select
                    className="form-control"
                    name="model"
                    value={formData.CarInfo.model}
                    onChange={(e) => handleInputChange('CarInfo', 'model', e.target.value)}
                    required
                    id="model"
                  >
                    <option value="">Select Model</option>
                    <option value="Model A">Model A</option>
                    <option value="Model B">Model B</option>
                    <option value="Model C">Model C</option>
                  </select>
                </div>

                {/* Variant */}
                <div className="col-md-4">
                  <label htmlFor="variant">Variant</label>
                  <select
                    className="form-control"
                    name="variant"
                    value={formData.CarInfo.variant}
                    onChange={(e) => handleInputChange('CarInfo', 'variant', e.target.value)}
                    required
                    id="variant"
                  >
                    <option value="">Select Variant</option>
                    <option value="Variant 1">Variant 1</option>
                    <option value="Variant 2">Variant 2</option>
                  </select>
                </div>

                {/* Color */}
                <div className="col-md-4">
                  <label htmlFor="color">Color</label>
                  <select
                    className="form-control"
                    name="color"
                    value={formData.CarInfo.color}
                    onChange={(e) => handleInputChange('CarInfo', 'color', e.target.value)}
                    required
                    id="color"
                  >
                    <option value="">Select Color</option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Black">Black</option>
                  </select>
                </div>

                {/* RM Name */}
                <div className="col-md-6">
                  <label htmlFor="rmName">Relationship Manager Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="rmName"
                    value={formData.CarInfo.rmName}
                    onChange={(e) => handleInputChange('CarInfo', 'rmName', e.target.value)}
                    required
                    id="rmName"
                  />
                </div>

                {/* SRM Name */}
                <div className="col-md-6">
                  <label htmlFor="srmName">Senior Relationship Manager Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="srmName"
                    value={formData.CarInfo.srmName}
                    onChange={(e) => handleInputChange('CarInfo', 'srmName', e.target.value)}
                    required
                    id="srmName"
                  />
                </div>

                {/* Ex-Showroom Price */}
                <div className="col-md-6">
                  <label htmlFor="exShowroomPrice">Ex-Showroom Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="exShowroomPrice"
                    value={formData.CarInfo.exShowroomPrice}
                    onChange={(e) => handleInputChange('CarInfo', 'exShowroomPrice', e.target.value)}
                    required
                    id="exShowroomPrice"
                  />
                </div>

                {/* Booking Amount */}
                <div className="col-md-6">
                  <label htmlFor="bookingAmount">Booking Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    name="bookingAmount"
                    value={formData.CarInfo.bookingAmount}
                    onChange={(e) => handleInputChange('CarInfo', 'bookingAmount', e.target.value)}
                    required
                    id="bookingAmount"
                  />
                </div>
              </div>
            )}


            {step === 3 && (
              <div className="row g-3">
                <h6>ORDER DETAILS</h6>

                <div className="col-md-6">
                  <label htmlFor="orderDate" style={{ whiteSpace: 'pre' }}>Order Date : </label>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="orderDate"
                      value="yes"
                      checked={formData.OrderInfo.orderDate === 'yes'} // Correctly compare state for orderDate
                      onChange={(e) => handleInputChange('OrderInfo', 'orderDate', e.target.value)} // Update state
                      required
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
                      checked={formData.OrderInfo.orderDate === 'no'} // Correctly compare state for orderDate
                      onChange={(e) => handleInputChange('OrderInfo', 'orderDate', e.target.value)} // Update state
                      id="orderDateNo"
                    />
                    <label className="form-check-label no-label" htmlFor="orderDateNo">
                      No
                    </label>
                  </div>
                </div>

                {/* Pre-booking Date Question */}
                <div className="col-md-6">
                  <label htmlFor="prebooking" style={{ whiteSpace: 'pre' }}>Pre-booking Date : </label>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="prebooking"
                      value="yes"
                      checked={formData.OrderInfo.prebooking === 'yes'} // Correct comparison for prebooking
                      onChange={(e) => handleInputChange('OrderInfo', 'prebooking', e.target.value)} // Update state
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
                      checked={formData.OrderInfo.prebooking === 'no'} // Correct comparison for prebooking
                      onChange={(e) => handleInputChange('OrderInfo', 'prebooking', e.target.value)} // Update state
                      id="prebookingNo"
                    />
                    <label className="form-check-label no-label" htmlFor="prebookingNo">
                      No
                    </label>
                  </div>
                </div>

                <hr />

                {/* Conditional Fields (Show if ORDER Date is Yes) */}
                {formData.OrderInfo.orderDate === 'yes' && (
                  <>
                    {/* Tentative Date */}
                    <div className="col-md-4">
                      <label htmlFor="tentative_date">Tentative Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="tentative_date"
                        onChange={handleInputChange}
                        value={formData.OrderInfo.tentative_date} // Access the correct state
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
                        onChange={handleInputChange}
                        value={formData.OrderInfo.preferred_date} // Access the correct state
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
                        onChange={handleInputChange}
                        value={formData.OrderInfo.request_date} // Access the correct state
                        required
                        id="request_date"
                      />
                    </div>
                    <hr />
                  </>
                )}

                {/* Conditional Fields (Show if Pre-booking Date is Yes) */}
                {formData.OrderInfo.prebooking === 'yes' && (
                  <>
                    {/* Pre-booking Date */}
                    <div className="col-md-4">
                      <label htmlFor="prebooking_date">Pre-booking Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="prebooking_date"
                        onChange={handleInputChange}
                        value={formData.OrderInfo.prebooking_date} // Access the correct state
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
                        onChange={handleInputChange}
                        value={formData.OrderInfo.delivery_date} // Access the correct state
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

    {/* Fled Exchange */}
    <div className="col-md-4">
      <label htmlFor="fled_exchange" style={{ whiteSpace: 'pre' }}>Exchange: </label>
      <div className="form-check form-check-inline">
        <input
          type="radio"
          className="form-check-input"
          name="exchange"
          value="yes"
          checked={formData.AdditionalInfo.exchange === 'yes'}
          onChange={(e) => handleInputChange('AdditionalInfo', 'exchange', e.target.value)} // Update state
          id="fled_exchange_yes"
        />
        <label className="form-check-label yes-label" htmlFor="fled_exchange_yes">Yes</label>
      </div>
      <div className="form-check form-check-inline">
        <input
          type="radio"
          className="form-check-input"
          name="exchange"
          value="no"
          checked={formData.AdditionalInfo.exchange === 'no'}
          onChange={(e) => handleInputChange('AdditionalInfo', 'exchange', e.target.value)} // Update state
          id="fled_exchange_no"
        />
        <label className="form-check-label no-label" htmlFor="fled_exchange_no">No</label>
      </div>
    </div>

    {/* Finance */}
    <div className="col-md-4">
      <label htmlFor="finance" style={{ whiteSpace: 'pre' }}>Finance: </label>
      <div className="form-check form-check-inline">
        <input
          type="radio"
          className="form-check-input"
          name="finance"
          value="yes"
          checked={formData.AdditionalInfo.finance === 'yes'}
          onChange={(e) => handleInputChange('AdditionalInfo', 'finance', e.target.value)} // Update state
          id="finance_yes"
        />
        <label className="form-check-label yes-label" htmlFor="finance_yes">Yes</label>
      </div>
      <div className="form-check form-check-inline">
        <input
          type="radio"
          className="form-check-input"
          name="finance"
          value="no"
          checked={formData.AdditionalInfo.finance === 'no'}
          onChange={(e) => handleInputChange('AdditionalInfo', 'finance', e.target.value)} // Update state
          id="finance_no"
        />
        <label className="form-check-label no-label" htmlFor="finance_no">No</label>
      </div>
    </div>

    {/* Accessories */}
    <div className="col-md-4">
      <label htmlFor="accessories" style={{ whiteSpace: 'pre' }}>Accessories: </label>
      <div className="form-check form-check-inline">
        <input
          type="radio"
          className="form-check-input"
          name="accessories"
          value="yes"
          checked={formData.AdditionalInfo.accessories === 'yes'}
          onChange={(e) => handleInputChange('AdditionalInfo', 'accessories', e.target.value)} // Update state
          id="accessories_yes"
        />
        <label className="form-check-label yes-label" htmlFor="accessories_yes">Yes</label>
      </div>
      <div className="form-check form-check-inline">
        <input
          type="radio"
          className="form-check-input"
          name="accessories"
          value="no"
          checked={formData.AdditionalInfo.accessories === 'no'}
          onChange={(e) => handleInputChange('AdditionalInfo', 'accessories', e.target.value)} // Update state
          id="accessories_no"
        />
        <label className="form-check-label no-label" htmlFor="accessories_no">No</label>
      </div>
    </div>

    {/* Coating */}
    <div className="col-md-4">
      <label htmlFor="coating" style={{ whiteSpace: 'pre' }}>Coating: </label>
      <div className="form-check form-check-inline">
        <input
          type="radio"
          className="form-check-input"
          name="coating"
          value="yes"
          checked={formData.AdditionalInfo.coating === 'yes'}
          onChange={(e) => handleInputChange('AdditionalInfo', 'coating', e.target.value)} // Update state
          id="coating_yes"
        />
        <label className="form-check-label yes-label" htmlFor="coating_yes">Yes</label>
      </div>
      <div className="form-check form-check-inline">
        <input
          type="radio"
          className="form-check-input"
          name="coating"
          value="no"
          checked={formData.AdditionalInfo.coating === 'no'}
          onChange={(e) => handleInputChange('AdditionalInfo', 'coating', e.target.value)} // Update state
          id="coating_no"
        />
        <label className="form-check-label no-label" htmlFor="coating_no">No</label>
      </div>
    </div>

    {/* Auto Card */}
    <div className="col-md-4">
      <label htmlFor="auto_card" style={{ whiteSpace: 'pre' }}>Auto Card: </label>
      <div className="form-check form-check-inline">
        <input
          type="radio"
          className="form-check-input"
          name="auto_card"
          value="yes"
          checked={formData.AdditionalInfo.auto_card === 'yes'}
          onChange={(e) => handleInputChange('AdditionalInfo', 'auto_card', e.target.value)} // Update state
          id="auto_card_yes"
        />
        <label className="form-check-label yes-label" htmlFor="auto_card_yes">Yes</label>
      </div>
      <div className="form-check form-check-inline">
        <input
          type="radio"
          className="form-check-input"
          name="auto_card"
          value="no"
          checked={formData.AdditionalInfo.auto_card === 'no'}
          onChange={(e) => handleInputChange('AdditionalInfo', 'auto_card', e.target.value)} // Update state
          id="auto_card_no"
        />
        <label className="form-check-label no-label" htmlFor="auto_card_no">No</label>
      </div>
    </div>

    {/* Extended Warranty */}
    <div className="col-md-4">
      <label htmlFor="extended_warranty" style={{ whiteSpace: 'pre' }}>Extended Warranty: </label>
      <div className="form-check form-check-inline">
        <input
          type="radio"
          className="form-check-input"
          name="extended_warranty"
          value="yes"
          checked={formData.AdditionalInfo.extended_warranty === 'yes'}
          onChange={(e) => handleInputChange('AdditionalInfo', 'extended_warranty', e.target.value)} // Update state
          id="extended_warranty_yes"
        />
        <label className="form-check-label yes-label" htmlFor="extended_warranty_yes">Yes</label>
      </div>
      <div className="form-check form-check-inline">
        <input
          type="radio"
          className="form-check-input"
          name="extended_warranty"
          value="no"
          checked={formData.AdditionalInfo.extended_warranty === 'no'}
          onChange={(e) => handleInputChange('AdditionalInfo', 'extended_warranty', e.target.value)} // Update state
          id="extended_warranty_no"
        />
        <label className="form-check-label no-label" htmlFor="extended_warranty_no">No</label>
      </div>
    </div>

    {/* RTO Tax */}
    <div className="col-md-4">
      <label htmlFor="rto_tax" style={{ whiteSpace: 'pre' }}>RTO Tax: </label>
      <div className="form-check form-check-inline">
        <input
          type="radio"
          className="form-check-input"
          name="rto_tax"
          value="yes"
          checked={formData.AdditionalInfo.rto_tax === 'yes'}
          onChange={(e) => handleInputChange('AdditionalInfo', 'rto_tax', e.target.value)} // Update state                         
          id="rto_tax_yes"
        />
        <label className="form-check-label yes-label" htmlFor="rto_tax_yes">Yes</label>
      </div>
      <div className="form-check form-check-inline">
        <input
          type="radio"
          className="form-check-input"
          name="rto_tax"
          value="no"
          checked={formData.AdditionalInfo.rto_tax === 'no'}
          onChange={(e) => handleInputChange('AdditionalInfo', 'rto_tax', e.target.value)} // Update state
          id="rto_tax_no"
        />
        <label className="form-check-label no-label" htmlFor="rto_tax_no">No</label>
      </div>
    </div>

    {/* Fast Tag */}
    <div className="col-md-4">
      <label htmlFor="fast_tag" style={{ whiteSpace: 'pre' }}>Fast Tag: </label>
      <div className="form-check form-check-inline">
        <input
          type="radio"
          className="form-check-input"
          name="fast_tag"
          value="yes"
          checked={formData.AdditionalInfo.fast_tag === 'yes'}
          onChange={(e) => handleInputChange('AdditionalInfo', 'fast_tag', e.target.value)} // Update state
          id="fast_tag_yes"
        />
        <label className="form-check-label yes-label" htmlFor="fast_tag_yes">Yes</label>
      </div>
      <div className="form-check form-check-inline">
        <input
          type="radio"
          className="form-check-input"
          name="fast_tag"
          value="no"
          checked={formData.AdditionalInfo.fast_tag === 'no'}
          onChange={(e) => handleInputChange('AdditionalInfo', 'fast_tag', e.target.value)} // Update state
          id="fast_tag_no"
        />
        <label className="form-check-label no-label" htmlFor="fast_tag_no">No</label>
      </div>
    </div>

    {/* Insurance */}
    <div className="col-md-4">
      <label htmlFor="insurance" style={{ whiteSpace: 'pre' }}>Insurance: </label>
      <div className="form-check form-check-inline">
        <input
          type="radio"
          className="form-check-input"
          name="insurance"
          value="yes"
          checked={formData.AdditionalInfo.insurance === 'yes'}
          onChange={(e) => handleInputChange('AdditionalInfo', 'insurance', e.target.value)} // Update state
          id="insurance_yes"
        />
        <label className="form-check-label yes-label" htmlFor="insurance_yes">Yes</label>
      </div>
      <div className="form-check form-check-inline">
        <input
          type="radio"
          className="form-check-input"
          name="insurance"
          value="no"
          checked={formData.AdditionalInfo.insurance === 'no'}
          onChange={(e) => handleInputChange('AdditionalInfo', 'insurance', e.target.value)} // Update state
          id="insurance_no"
        />
        <label className="form-check-label no-label" htmlFor="insurance_no">No</label>
      </div>
    </div>
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
                      onChange={(e) => handleInputChange('confirmation', 'terms', e.target.checked)}
                      required
                    />
                    <label className="form-check-label" htmlFor="terms">
                      please confirm that all the details are correct
                    </label>
                  </div>
                </div>

                <div className="summary">
                  <h4 className="h5 mb-3">Summary</h4>
                  <div className="card bg-light">
                    <div className="card-body">
                      <p className="mb-1"><strong>Name:</strong> {formData.personalInfo.firstName} {formData.personalInfo.lastName}</p>
                      <p className="mb-1"><strong>Email:</strong> {formData.personalInfo.email}</p>
                      <p className="mb-1"><strong>Company:</strong> {formData.CarInfo.companyName}</p>
                      <p className="mb-1"><strong>Project Type:</strong> {formData.OrderInfo.projectType}</p>
                      <p className="mb-0"><strong>Budget Range:</strong> {formData.OrderInfo.budget}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handlePrev}
                disabled={step === 1}
              >
                Previous
              </button>

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
                >
                  Submit
                </button>
              )}
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

