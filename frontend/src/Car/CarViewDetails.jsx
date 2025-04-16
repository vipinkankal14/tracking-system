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
        const response = await fetch(
          `http://localhost:5000/api/cars/${encodeURIComponent(carId)}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch car details`);
        }

        const data = await response.json();
        setCar(data);
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (carId) fetchCarDetails();
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
    if (!car?.images?.length) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
  };

  const handlePrevImage = () => {
    if (!car?.images?.length) return;
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
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
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
        onClick={() => navigate("/Productlist")}
        className="back-button"
      >
        &larr; Productlist
      </Button>

      <>
        <Grid container spacing={4}>
          {/* Image Carousel - Left Column */}
          <Grid item xs={12} md={9}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: 220, sm: 440 },
                overflow: "hidden",
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              {car.images?.length > 0 && (
                <>
                  {/* Navigation Arrows */}
                  <IconButton
                    sx={{
                      position: "absolute",
                      left: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: "rgba(255,255,255,0.8)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                      zIndex: 2,
                      display: { xs: "none", sm: "flex" },
                    }}
                    onClick={handlePrevImage}
                  >
                    <ChevronLeft />
                  </IconButton>

                  {/* Main Image with Zoom */}
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      touchAction: "pan-y pinch-zoom",
                    }}
                  >
                    <img
                      src={car.images[currentImageIndex]}
                      alt={car.model}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "contain",
                        transformOrigin: "center center",
                        transition: "transform 0.3s ease",
                        cursor: "zoom-in",
                        maxHeight: "100%",
                      }}
                      onClick={(e) => {
                        const scale =
                          e.target.style.transform === "scale(2)" ? 1 : 2;
                        e.target.style.transform = `scale(${scale})`;
                        e.target.style.cursor =
                          scale === 2 ? "zoom-out" : "zoom-in";
                      }}
                    />
                  </Box>

                  <IconButton
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: "rgba(255,255,255,0.8)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                      zIndex: 2,
                      display: { xs: "none", sm: "flex" },
                    }}
                    onClick={handleNextImage}
                  >
                    <ChevronRight />
                  </IconButton>

                  {/* Mobile Swipe Indicators */}
                  <Box
                    sx={{
                      display: { xs: "flex", sm: "none" },
                      justifyContent: "center",
                      position: "absolute",
                      bottom: 10,
                      left: 0,
                      right: 0,
                      gap: 1,
                    }}
                  >
                    {car.images.map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor:
                            currentImageIndex === index
                              ? "primary.main"
                              : "grey.400",
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Box>

            {/* Thumbnail Gallery */}
            {car.images?.length > 1 && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mt: 2,
                  justifyContent:'center',
                  overflowX: "auto",
                  py: 1,
                  "&::-webkit-scrollbar": { height: 4 },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: 2,
                  },
                }}
              >
                {car.images.map((img, index) => (
                  <Box
                    key={index}
                    sx={{
                      cursor: "pointer",
                      border: currentImageIndex === index ? 2 : 0,
                      borderColor: "primary.main",
                      borderRadius: 1,
                      overflow: "hidden",
                      width: 80,
                      height: 60,
                      flexShrink: 0,
                      opacity: currentImageIndex === index ? 1 : 0.7,
                      transition: "opacity 0.2s",
                      "&:hover": { opacity: 1 },
                    }}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Grid>

          {/* Car Info - Right Column */}
          <Grid item xs={12} md={3}>
            <Box
              sx={{
                p: { xs: 2, md: 3 },
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.75rem", sm: "2rem" },
                }}
              >
                {car.model}
              </Typography>

              <Typography variant="h6" color="primary">
                ₹{car.exShowroomPrice?.toLocaleString()}
              </Typography>

              <List sx={{ mb: 1 }}>
                {[
                  {
                    icon: <Speed />,
                    primary: `${car.mileage} Mileage`,
                    secondary: "Highway/City combined",
                  },
                  {
                    icon: <Engineering />,
                    primary: `${car.engineCapacity} Engine`,
                    secondary: "Turbocharged",
                  },
                  {
                    icon: <LocalGasStation />,
                    primary: car.fuelType,
                    secondary: "Fuel type",
                  },
                  {
                    icon: <EventSeat />,
                    primary: "5 Seats",
                    secondary: "Leather upholstery",
                  },
                ].map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.primary}
                      secondary={item.secondary}
                      primaryTypographyProps={{ fontWeight: 500 }}
                      secondaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                ))}
              </List>

              <Box sx={{ mt: "auto" }}>
                <Button
                  variant="contained"
                  onClick={() =>
                    navigate("/booking", { state: { carData: car } })
                  }
                >
                  Book Now
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </>

      {/* Suggested Vehicles */}
      <Typography variant="h5" className="suggested-title" sx={{ mt: 4, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
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
              <div className="suggested-image">
  <img src={product.image1} alt={product.model} loading="lazy" />
</div>

                <Typography variant="body2">
                  {product.model} {product.variant}
                </Typography>

                <Typography variant="caption" sx={{alignItems:'flex-start'}}  className="suggested-name">
                  {product.color} \ {product.fuelType} 
                </Typography>
                
                <Typography variant="body2" className="suggested-price">
                  ₹{product.exShowroomPrice}
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
                    onClick={() =>
                      navigate("/booking", { state: { carData: product } })
                    }
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
