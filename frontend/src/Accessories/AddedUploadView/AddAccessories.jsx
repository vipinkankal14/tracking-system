import React, { useState } from 'react';
import { Grid, Paper, Typography, Snackbar, Alert } from '@mui/material';
import AddAccessoryForm from './Store/AddAccessoryForm';
import AccessoriesTable from './Store/AccessoriesTable';

const AddAccessories = () => {
  const [accessories, setAccessories] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleAddAccessory = (newAccessory) => {
    setAccessories([...accessories, newAccessory]);
    setOpenSnackbar(true); // Show success popup
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className="app">
      <Typography style={{marginTop:'-29px'}} gutterBottom variant="h6" align="start">
        Accessories Store
      </Typography>
 
      
      <Grid container spacing={4}>
        {/* Left Panel - Form */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Add New Accessory
            </Typography>
            <AddAccessoryForm onAdd={handleAddAccessory} />
          </Paper>
        </Grid>

        {/* Right Panel - Table */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Accessories List
            </Typography>
            <AccessoriesTable accessories={accessories} />
          </Paper>
        </Grid>
      </Grid>

      {/* Success Notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Accessory added successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddAccessories;