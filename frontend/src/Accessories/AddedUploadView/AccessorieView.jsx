import React, { useState } from 'react';
import { Grid, Paper, Typography} from '@mui/material';
 import AccessoriesTable from './Store/AccessoriesTable';

const AccessorieView = () => {
  const [accessories, setAccessories] = useState([]);
  return (
    <div className=" ">
      <Typography style={{marginTop:'-29px'}} gutterBottom variant="h6" align="start">
        Accessories Store
      </Typography>
      
      <Grid container spacing={4}>
      

        {/* Right Panel - Table */}
        <Grid item xs={12} md={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Accessories List
            </Typography>
            <AccessoriesTable accessories={accessories} />
          </Paper>
        </Grid>
      </Grid>

    
    </div>
  );
};

export default AccessorieView;