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
    grid-template-columns: repeat(3, 1fr);
    max-width: 1200px;
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
      id: 'CarAllotmentByCustomer',
      title: 'Car Allotment By Customer',
      count: 80,
      status: 'Status: Allocated / Not Allocated',
      icon: NoCrashRoundedIcon,
      iconType: 'danger',
      path: '/car-allotment-by-customer',
     
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




