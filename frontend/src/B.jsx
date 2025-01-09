import React, { useState } from 'react'
import { Print, Email } from '@mui/icons-material'
import './scss/SuccessPage.scss'

const SuccessPage = ({ customerName, id }) => {
  const [isPrinting, setIsPrinting] = useState(false)
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
    AdditionalInfo: {
      exchange: 'No',
      finance: 'No',
      accessories: 'No',
      coating: 'No',
      auto_card: 'No',
      extended_warranty: 'No',
      rto_tax: 'No',
      fast_tag: 'No',
      insurance: 'No'
    }
  })

  const handlePrint = () => {
    setIsPrinting(true);
    
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const printDocument = iframe.contentWindow.document;

    // Write the content to the iframe
    printDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <base href="${window.location.origin}" />
          <title>Car Booking Receipt</title>
          <style>
            body {
               padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .receipt-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .section {
              margin: 20px 0;
              border-bottom: 1px solid #eee;
              padding-bottom: 15px;
            }
            .section-title {
              font-size: 1.2em;
              font-weight: bold;
              margin-bottom: 15px;
              color: #333;
            }
           
           
            
            .receipt-footer {
              margin-top: 30px;
              text-align: center;
              border-top: 2px solid #333;
              padding-top: 20px;
            }
              .receipt-header {
  
  margin-bottom: 30px;
  border-bottom: 2px solid #333;
  padding-bottom: 20px;
}

.company-details {
  margin-top: 10px;
  font-size: 0.9em;
  color: #555;
  
}

.company-details p {
  margin: 4px 0;
}

.company-details strong {
  color: #333; /* Emphasize labels */
}

            @media print {
              body {
                padding: 0;
                margin: 0;
              }
              .section {
                page-break-inside: avoid;
              }
            }


            /* Flexbox container for two-column layout */
.two-column {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

/* Individual columns */
.two-column .column {
  flex: 1;
  min-width: 0; /* Prevent overflow */
}

/* Ensure labels and values align neatly */
.receipt-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}

.receipt-label {
  font-weight: bold;
  color: #555;
}

.receipt-value {
  text-align: right;
}

/* Adjustments for print */
@media print {
  .two-column {
    gap: 10px;
  }
}

          </style>
        </head>
        <body>
          <div class="receipt-header">
 <div class="receipt-header">
  
  <div class="company-details">
    <p><strong>Company Name:</strong> Your Company Name</p>
    <p><strong>Address:</strong> 123 Main Street, City, State, Country</p>
    <p><strong>Phone:</strong> +1 234 567 890</p>
    <p><strong>Email:</strong> support@company.com</p>
    <p><strong>Website:</strong> www.companywebsite.com</p>
  </div>
</div>


          <div class="section">
            <div class="section-title">Personal Information</div>
            <div class="receipt-row">
              <span class="receipt-label">Name:</span>
              <span class="receipt-value">${formData.personalInfo.firstName} ${formData.personalInfo.middleName} ${formData.personalInfo.lastName}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Mobile:</span>
              <span class="receipt-value">${formData.personalInfo.mobileNumber1}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Email:</span>
              <span class="receipt-value">${formData.personalInfo.email}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Address:</span>
              <span class="receipt-value">${formData.personalInfo.address}, ${formData.personalInfo.city}, ${formData.personalInfo.state}, ${formData.personalInfo.country}</span>
            </div>
          </div>
          
<div class="section two-column">
  <!-- Car Information -->
  <div class="column">
    <div class="section-title">Car Information</div>
    <div class="receipt-row">
      <span class="receipt-label">Model:</span>
      <span class="receipt-value">${formData.CarInfo.model}</span>
    </div>
    <div class="receipt-row">
      <span class="receipt-label">Version:</span>
      <span class="receipt-value">${formData.CarInfo.version}</span>
    </div>
    <div class="receipt-row">
      <span class="receipt-label">Color:</span>
      <span class="receipt-value">${formData.CarInfo.color}</span>
    </div>
    <div class="receipt-row">
      <span class="receipt-label">Ex-Showroom Price:</span>
      <span class="receipt-value">₹${formData.CarInfo.exShowroomPrice}</span>
    </div>
    <div class="receipt-row">
      <span class="receipt-label">Booking Amount:</span>
      <span class="receipt-value">₹${formData.CarInfo.bookingAmount}</span>
    </div>
  </div>
<hr />
  <!-- Additional Services -->
  <div class="column">
    <div class="section-title">Additional Services</div>
    <div class="receipt-row">
      <span class="receipt-label">Exchange:</span>
      <span class="receipt-value">${formData.AdditionalInfo.exchange}</span>
    </div>
    <div class="receipt-row">
      <span class="receipt-label">Finance:</span>
      <span class="receipt-value">${formData.AdditionalInfo.finance}</span>
    </div>
    <div class="receipt-row">
      <span class="receipt-label">Accessories:</span>
      <span class="receipt-value">${formData.AdditionalInfo.accessories}</span>
    </div>
    <div class="receipt-row">
      <span class="receipt-label">Insurance:</span>
      <span class="receipt-value">${formData.AdditionalInfo.insurance}</span>
    </div>
  </div>
</div>

          <div class="receipt-footer">
            <p>Thank you for your booking!</p>
            <p>This is an official receipt of your transaction.</p>
            <p>Customer ID: ${id}</p>
          </div>
        </body>
      </html>
    `);
    
    printDocument.close();

    // Trigger printing
    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    // Cleanup after printing
    iframe.contentWindow.onafterprint = () => {
      document.body.removeChild(iframe);
      setIsPrinting(false);
    };
};


  const handleSendEmail = () => {
    try {
      const emailBody = `
Car Booking Receipt

Personal Information:
Name: ${formData.personalInfo.firstName} ${formData.personalInfo.middleName} ${formData.personalInfo.lastName}
Mobile: ${formData.personalInfo.mobileNumber1}
Email: ${formData.personalInfo.email}
Address: ${formData.personalInfo.address}, ${formData.personalInfo.city}, ${formData.personalInfo.state}, ${formData.personalInfo.country}

Car Information:
Model: ${formData.CarInfo.model}
Version: ${formData.CarInfo.version}
Color: ${formData.CarInfo.color}
Ex-Showroom Price: ₹${formData.CarInfo.exShowroomPrice}
Booking Amount: ₹${formData.CarInfo.bookingAmount}

Order Information:
Order Date: ${formData.OrderInfo.orderDate}
Tentative Delivery Date: ${formData.OrderInfo.tentative_date}
Preferred Delivery Date: ${formData.OrderInfo.preferred_date}

Additional Services:
Exchange: ${formData.AdditionalInfo.exchange}
Finance: ${formData.AdditionalInfo.finance}
Accessories: ${formData.AdditionalInfo.accessories}
Insurance: ${formData.AdditionalInfo.insurance}

Customer ID: ${id}

Thank you for your booking!
This is an official receipt of your transaction.`

      const mailtoLink = `mailto:${formData.personalInfo.email}?subject=${encodeURIComponent('Car Booking Receipt')}&body=${encodeURIComponent(emailBody)}`
      window.location.href = mailtoLink
    } catch (error) {
      console.error('Email failed:', error)
      alert('Failed to open email client. Please try again.')
    }
  }

  return (
    <div className="success-page">
      <h2>Success!</h2>
      <p>Car booked successfully, Mr. {formData.personalInfo.firstName || 'Guest'}!</p>
      <p>
        <strong>Customer ID:</strong> {id}
      </p>

      <div className="options">
        <button 
          className="btn btn-primary m-2" 
          onClick={handlePrint}
          disabled={isPrinting}
        >
          <Print className="icon" /> 
          {isPrinting ? 'Printing...' : 'Print'}
        </button>
        <button className="btn btn-info m-2" onClick={handleSendEmail}>
          <Email className="icon" /> Send via Email
        </button>
      </div>
    </div>
  )
}

export default SuccessPage
import React, { useState } from 'react'
import { Print, Email } from '@mui/icons-material'
import './scss/SuccessPage.scss'

const SuccessPage = ({ customerName, id }) => {
  const [isPrinting, setIsPrinting] = useState(false)
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
    AdditionalInfo: {
      exchange: 'No',
      finance: 'No',
      accessories: 'No',
      coating: 'No',
      auto_card: 'No',
      extended_warranty: 'No',
      rto_tax: 'No',
      fast_tag: 'No',
      insurance: 'No'
    }
  })

  const handlePrint = () => {
    setIsPrinting(true);
    
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const printDocument = iframe.contentWindow.document;

    // Write the content to the iframe
    printDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <base href="${window.location.origin}" />
          <title>Car Booking Receipt</title>
          <style>
            body {
               padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .receipt-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .section {
              margin: 20px 0;
              border-bottom: 1px solid #eee;
              padding-bottom: 15px;
            }
            .section-title {
              font-size: 1.2em;
              font-weight: bold;
              margin-bottom: 15px;
              color: #333;
            }
           
           
            
            .receipt-footer {
              margin-top: 30px;
              text-align: center;
              border-top: 2px solid #333;
              padding-top: 20px;
            }
              .receipt-header {
  
  margin-bottom: 30px;
  border-bottom: 2px solid #333;
  padding-bottom: 20px;
}

.company-details {
  margin-top: 10px;
  font-size: 0.9em;
  color: #555;
  
}

.company-details p {
  margin: 4px 0;
}

.company-details strong {
  color: #333; /* Emphasize labels */
}

            @media print {
              body {
                padding: 0;
                margin: 0;
              }
              .section {
                page-break-inside: avoid;
              }
            }


            /* Flexbox container for two-column layout */
.two-column {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

/* Individual columns */
.two-column .column {
  flex: 1;
  min-width: 0; /* Prevent overflow */
}

/* Ensure labels and values align neatly */
.receipt-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}

.receipt-label {
  font-weight: bold;
  color: #555;
}

.receipt-value {
  text-align: right;
}

/* Adjustments for print */
@media print {
  .two-column {
    gap: 10px;
  }
}

          </style>
        </head>
        <body>
          <div class="receipt-header">
 <div class="receipt-header">
  
  <div class="company-details">
    <p><strong>Company Name:</strong> Your Company Name</p>
    <p><strong>Address:</strong> 123 Main Street, City, State, Country</p>
    <p><strong>Phone:</strong> +1 234 567 890</p>
    <p><strong>Email:</strong> support@company.com</p>
    <p><strong>Website:</strong> www.companywebsite.com</p>
  </div>
</div>


          <div class="section">
            <div class="section-title">Personal Information</div>
            <div class="receipt-row">
              <span class="receipt-label">Name:</span>
              <span class="receipt-value">${formData.personalInfo.firstName} ${formData.personalInfo.middleName} ${formData.personalInfo.lastName}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Mobile:</span>
              <span class="receipt-value">${formData.personalInfo.mobileNumber1}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Email:</span>
              <span class="receipt-value">${formData.personalInfo.email}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Address:</span>
              <span class="receipt-value">${formData.personalInfo.address}, ${formData.personalInfo.city}, ${formData.personalInfo.state}, ${formData.personalInfo.country}</span>
            </div>
          </div>
          
<div class="section two-column">
  <!-- Car Information -->
  <div class="column">
    <div class="section-title">Car Information</div>
    <div class="receipt-row">
      <span class="receipt-label">Model:</span>
      <span class="receipt-value">${formData.CarInfo.model}</span>
    </div>
    <div class="receipt-row">
      <span class="receipt-label">Version:</span>
      <span class="receipt-value">${formData.CarInfo.version}</span>
    </div>
    <div class="receipt-row">
      <span class="receipt-label">Color:</span>
      <span class="receipt-value">${formData.CarInfo.color}</span>
    </div>
    <div class="receipt-row">
      <span class="receipt-label">Ex-Showroom Price:</span>
      <span class="receipt-value">₹${formData.CarInfo.exShowroomPrice}</span>
    </div>
    <div class="receipt-row">
      <span class="receipt-label">Booking Amount:</span>
      <span class="receipt-value">₹${formData.CarInfo.bookingAmount}</span>
    </div>
  </div>
<hr />
  <!-- Additional Services -->
  <div class="column">
    <div class="section-title">Additional Services</div>
    <div class="receipt-row">
      <span class="receipt-label">Exchange:</span>
      <span class="receipt-value">${formData.AdditionalInfo.exchange}</span>
    </div>
    <div class="receipt-row">
      <span class="receipt-label">Finance:</span>
      <span class="receipt-value">${formData.AdditionalInfo.finance}</span>
    </div>
    <div class="receipt-row">
      <span class="receipt-label">Accessories:</span>
      <span class="receipt-value">${formData.AdditionalInfo.accessories}</span>
    </div>
    <div class="receipt-row">
      <span class="receipt-label">Insurance:</span>
      <span class="receipt-value">${formData.AdditionalInfo.insurance}</span>
    </div>
  </div>
</div>

          <div class="receipt-footer">
            <p>Thank you for your booking!</p>
            <p>This is an official receipt of your transaction.</p>
            <p>Customer ID: ${id}</p>
          </div>
        </body>
      </html>
    `);
    
    printDocument.close();

    // Trigger printing
    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    // Cleanup after printing
    iframe.contentWindow.onafterprint = () => {
      document.body.removeChild(iframe);
      setIsPrinting(false);
    };
};


  const handleSendEmail = () => {
    try {
      const emailBody = `
Car Booking Receipt

Personal Information:
Name: ${formData.personalInfo.firstName} ${formData.personalInfo.middleName} ${formData.personalInfo.lastName}
Mobile: ${formData.personalInfo.mobileNumber1}
Email: ${formData.personalInfo.email}
Address: ${formData.personalInfo.address}, ${formData.personalInfo.city}, ${formData.personalInfo.state}, ${formData.personalInfo.country}

Car Information:
Model: ${formData.CarInfo.model}
Version: ${formData.CarInfo.version}
Color: ${formData.CarInfo.color}
Ex-Showroom Price: ₹${formData.CarInfo.exShowroomPrice}
Booking Amount: ₹${formData.CarInfo.bookingAmount}

Order Information:
Order Date: ${formData.OrderInfo.orderDate}
Tentative Delivery Date: ${formData.OrderInfo.tentative_date}
Preferred Delivery Date: ${formData.OrderInfo.preferred_date}

Additional Services:
Exchange: ${formData.AdditionalInfo.exchange}
Finance: ${formData.AdditionalInfo.finance}
Accessories: ${formData.AdditionalInfo.accessories}
Insurance: ${formData.AdditionalInfo.insurance}

Customer ID: ${id}

Thank you for your booking!
This is an official receipt of your transaction.`

      const mailtoLink = `mailto:${formData.personalInfo.email}?subject=${encodeURIComponent('Car Booking Receipt')}&body=${encodeURIComponent(emailBody)}`
      window.location.href = mailtoLink
    } catch (error) {
      console.error('Email failed:', error)
      alert('Failed to open email client. Please try again.')
    }
  }

  return (
    <div className="success-page">
      <h2>Success!</h2>
      <p>Car booked successfully, Mr. {formData.personalInfo.firstName || 'Guest'}!</p>
      <p>
        <strong>Customer ID:</strong> {id}
      </p>

      <div className="options">
        <button 
          className="btn btn-primary m-2" 
          onClick={handlePrint}
          disabled={isPrinting}
        >
          <Print className="icon" /> 
          {isPrinting ? 'Printing...' : 'Print'}
        </button>
        <button className="btn btn-info m-2" onClick={handleSendEmail}>
          <Email className="icon" /> Send via Email
        </button>
      </div>
    </div>
  )
}

export default SuccessPage
