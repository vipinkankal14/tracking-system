import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  IconButton,
  Box,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { useNavigate } from "react-router-dom";
import "../scss/Accessories.scss";

export default function Accessories({ gocancel, personalInfo, carInfo }) {
  const navigate = useNavigate();
  const [addedItems, setAddedItems] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const accessoriesData = [
    { id: 1, name: "Wireless Earbuds Pro", price: 129.99 },
    { id: 2, name: "Premium Phone Case", price: 34.99 },
    { id: 3, name: "Fast Charging Power Bank", price: 59.99 },
    { id: 4, name: "Tempered Glass Screen Guard", price: 24.99 },
    { id: 5, name: "Bluetooth Speaker", price: 89.99 },
    { id: 6, name: "Car Charger", price: 19.99 },
    { id: 7, name: "Smartwatch", price: 199.99 },
    { id: 8, name: "Laptop Sleeve", price: 49.99 }, { id: 1, name: "Wireless Earbuds Pro", price: 129.99 },
    { id: 2, name: "Premium Phone Case", price: 34.99 },
    { id: 3, name: "Fast Charging Power Bank", price: 59.99 },
    { id: 4, name: "Tempered Glass Screen Guard", price: 24.99 },
    { id: 5, name: "Bluetooth Speaker", price: 89.99 },
    { id: 6, name: "Car Charger", price: 19.99 },
    { id: 7, name: "Smartwatch", price: 199.99 },
    { id: 8, name: "Laptop Sleeve", price: 49.99 }, { id: 1, name: "Wireless Earbuds Pro", price: 129.99 },
    { id: 2, name: "Premium Phone Case", price: 34.99 },
    { id: 3, name: "Fast Charging Power Bank", price: 59.99 },
    { id: 4, name: "Tempered Glass Screen Guard", price: 24.99 },
    { id: 5, name: "Bluetooth Speaker", price: 89.99 },
    { id: 6, name: "Car Charger", price: 19.99 },
    { id: 7, name: "Smartwatch", price: 199.99 },
    { id: 8, name: "Laptop Sleeve", price: 49.99 }, { id: 1, name: "Wireless Earbuds Pro", price: 129.99 },
    { id: 2, name: "Premium Phone Case", price: 34.99 },
    { id: 3, name: "Fast Charging Power Bank", price: 59.99 },
    { id: 4, name: "Tempered Glass Screen Guard", price: 24.99 },
    { id: 5, name: "Bluetooth Speaker", price: 89.99 },
    { id: 6, name: "Car Charger", price: 19.99 },
    { id: 7, name: "Smartwatch", price: 199.99 },
    { id: 8, name: "Laptop Sleeve", price: 49.99 },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAddToCart = (item) => {
    if (!addedItems.includes(item.id)) {
      setAddedItems([...addedItems, item.id]);
    }
  };

  const handleRemove = (id) => {
    setAddedItems(addedItems.filter((itemId) => itemId !== id));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const totalAmount = addedItems.reduce((total, id) => {
    const item = accessoriesData.find((i) => i.id === id);
    return total + (item ? item.price : 0);
  }, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "83vh" }}>
      <header style={{ flexShrink: 0 }}>
        <Typography
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          Accessories
          <Badge
            badgeContent={addedItems.length}
            color="error"
            style={{ cursor: "pointer" }}
          >
            <AddShoppingCartIcon
              onClick={() => setIsModalOpen(true)}
              style={{ color: "#110f52" }}
            />
          </Badge>
        </Typography>
        <Typography variant="body2" style={{ marginLeft: "10px", marginTop: "-4px" }}>
          <Typography style={{ fontSize: "12px" }}>
            Customer ID: <strong>{personalInfo.customerId}</strong>
          </Typography>
          <Typography style={{ fontSize: "12px" }}>
            Full name: <strong>{`${personalInfo.firstName} ${personalInfo.middleName} ${personalInfo.lastName}`}</strong>
          </Typography>
          <Typography style={{ fontSize: "12px" }}>
            Mobile Number: <strong>{`${personalInfo.mobileNumber1} | ${personalInfo.mobileNumber2}`}</strong>
          </Typography>
          <Typography style={{ fontSize: "12px" }}>
            car details: <strong>{`${carInfo.carType} | ${carInfo.model} | ${carInfo.version} | ${carInfo.color}`}</strong>
          </Typography>

          

 

        </Typography>
      </header>

      <main style={{ flexGrow: 1, overflowY: "auto" }} className="accessories">
        {isMobile ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accessoriesData.map((item) => (
                  <TableRow key={item.id} style={{ flexGrow: 1, overflowY: "auto" }}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Button
                        startIcon={
                          addedItems.includes(item.id) ? (
                            <CheckIcon style={{ color: "green" }} />
                          ) : (
                            <AddIcon />
                          )
                        }
                        size="small"
                        onClick={() => handleAddToCart(item)}
                        disabled={addedItems.includes(item.id)}
                      >
                        {addedItems.includes(item.id) ? "Added" : "Add"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Grid container spacing={4} style={{ marginTop: "-2rem" }}>
            {accessoriesData.map((item) => (
              <Grid item xs={6} md={3} key={item.id}>
                <Card className="accessory-card">
                  <CardContent>
                    <Typography variant="h2">{item.name}</Typography>
                    <Typography variant="body1">Price: ${item.price.toFixed(2)}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      startIcon={
                        addedItems.includes(item.id) ? (
                          <CheckIcon style={{ color: "green" }} />
                        ) : (
                          <AddIcon />
                        )
                      }
                      size="small"
                      onClick={() => handleAddToCart(item)}
                      disabled={addedItems.includes(item.id)}
                    >
                      {addedItems.includes(item.id) ? "Added" : "Add"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

      </main>

      <Modal open={isModalOpen} aria-labelledby="added-items-modal">
        <Box
          sx={{
            padding: "20px",
            backgroundColor: "white",
            margin: "auto",
            marginTop: "8px",
            maxWidth: "362px",
            height: "98%", // Adjust height as needed
            overflowY: "auto", // Allows scrolling if content overflows
          }}
        >
          <Typography id="added-items-modal" variant="h6" style={{ marginBottom: "10px" }}>
            Added Items
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {addedItems.map((id) => {
                  const item = accessoriesData.find((i) => i.id === id);
                  return (
                    <TableRow key={id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleRemove(id)}>
                          <ClearRoundedIcon style={{ color: "red" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell>
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>${addedItems.reduce((total, id) => {
                      const item = accessoriesData.find((i) => i.id === id);
                      return total + item.price;
                    }, 0).toFixed(2)}</strong>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <Button onClick={handleCloseModal} style={{ marginRight: "10px" }}>
              Close
            </Button>
            <Button variant="contained">Submit</Button>
          </div>
        </Box>
      </Modal>


      <Button onClick={goback}>goback</Button>


    </div>
  );
}
