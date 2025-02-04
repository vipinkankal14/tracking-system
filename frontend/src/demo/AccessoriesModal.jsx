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
} from "@mui/material";
import { Check, Add } from "@mui/icons-material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import '../Demo/AccessoriesModal.css';


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
       <Box component={Paper} sx={{ m: 0.5, height: "99vh" }}>
              
        <Box style={{ display: "flex",padding:'14px', justifyContent: "space-between", alignItems: "center" }}>
        Accessories Details
          <Badge badgeContent={addedItems.length} color="error" style={{ cursor: "pointer" }}>
            <AddShoppingCartIcon onClick={onShowCart} style={{ color: "#110f52" }} />
          </Badge>
        
        </Box>

         <FormControl size="small" style={{padding:"10px"}} fullWidth>
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

        <Stack style={{ flexGrow: 1, padding: "4px", height: "75vh", width:'55vh' }}>
          <TableContainer className="custom-scrollbar" style={{ height: "74vh", overflowX: "auto"}} component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell >Price</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAccessories.map((item) => (
                    <TableRow key={item.id} style={{ backgroundColor: addedItems.includes(item.id) ? "#f0f0f0" : "white" }}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell >₹{Number(item.price).toFixed(2)}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
              
        <Box style={{ display: "flex", alignItems: "center",justifyContent:'end',padding:'11px' }}>
            <Button variant="contained" color="primary" onClick={onClose} size="small">Close</Button>
        </Box>
       </Box>
    </Modal>
  );
}
