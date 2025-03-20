"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Badge,
  TableContainer,
  Box,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Check, Add } from "@mui/icons-material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import './AccessoriesModal.css';


export function AccessoriesModal({
  open,
  onClose,
  onShowCart,
  addedItems,
  setAddedItems,
  selectedProducts,
  setSelectedProducts,
}) {
  const [accessoriesData, setAccessoriesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchAccessoriesData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getAllAccessories");
        const data = await response.json();
        setAccessoriesData(data);
      } catch (error) {
        console.error("Error fetching accessories data:", error);
      }
    };

    fetchAccessoriesData();
  }, []);

  const handleAddToCart = (item) => {
    if (!addedItems.includes(item.id)) {
      setAddedItems([...addedItems, item.id]);
      setSelectedProducts([...selectedProducts, item]);
    }
  };

  const categories = [...new Set(accessoriesData.map((item) => item.category)), "all"];
  const filteredAccessories =
    selectedCategory === "all"
      ? accessoriesData
      : accessoriesData.filter((item) => item.category === selectedCategory);

  return (
    <Modal open={open} sx={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
      <Box component={Paper} sx={{ width: { xs: "100%", sm: "60vh" }, height: { xs: "100%", sm: "99%" }, marginBottom: { sm: "4px" } }}>
        <Stack spacing={1} sx={{ p: 2, maxWidth: 600, height: { xs: "100%", sm: "100%" }, borderRadius: 2 }}>
          <Box textAlign="center" sx={{ p: 2, width: "55vh", justifyContent: "start", alignItems: "center", display: "flex" }}>
            <Typography variant="h5" component="h1">Accessories</Typography>
          </Box>
          <Stack spacing={2} sx={{ p: 1, m: 0.6, maxWidth: 600, height: "79vh", overflowY: "auto", borderRadius: 2, bgcolor: "background.paper" }}>
            <Stack spacing={4}>
              <Box style={{ display: "flex", padding: '14px', justifyContent: "space-between", alignItems: "center" }}>
                Accessories Details
                <Badge badgeContent={addedItems.length} color="error" style={{ cursor: "pointer" }}>
                  <AddShoppingCartIcon onClick={onShowCart} style={{ color: "#110f52" }} />
                </Badge>
              </Box>
              <FormControl size="small" fullWidth>
                <InputLabel id="category-filter-label">Categories</InputLabel>
                <Select
                  labelId="category-filter-label"
                  value={selectedCategory}
                  input={<OutlinedInput label="Categories" />}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  size="small"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Stack style={{ flexGrow: 1 }} sx={{ width: { xs: "100%", sm: "100%" }, height: { xs: "50vh", sm: "55vh" } }}>
                <TableContainer className="custom-scrollbar" style={{ overflowX: "auto" }} component={Paper}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAccessories.length > 0 ? (
                        filteredAccessories.map((item) => (
                          <TableRow key={item.id} style={{ backgroundColor: addedItems.includes(item.id) ? "#f0f0f0" : "white" }}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>₹{Number(item.price).toFixed(2)}</TableCell>
                            <TableCell align="right">
                              <IconButton
                                color={addedItems.includes(item.id) ? "success" : "primary"}
                                onClick={() => handleAddToCart(item)}
                                disabled={addedItems.includes(item.id)}
                              >
                                {addedItems.includes(item.id) ? <Check /> : <Add />}
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            No products available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </Stack>
          </Stack>
          <Box style={{ display: "flex", alignItems: "center", justifyContent: 'end' }}>
            <Button variant="contained" color="primary" onClick={onClose} size="small">Close</Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
