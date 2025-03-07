
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Print, Email, Done } from '@mui/icons-material';
import './scss/SuccessPage.scss';

function SuccessPage() {
  const location = useLocation();
  const formData = location.state?.formData;
  
  const id = 'CUST123456'; 

  const handlePrint = () => {
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
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
              .section {
                page-break-inside: avoid;
              }
            }

            .two-column {
              display: flex;
              justify-content: space-between;
              gap: 20px;
            }

            .two-column .column {
              flex: 1;
              min-width: 0;
            }

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
          </style>
        </head>
        <body>
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
              <span class="receipt-label">Name: <span class="receipt-value">${formData.personalInfo.firstName} ${formData.personalInfo.middleName} ${formData.personalInfo.lastName}</span></span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Mobile: <span class="receipt-value">${formData.personalInfo.mobileNumber1}${formData.personalInfo.mobileNumber2 ? `, ${formData.personalInfo.mobileNumber2}` : ''}</span></span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Email: <span class="receipt-value">${formData.personalInfo.email}</span></span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Address: <span class="receipt-value">${formData.personalInfo.address}, ${formData.personalInfo.city}, ${formData.personalInfo.state}, ${formData.personalInfo.country}</span></span>
            </div>
          </div>

          <div class="section two-column">
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
              <div class="receipt-row">
                <span class="receipt-label">Coating:</span>
                <span class="receipt-value">${formData.AdditionalInfo.coating}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Auto Card:</span>
                <span class="receipt-value">${formData.AdditionalInfo.auto_card}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Extended Warranty:</span>
                <span class="receipt-value">${formData.AdditionalInfo.extended_warranty}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Rto tax:</span>
                <span class="receipt-value">${formData.AdditionalInfo.rto_tax}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Fast Tag:</span>
                <span class="receipt-value">${formData.AdditionalInfo.fast_tag}</span>
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
    };
  };

  const handleSendEmail = () => {
    alert(`An email has been sent to ${formData?.personalInfo?.email || 'the registered email address'}.`);
  };

  return (
    <div className="success-page">
      <h2>Success!</h2>
      <p>Car booked successfully, {formData.personalInfo.firstName || 'Guest'}!</p>
      <p>
        <strong>Customer ID:</strong> {id}
      </p>

      <div className="options">
        <button
          className="btn btn-primary m-2"
          onClick={handlePrint}
        >
          <Print className="icon" />
          Print
        </button>
        <button className="btn btn-info m-2" onClick={handleSendEmail}>
          <Email className="icon" /> Send via Email
        </button>
        <button className="btn btn-success m-2">
          <Done className="icon" /> Done
        </button>
      </div>
    </div>
  );
}

export default SuccessPage;