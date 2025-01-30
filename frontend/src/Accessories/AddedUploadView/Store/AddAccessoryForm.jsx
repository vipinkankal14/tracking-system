import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const AddAccessoryForm = ({ onAdd }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && price && category) {
            onAdd({ name, price: parseFloat(price), category });
            setName('');
            setPrice('');
            setCategory('');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
              <TextField
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Accessory Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
          
            <Button type="submit" variant="contained" color="primary" size='small'>
                Add Accessory
            </Button>
        </Box>
    );
};

export default AddAccessoryForm;