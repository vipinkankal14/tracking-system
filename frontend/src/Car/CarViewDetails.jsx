"use client";

import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Speed,
  Engineering,
  LocalGasStation,
  EventSeat,
  LocalOffer,
} from "@mui/icons-material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import "../Car/CarViewDetails.scss";
import { useState, useRef, useEffect } from "react";

function CarViewDetails() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const suggestedProductsRef = useRef(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        console.log("Fetching car details for carId:", carId);
        const response = await fetch(
          `http://localhost:5000/api/cars/${encodeURIComponent(carId)}`
        );
        console.log("API Response:", response);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch car details: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Fetched Car Data:", data);

        setCar(data);
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      fetchCarDetails();
    }
  }, [carId]);

  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/suggested-products"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch suggested products");
        }
        const data = await response.json();
        setSuggestedProducts(data);
      } catch (error) {
        console.error("Error fetching suggested products:", error);
      }
    };

    fetchSuggestedProducts();
  }, []);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? car.images.length - 1 : prevIndex - 1
    );
  };

  const handleViewDetails = (product) => {
    navigate(`/car/${encodeURIComponent(product.id)}`);
  };

  const scrollSuggestedProducts = (direction) => {
    const container = suggestedProductsRef.current;
    const scrollAmount = 300;
    if (container) {
      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} />
        <Typography variant="h5" ml={2}>
          Loading car details...
        </Typography>
      </Box>
    );
  }

  if (!car) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h5" color="error">
          Car not found.
        </Typography>
      </Box>
    );
  }

  return (
    <div className="car-view-details">
      <Button
        variant="text"
        onClick={() => navigate(-1)}
        className="back-button"
      >
        &larr; Back to Categories
      </Button>

      <Card className="main-car-card">
        <CardContent>
          <Grid container spacing={3}>
            {/* Image Section */}
            <Grid item xs={12} md={6}>
              <Box sx={{ position: "relative", width: "100%", height: 300 }}>
                {car.images && car.images.length > 0 && (
                  <>
                    <IconButton
                      sx={{
                        position: "absolute",
                        left: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                        },
                      }}
                      onClick={handlePrevImage}
                    >
                      <ChevronLeft />
                    </IconButton>

                    <img
                      src={car.images[currentImageIndex]}
                      alt={car.model}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />

                    <IconButton
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                        },
                      }}
                      onClick={handleNextImage}
                    >
                      <ChevronRight />
                    </IconButton>
                  </>
                )}
              </Box>
            </Grid>

            {/* Description Section */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                  {car.model}
                </Typography>

                <Typography variant="h5" color="primary" gutterBottom>
                  ${car.exShowroomPrice.toLocaleString()}
                </Typography>

                <List sx={{ width: "100%" }}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Speed fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${car.mileage} Mileage`}
                      secondary="Highway/City combined"
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Engineering fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${car.engineCapacity} Engine`}
                      secondary="Turbocharged"
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <LocalGasStation fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={car.fuelType}
                      secondary="Fuel type"
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <EventSeat fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="5 Seats"
                      secondary="Leather upholstery"
                    />
                  </ListItem>
                </List>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mt: 3 }}
                  onClick={() => navigate("/booking", { state: { carData: car } })}
                >
                  Book Now
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h5" className="suggested-title">
        Suggested Vehicles
      </Typography>

      <div className="suggested-products-container">
        <IconButton
          className="nav-button left"
          onClick={() => scrollSuggestedProducts("left")}
        >
          <ChevronLeft />
        </IconButton>
        <div className="suggested-products" ref={suggestedProductsRef}>
          {suggestedProducts.map((product, index) => (
            <Card className="suggested-card" key={index}>
              <CardContent>
                <div className="suggested-image"></div>
                <Typography variant="h6" className="suggested-name">
                  {product.model}
                </Typography>
                <Typography variant="body2" className="suggested-price">
                  ${product.exShowroomPrice}
                </Typography>
                <div className="suggested-actions">
                  <Button
                    variant="outlined"
                    size="small"
                    className="view-btn"
                    onClick={() => handleViewDetails(product)}
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    className="book-now-btn"
                    onClick={() => navigate("/booking", { state: { carData: product } })}
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <IconButton
          className="nav-button right"
          onClick={() => scrollSuggestedProducts("right")}
        >
          <ChevronRight />
        </IconButton>
      </div>
    </div>
  );
}

export default CarViewDetails;