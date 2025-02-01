import React, { useState } from 'react'; 
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  MenuItem,
  ListItemText,
} from '@mui/material';

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 250,
      width: 250,
    },
  },
};

const AccessoriesTable = ({ accessories = [] }) => {
  const [selectedCategories, setSelectedCategories] = useState(['All']);

  // Extract unique categories
  const categories = [
    'All',
    ...new Set(accessories.map((accessory) => accessory.category).filter(Boolean)), // Filter out null/undefined
  ].sort();

  const handleCategoryChange = (event) => {
    const value = event.target.value;

    if (value.includes('All')) {
      if (value.length === categories.length) {
        setSelectedCategories(['All']);
      } else {
        setSelectedCategories(value.filter((v) => v !== 'All'));
      }
    } else {
      if (value.length === categories.length - 1) {
        setSelectedCategories(['All']);
      } else {
        setSelectedCategories(value);
      }
    }
  };

  // Filter accessories based on selected categories
  const filteredAccessories = selectedCategories.includes('All')
    ? accessories
    : accessories.filter((accessory) => selectedCategories.includes(accessory.category));

  return (
    <div className="accessories-table-container">
      {/* Category Filter Dropdown */}
      <FormControl size="small" sx={{ m: 1, width: 260 }}>
        <InputLabel id="category-filter-label">Categories</InputLabel>
        <Select
          labelId="category-filter-label"
          multiple
          value={selectedCategories}
          onChange={handleCategoryChange}
          input={<OutlinedInput label="Categories" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              <Checkbox checked={selectedCategories.includes(category)} color="primary" />
              <ListItemText primary={category} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Accessories Table */}
      <TableContainer component={Paper}>
        <Table aria-label="Accessories price list">
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Accessory Name</TableCell>
              <TableCell align="right">Price ($)</TableCell>
              <TableCell align="right">Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccessories.length > 0 ? (
              filteredAccessories.map((accessory, index) => (
                <TableRow key={index}>
                  <TableCell>{accessory.category || 'N/A'}</TableCell>
                  <TableCell>{accessory.name || 'Unnamed'}</TableCell>
                  <TableCell align="right">{Number(accessory.price || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">{accessory.quantity || 0}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No accessories available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

AccessoriesTable.propTypes = {
  accessories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      category: PropTypes.string,
      name: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ),
};

export default AccessoriesTable;
