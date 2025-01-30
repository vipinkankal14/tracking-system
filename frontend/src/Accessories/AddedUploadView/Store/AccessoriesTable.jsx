import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    FormControl, InputLabel, Select, OutlinedInput, Checkbox, MenuItem, ListItemText
} from '@mui/material';
import '../scss/AddAccessories.scss';

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
    const categories = ['All', ...new Set(accessories
        .map(accessory => accessory.category)
        .filter(category => category != null)
    )].sort();

    const handleCategoryChange = (event) => {
        const value = event.target.value;

        // Handle "All" selection logic
        if (value.includes('All')) {
            if (value.length === categories.length) {
                setSelectedCategories(['All']);
            } else {
                setSelectedCategories(value.filter(v => v !== 'All'));
            }
        } else {
            if (value.length === categories.length - 1) {
                setSelectedCategories(['All']);
            } else {
                setSelectedCategories(value);
            }
        }
    };

    // Filter accessories based on selection
    const filteredAccessories = selectedCategories.includes('All')
        ? accessories
        : accessories.filter(accessory =>
            selectedCategories.includes(accessory.category)
        );

    return (
        <div className="accessories-table-container">
            <FormControl size='small' sx={{ m: 1, width: 260 }}>
                <InputLabel id="category-filter-label">Categories</InputLabel>
                <Select
                    labelId="category-filter-label"
                    multiple
                    value={selectedCategories}
                    onChange={handleCategoryChange}
                    input={<OutlinedInput label="Categories" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                    size='small'
                >
                    {categories.map((category) => (
                        <MenuItem size='small' key={category} value={category}>
                            <Checkbox
                                size='small'
                                checked={selectedCategories.includes(category)}
                                color="primary"
                            />
                            <ListItemText size='small' primary={category} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TableContainer component={Paper}>
                <Table aria-label="Accessories price list">
                    <TableHead>
                        <TableRow>
                            <TableCell>Category</TableCell>
                            <TableCell>Accessory Name</TableCell>
                            <TableCell align="right">Price ($)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAccessories.map((accessory) => (
                            <TableRow key={accessory.id || accessory.name}>
                                <TableCell>{accessory.category}</TableCell>
                                <TableCell>{accessory.name}</TableCell>
                                <TableCell align="right">
                                    {Number(accessory.price).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
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
            price: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]).isRequired
        })
    )
};

export default AccessoriesTable;