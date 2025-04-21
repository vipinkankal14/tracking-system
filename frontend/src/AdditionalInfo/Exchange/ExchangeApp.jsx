import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import CarRentalIcon from '@mui/icons-material/CarRental';
import FlakyRoundedIcon from '@mui/icons-material/FlakyRounded';
import axios from 'axios';

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
    max-width: 900px;
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
    warning: { background: '#fef3c7', color: '#d97706' },
    Approved: { background: '#d4edda', color: '#155724' },
    Rejected: { background: '#f8d7da', color: '#721c24' },
    pending: { background: '#fff3cd', color: '#856404' },
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #4b5563;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #dc2626;
  padding: 1rem;
  text-align: center;
`;

function ExchangeApp() {
  const navigate = useNavigate();
  const [exchangeData, setExchangeData] = useState({ 
    approved: 0, 
    rejected: 0, 
    pending: 0,
    totalInterested: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExchangeData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/getCustomerDetailsWithStatuses');
        if (response.data.success) {
          setExchangeData({
            approved: response.data.data.counts.exchange?.Approval || 0,
            rejected: response.data.data.counts.exchange?.Rejected || 0,
            pending: response.data.data.counts.exchange?.Pending || 0,
            totalInterested: response.data.data.counts.exchange?.totalInterested || 0
          });
        } else {
          throw new Error(response.data.message || 'Failed to fetch exchange data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeData();
  }, []);

  const statusCards = [
    {
      id: 'Approved',
      title: 'Exchange Approved',
      count: exchangeData.approved,
      status: 'Approved',
      icon: FlakyRoundedIcon,
      iconType: 'Approved',
      path: '/Exchange-Management/exchange-approved',
    },
    {
      id: 'Rejected',
      title: 'Exchange Rejected',
      count: exchangeData.rejected,
      status: 'Rejected',
      icon: FlakyRoundedIcon,
      iconType: 'Rejected',
      path: '/Exchange-Management/exchange-rejected',
    },
    {
      id: 'pending',
      title: 'Pending Exchange',
      count: exchangeData.pending,
      status: 'Pending Approval',
      icon: CarRentalIcon,
      iconType: 'pending',
      path: '/Exchange-Management/exchange-pending',
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Loading exchange data...</LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          Error loading exchange data: {error}
          <br />
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Exchange Status Overview</Title>
       <Grid>
        {statusCards.map((card) => (
          <Card key={card.id} onClick={() => handleCardClick(card.path)}>
            <CardContent>
              <IconWrapper iconType={card.iconType}>
                <card.icon sx={{ fontSize: 32 }} />
              </IconWrapper>
              <CardInfo>
                <CardTitle>{card.title}</CardTitle>
                <CardNumber>{card.count}</CardNumber>
                <CardStatus>Status: {card.status}</CardStatus>
              </CardInfo>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Container>
  );
}

export default ExchangeApp;