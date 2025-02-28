import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Snackbar, Alert, useMediaQuery, useTheme } from '@mui/material';
import AccessoriesTable from './Store/AccessoriesTable';

const AccessorieView = () => {
  const [accessories, setAccessories] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen is mobile

  // Fetch accessories from the backend when the component mounts
  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/getAllAccessories');
        if (!response.ok) throw new Error('Failed to fetch accessories');

        let data = await response.json();

        // Ensure all accessories have required properties
        data = data.filter(item => item.name && item.category && item.price !== undefined && item.quantity !== undefined);

        setAccessories(data);
      } catch (error) {
        console.error('Error fetching accessories:', error);
        setSnackbarMessage('Error fetching accessories');
        setOpenSnackbar(true);
      }
    };

    fetchAccessories();
  }, []);

   

  // Handle closing the snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className="app">
    

      <Grid container spacing={4} >
      

        {/* Right Panel - Table */}
        <Grid item xs={12} md={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Accessories List
            </Typography>
            <AccessoriesTable accessories={accessories.filter(acc => acc?.name)} />
            </Paper>
        </Grid>
      </Grid>

      {/* Success/Error Notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarMessage.includes('success') ? 'success' : 'error'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AccessorieView;