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
 import "../scss/Accessories.scss";
import AdditionalInfo from "../AdditionalInfo";

export default function Accessories() {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false); // Toggle state for rendering AdditionalInfo
  const [addedItems, setAddedItems] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

  const handleAddToCart = (item) => {
    if (!addedItems.includes(item.id)) {
      setAddedItems([...addedItems, item.id]);
    }
  };

  if (showAdditionalInfo) {
    return (
      <AdditionalInfo
        data={{}}
        updateData={() => {}}
        personalInfo={{}}
        carInfo={{}}
        orderInfo={{}}
      />
    );
  }

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
            <AddShoppingCartIcon style={{ color: "#110f52" }} />
          </Badge>
        </Typography>
      </header>

      <main
        style={{
          flexGrow: 1,
          overflowY: "auto",
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

      <div style={{ display: "flex", justifyContent: "end" }}>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          style={{ backgroundColor: "#e0e0e0", color: "#000", marginTop: "0" }}
          onClick={() => setShowAdditionalInfo(true)} // Update state to show AdditionalInfo
        >
          Back
        </Button>
      </div>
    </div>
  );
}
