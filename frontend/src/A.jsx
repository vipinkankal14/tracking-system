import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  OutlinedInput,
  InputAdornment,
  Button,
} from '@mui/material';

import './scss/DiscountForCarAndAdditional.scss';

const carData = {
  models: {
    swift: {
      carType: 'Hatchback',
      versions: {
        vxi: ['Red', 'Blue', 'White'],
        zxi: ['Black', 'Silver'],
      },
    },
    baleno: {
      carType: 'Hatchback',
      versions: {
        sigma: ['Blue', 'Grey'],
        alpha: ['White', 'Red'],
      },
    },
    ciaz: {
      carType: 'Sedan',
      versions: {
        sigma: ['Black', 'Brown'],
        alpha: ['White', 'Silver'],
      },
    },
  },
};

export default function CascadingDropdownWithTable() {
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedCarType, setSelectedCarType] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [discountAmount, setDiscountAmount] = useState('');

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
    setSelectedVersion('');
    setSelectedColor('');
  };

  const handleVersionChange = (event) => {
    setSelectedVersion(event.target.value);
    setSelectedColor('');
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  const handleCarTypeChange = (event) => {
    setSelectedCarType(event.target.value);
  };

  const handleDiscountAmountChange = (event) => {
    setDiscountAmount(event.target.value);
  };

  const handleDiscountAmountChangeMobile = (event) => {
    setDiscountAmount(event.target.value);
  };

  const handleApplyDiscount = () => {
    const updatedRows = selectedRows.map((index) => ({
      ...filteredRows[index],
      discountAmount: discountAmount,
    }));
    // Update your state or API here with the updatedRows
    console.log('Updated Rows with Discounts:', updatedRows);
  };

  const handleApplyDiscountMobile = () => {
    const updatedRows = selectedRows.map((index) => ({
      ...filteredRows[index],
      discountAmount: discountAmount,
    }));
    // Update your state or API here with the updatedRows
    console.log('Updated Rows with Discounts:', updatedRows);
  };

  // Add `carType` to allRows
  const allRows = Object.entries(carData.models).flatMap(([model, modelData]) =>
    Object.entries(modelData.versions).flatMap(([version, colors]) =>
      colors.map((color) => ({
        model,
        version,
        color,
        carType: modelData.carType, // Include carType here
      }))
    )
  );

  // Filter rows based on selected criteria
  const filteredRows = allRows.filter(
    (row) =>
      (!selectedModel || row.model === selectedModel) &&
      (!selectedVersion || row.version === selectedVersion) &&
      (!selectedColor || row.color === selectedColor) &&
      (!selectedCarType || row.carType === selectedCarType)
  );

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className="container">
      <div className="left-panel">

        <Typography variant="h6" gutterBottom style={{ marginTop: '16px' }}>
          Select Car Details
        </Typography>

        {/* Dropdown for Car Model */}
        <FormControl fullWidth>
          <InputLabel id="model-label">Model</InputLabel>
          <Select labelId="model-label" value={selectedModel} onChange={handleModelChange} label="Model">
            <MenuItem value="">All</MenuItem>
            {Object.keys(carData.models).map((model) => (
              <MenuItem key={model} value={model}>
                {model.charAt(0).toUpperCase() + model.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Dropdown for Car Version */}
        <FormControl fullWidth disabled={!selectedModel}>
          <InputLabel id="version-label">Version</InputLabel>
          <Select labelId="version-label" value={selectedVersion} onChange={handleVersionChange} label="Version">
            <MenuItem value="">All</MenuItem>
            {selectedModel &&
              Object.keys(carData.models[selectedModel].versions).map((version) => (
                <MenuItem key={version} value={version}>
                  {version.toUpperCase()}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Dropdown for Car Color */}
        <FormControl fullWidth disabled={!selectedVersion}>
          <InputLabel id="color-label">Color</InputLabel>
          <Select labelId="color-label" value={selectedColor} onChange={handleColorChange} label="Color">
            <MenuItem value="">All</MenuItem>
            {selectedModel &&
              selectedVersion &&
              carData.models[selectedModel].versions[selectedVersion].map((color) => (
                <MenuItem key={color} value={color}>
                  {color}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        
        <Typography variant="h6">
          Select Car Type 
        </Typography>
        {/* Dropdown for Car Type */}
        <FormControl fullWidth>
          <InputLabel id="car-type-label">Car Type</InputLabel>
          <Select labelId="car-type-label" value={selectedCarType} onChange={handleCarTypeChange} label="Car Type">
            <MenuItem value="">All</MenuItem>
            {[...new Set(allRows.map((row) => row.carType))].map((carType) => (
              <MenuItem key={carType} value={carType}>
                {carType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />

        <div className="discount-amount-section" style={{ marginTop: '-36px' }}>
          <Typography variant="h6" gutterBottom>DISCOUNT AMOUNT</Typography><br />
          <FormControl fullWidth>
            <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              value={discountAmount}
              onChange={handleDiscountAmountChange}
              startAdornment={<InputAdornment position="start">₹</InputAdornment>}
              label="Amount"
            />
          </FormControl>
          <div style={{ marginTop: '16px' }}>
            <Button variant="contained" onClick={handleApplyDiscount}>Submit</Button>
          </div>
        </div>
        
      </div>

      <div className="right-panel">
        
        <>
          <Typography variant="h6" gutterBottom style={{ marginTop: '16px' }}>
            Available Cars
          </Typography>
          {filteredRows.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={filteredRows.every((_, index) => selectedRows.includes(index))}
                        onChange={() => {
                          if (filteredRows.every((_, index) => selectedRows.includes(index))) {
                            setSelectedRows([]);
                          } else {
                            setSelectedRows(filteredRows.map((_, index) => index));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ width: '26%' }} >Model</TableCell>
                    <TableCell sx={{ width: '26%' }} >Version</TableCell>
                    <TableCell sx={{ width: '26%' }} >Color</TableCell>
                    <TableCell sx={{ width: '26%' }} >Car Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows.map((row, index) => (
                    <TableRow key={index} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRows.includes(index)}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </TableCell>
                      <TableCell>{row.model.charAt(0).toUpperCase() + row.model.slice(1)}</TableCell>
                      <TableCell>{row.version.toUpperCase()}</TableCell>
                      <TableCell>{row.color}</TableCell>
                      <TableCell>{row.carType}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No cars available for the selected criteria.</Typography>
          )}
        </>

        <>
          <div className="discount-amount-section-mobile" style={{ marginTop: '16px' }}>
            <Typography variant="h6" gutterBottom>DISCOUNT AMOUNT</Typography><br />
            <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount-mobile"
                value={discountAmount}
                onChange={handleDiscountAmountChangeMobile}
                startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                label="Amount"
              />
            </FormControl>
            <div style={{ marginTop: '16px' }}>
              <Button variant="contained" onClick={handleApplyDiscountMobile}>Submit</Button>
            </div>
          </div>
          <br />
        </>

      </div>
    </div>
  );


}
