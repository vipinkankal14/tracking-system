import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { DirectionsCar} from '@mui/icons-material';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
 import GradingRoundedIcon from '@mui/icons-material/GradingRounded';
import CarRentalIcon from '@mui/icons-material/CarRental';
import NoCrashRoundedIcon from '@mui/icons-material/NoCrashRounded';
import PercentIcon from '@mui/icons-material/Percent';


const Container = styled.div`
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  overflow: auto;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  text-align: center;
  color: #1f2937;
  font-size: 2rem;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;
const Subtitle = styled.h2`
  margin-bottom: 1rem;
  text-align: center;
  color: #4b5563;
  font-size: 1.5rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 2.2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    max-width: 1300px;
    margin: 0 auto;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: translateY(-4px);
  }
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
`;

const getIconStyles = (type) => {
  const styles = {
    primary: { background: '#e0f2fe', color: '#0284c7' },
    danger: { background: '#fee2e2', color: '#dc2626' },
    success: { background: '#dcfce7', color: '#16a34a' },
    warning: { background: '#fef3c7', color: '#d97706' }
  };
  return styles[type] || styles.primary;
};

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 12px;
  margin-right: 1.5rem;
  background: ${props => getIconStyles(props.iconType).background};
  color: ${props => getIconStyles(props.iconType).color};
`;

const CardInfo = styled.div`
  flex: 1;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const CardNumber = styled.div`
  font-size: 2.5rem;
  color: #111827;
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const CardStatus = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;


function StackedStatusPage() {
  const navigate = useNavigate();

  const [statusCards] = useState([
   
    
    {
      id: 'CarAllotment',
      title: 'Car Allotment',
      count: 80,
      status: 'Status: All Payments Clear',
      icon: CarRentalIcon,
      iconType: 'success',
      path: '/car-stock-show',
     
    },
    {
      id: 'CarAllotmentByCustomer',
      title: 'Car Allotment By Customer',
      count: 80,
      status: 'Status: Allocated / Not Allocated',
      icon: NoCrashRoundedIcon,
      iconType: 'danger',
      path: '/car-allotment-by-customer',
     
    },
    {
      id: 'car-booking',
      title: 'Add Car Stock',  
 
      icon: DirectionsCar,
      iconType: 'secondary',
      path: '/Add-Car-Stock'
    },
    {
      id: 'CarAllotment',
      title: 'UPDATE FOR BOOKING AMOUNT',
 
      icon: PercentIcon,
      iconType: 'danger',
      path: '/booking-amount',
     
    },
    {
      id: 'CarAllotment',
      title: 'DISCOUNT FOR CAR',
      icon: PercentIcon,
      iconType: 'danger',
      path: '/discount-main',
     
    },
    {
      id: 'booking-cancel',
      title: 'Uplosd Stock',
      status: 'Status: ',
      icon: CloudUploadRoundedIcon,
      iconType: 'primary',
      path: '/car-booking-cancel'
    },
  ]);

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Container>
      <Title>Status Overview</Title>
      <Grid>
        {statusCards.map((card) => (
          <Card 
            key={card.id}
            onClick={() => handleCardClick(card.path)}
          >
            <CardContent>
              <IconWrapper iconType={card.iconType}>
                <card.icon sx={{ fontSize: 32 }} />
              </IconWrapper>
              <CardInfo>
                <CardTitle>{card.title}</CardTitle>
                <CardNumber>{card.count}</CardNumber>
                <CardStatus>{card.status}</CardStatus>
              </CardInfo>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Container>
  );
}

export default StackedStatusPage;















import React from 'react';
import { useLocation } from 'react-router-dom';
import { Print, Email, Done } from '@mui/icons-material';
import './scss/SuccessPage.scss';

function SuccessPage() {
  

  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData || {};
  
  const { state } = useLocation();
  const { customerId } = state || {};
 

  const handlePrint = () => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    if (!formData) {
      alert('Form data is missing.');
      return;
    }

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
                <span class="receipt-value">${formData?.CarInfo?.model || ''}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Version:</span>
                <span class="receipt-value">${formData?.CarInfo?.version || ''}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Color:</span>
                <span class="receipt-value">${formData?.CarInfo?.color || ''}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Ex-Showroom Price:</span>
                <span class="receipt-value">₹${formData?.CarInfo?.exShowroomPrice || ''}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Booking Amount:</span>
                <span class="receipt-value">₹${formData?.CarInfo?.bookingAmount || ''}</span>
              </div>
            </div>
            <div class="column">
              <div class="section-title">Additional Services</div>
              <div class="receipt-row">
                <span class="receipt-label">Exchange:</span>
                <span class="receipt-value">${formData.additionalInfo.exchange}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Finance:</span>
                <span class="receipt-value">${formData.additionalInfo.finance}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Accessories:</span>
                <span class="receipt-value">${formData.additionalInfo.accessories}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Insurance:</span>
                <span class="receipt-value">${formData.additionalInfo.insurance}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Coating:</span>
                <span class="receipt-value">${formData.additionalInfo.coating}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Auto Card:</span>
                <span class="receipt-value">${formData.additionalInfo.autoCard}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Extended Warranty:</span>
                <span class="receipt-value">${formData.additionalInfo.extendedWarranty}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Rto tax:</span>
                <span class="receipt-value">${formData.additionalInfo.rto}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Fast Tag:</span>
                <span class="receipt-value">${formData.additionalInfo.fastTag}</span>
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
      {customerId && (
        <p>Your customer ID is: <strong>{customerId}</strong></p>
      )}      </p>

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





