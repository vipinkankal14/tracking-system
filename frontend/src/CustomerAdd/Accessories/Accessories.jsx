import React, { useState } from "react";
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
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import '../scss/Accessories.scss';
import AddToCart from "./AddToCart";

export default function Accessories({ gocancel, personalInfo, carInfo,updateFormData }) {
  const navigate = useNavigate();

  // State to manage added items
  const [addedItems, setAddedItems] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isAddToCartOpen, setIsAddToCartOpen] = useState(false);

  // Accessories data
  const accessoriesData = [
    { id: 1, name: "Wireless Earbuds Pro", price: 129.99 },
    { id: 2, name: "Premium Phone Case", price: 34.99 },
    { id: 3, name: "Fast Charging Power Bank", price: 59.99 },
    { id: 4, name: "Tempered Glass Screen Guard", price: 24.99 },
    { id: 5, name: "Bluetooth Speaker", price: 89.99 },
    { id: 6, name: "Car Charger", price: 19.99 },
    { id: 7, name: "Smartwatch", price: 199.99 },
    { id: 8, name: "Laptop Sleeve", price: 49.99 },
  ];

  // Add item to cart
  const handleAddToCart = (item) => {
    if (!addedItems.includes(item.id)) {
      setAddedItems([...addedItems, item.id]);
    }
  };

  const handleOpenAddToCart = () => {
    setIsAddToCartOpen(true);
  };

  const handleCloseAddToCart = () => {
    setIsAddToCartOpen(false);
  };

  if (isAddToCartOpen) {
    return (
      <AddToCart
        addedItems={addedItems}
        onBack={handleCloseAddToCart}
        personalInfo={personalInfo}
        carInfo={carInfo}
        updateFormData={updateFormData}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "83vh", // Full viewport height
      }}
    >
      {/* Fixed Header */}
      <header
        style={{
          flexShrink: 0, // Prevents the header from shrinking

        }}
      >
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
            style={{
              cursor: "pointer",
            }}
          >
            <AddShoppingCartIcon
              onClick={handleOpenAddToCart}
              style={{ color: "#110f52" }}
            />
          </Badge>
        </Typography>

        <Typography
          variant="body2"
          style={{
            textAlign: "left",
            marginLeft: "10px",
            marginTop: "-4px",
          }}
        >
          <Typography style={{ fontSize: "12px" }}>
            Customer ID: <strong>{personalInfo.customerId}</strong>
          </Typography>
          <Typography style={{ fontSize: "12px" }}>
            Full name:{" "}
            <strong>
              {personalInfo.firstName} {personalInfo.middleName}{" "}
              {personalInfo.lastName}
            </strong>
          </Typography>
          <Typography style={{ fontSize: "12px" }}>
            Mobile Number:{" "}
            <strong>
              {personalInfo.mobileNumber1} | {personalInfo.mobileNumber2}
            </strong>
          </Typography>
          <Typography style={{ fontSize: "12px" }}>
            Email: <strong>{personalInfo.email}</strong>
          </Typography>
          <Typography style={{ fontSize: "12px" }}>
            Team Leader: <strong>{carInfo.teamLeader}</strong> | Team Member:{" "}
            <strong>{carInfo.teamMember}</strong>
          </Typography>
          <Typography style={{ fontSize: "12px" }}>
            Car Details:{" "}
            <strong>
              {carInfo.carType} | {carInfo.model} | {carInfo.color} |{" "}
              {carInfo.version}
            </strong>
          </Typography>
          <Typography><br /></Typography>
        </Typography>

      </header>

      {/* Scrollable Main Section */}
      <main
        style={{
          flexGrow: 1, // Allows the main section to grow and take up remaining space
          overflowY: "auto", // Enables vertical scrolling
          padding: "1rem",
        }}
        className="accessories"
      >
        {isMobile ? (
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
                {accessoriesData.map((item) => (
                  <TableRow key={item.id}>
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
                  <CardContent style={{ textAlign: "start" }}>
                    <Typography variant="h2">{item.name}</Typography>
                    <Typography variant="body1">
                      Price: ${item.price.toFixed(2)}
                    </Typography>
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

      {/* Footer Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Button
          onClick={gocancel}
          variant="contained"
          color="secondary"
          size="small"
          style={{ backgroundColor: "#e0e0e0", color: "#000", marginTop: '0' }}
        >
          cancel
        </Button>

      </div>
    </div>

  );
}
