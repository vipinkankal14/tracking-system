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
  Chip,
  Divider,
  Badge,
} from "@mui/material";
import {
  Speed,
  Engineering,
  LocalGasStation,
  EventSeat,
  CalendarToday,
  DirectionsCar,
  CheckCircle,
  Close,
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
  const [zoom, setZoom] = useState(false);

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
    setZoom(false);
  };

  const handlePrevImage = () => {
    if (!car?.images?.length) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? car.images.length - 1 : prevIndex - 1
    );
    setZoom(false);
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

  const formatPrice = (price) => {
    if (!price) return "Price on request";

    const numericPrice = typeof price === "string" ? parseFloat(price) : price;

    // For amounts in lakhs (1,00,000 to 99,99,999)
    if (numericPrice >= 100000 && numericPrice < 10000000) {
      const lakhs = (numericPrice / 100000).toFixed(2);
      return `₹${lakhs} Lakh`;
    }
    // For amounts in crores (1,00,00,000 and above)
    else if (numericPrice >= 10000000) {
      const crores = (numericPrice / 10000000).toFixed(2);
      return `₹${crores} Crore`;
    }
    // For amounts below 1 lakh
    else {
      const formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      });
      return formatter.format(numericPrice);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
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
        startIcon={<ChevronLeft />}
        onClick={() => navigate(-1)}
        className="back-button"
        sx={{ mb: 2 }}
      >
        Back to Inventory
      </Button>

      <Grid container spacing={4}>
        {/* Image Carousel - Left Column */}
        <Grid item xs={12} md={8} lg={9}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: 220, sm: 400, md: 500 },
              overflow: "hidden",
              borderRadius: 2,
              boxShadow: 1,
              bgcolor: "background.paper",
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

                {/* Main Image */}
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    cursor: zoom ? "zoom-out" : "zoom-in",
                  }}
                  onClick={() => setZoom(!zoom)}
                >
                  <img
                    src={car.images[currentImageIndex]}
                    alt={car.model}
                    style={{
                      width: zoom ? "auto" : "100%",
                      height: zoom ? "100%" : "auto",
                      objectFit: zoom ? "contain" : "cover",
                      transform: zoom ? "scale(1.5)" : "scale(1)",
                      transition: "transform 0.3s ease",
                      maxHeight: "100%",
                      maxWidth: "100%",
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

                {/* Image Counter */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "white",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 4,
                    fontSize: "0.875rem",
                  }}
                >
                  {currentImageIndex + 1} / {car.images.length}
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
                    transition: "all 0.2s",
                    "&:hover": { opacity: 1 },
                  }}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setZoom(false);
                  }}
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

          {/* Car Details Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Vehicle Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Model
                </Typography>
                <Typography variant="body1">{car.model || "N/A"}</Typography>
              </Grid>

              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Variant
                </Typography>
                <Typography variant="body1">{car.version || "N/A"}</Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Color
                </Typography>
                <Typography variant="body1">{car.color || "N/A"}</Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Year
                </Typography>
                <Typography variant="body1">
                  {car.manufacturerDate
                    ? new Date(car.manufacturerDate).getFullYear()
                    : "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Color
                </Typography>
                <Typography variant="body1">{car.color || "N/A"}</Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Transmission
                </Typography>
                <Typography variant="body1">
                  {car.transmission || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Fuel Type
                </Typography>
                <Typography variant="body1">{car.fuelType || "N/A"}</Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Mileage
                </Typography>
                <Typography variant="body1">{car.mileage || "N/A"}</Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Seating Capacity
                </Typography>
                <Typography variant="body1">
                  {car.seatingCapacity || "5"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Car Info - Right Column */}
        <Grid item xs={12} md={4} lg={3}>
          <Box
            sx={{
              p: { xs: 2, md: 3 },
              height: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 1,
              position: "sticky",
              top: 16,
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", sm: "1.75rem" },
                }}
              >
                {car.model} {car.version}
              </Typography>

              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                {formatPrice(car.exShowroomPrice)}
                <Typography variant="body2" color="text.secondary">
                  (Ex-showroom price)
                </Typography>
              </Typography>

              <Chip
                label={
                  car.allotmentCarStatus === "Allocated"
                    ? "Booked"
                    : "Available"
                }
                color={
                  car.allotmentCarStatus === "Allocated" ? "error" : "success"
                }
                size="small"
                sx={{ mb: 2 }}
              />
            </Box>

            <List sx={{ mb: 2 }}>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                  <DirectionsCar />
                </ListItemIcon>
                <ListItemText
                  primary={car.carType || "N/A"}
                  secondary="Body Type"
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: "body2" }}
                />
              </ListItem>

              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                  <Engineering />
                </ListItemIcon>
                <ListItemText
                  primary={`${car.engineCapacity || "N/A"} • ${
                    car.transmission || "N/A"
                  }`}
                  secondary="Engine & Transmission"
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: "body2" }}
                />
              </ListItem>

              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                  <LocalGasStation />
                </ListItemIcon>
                <ListItemText
                  primary={car.fuelType || "N/A"}
                  secondary="Fuel Type"
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: "body2" }}
                />
              </ListItem>

              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                  <CalendarToday />
                </ListItemIcon>
                <ListItemText
                  primary={formatDate(car.manufacturerDate)}
                  secondary="Manufacture Date"
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: "body2" }}
                />
              </ListItem>
            </List>

            <Box
              sx={{
                mt: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() =>
                  navigate("/booking", { state: { carData: car } })
                }
                disabled={car.allotmentCarStatus === "Allocated"}
                sx={{ py: 1.5 }}
              >
                {car.allotmentCarStatus === "Allocated"
                  ? "Already Booked"
                  : "Book Now"}
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/ContactUs")}
                sx={{ py: 1.5 }}
              >
                Contact Sales
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Suggested Vehicles */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Similar Vehicles You Might Like
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ position: "relative" }}>
          <IconButton
            sx={{
              position: "absolute",
              left: -16,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "background.paper",
              boxShadow: 1,
              zIndex: 1,
              display: { xs: "none", md: "flex" },
              "&:hover": { backgroundColor: "background.default" },
            }}
            onClick={() => scrollSuggestedProducts("left")}
          >
            <ChevronLeft />
          </IconButton>

          <Box
            ref={suggestedProductsRef}
            sx={{
              display: "flex",
              gap: 3,
              overflowX: "auto",
              scrollBehavior: "smooth",
              py: 1,
              px: 1,
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {suggestedProducts.map((product) => (
              <Card
                key={product.id}
                sx={{
                  minWidth: 280,
                  flexShrink: 0,
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 3 },
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Badge
                    color={
                      product.allotmentCarStatus === "Allocated"
                        ? "error"
                        : "success"
                    }
                    badgeContent={
                      product.allotmentCarStatus === "Allocated"
                        ? "Booked"
                        : "Available"
                    }
                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.7rem",
                        padding: "4px 8px",
                        borderRadius: 1,
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={product.image1}
                      alt={product.model}
                      sx={{
                        width: "100%",
                        height: 160,
                        objectFit: "cover",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    />
                  </Badge>
                </Box>

                <CardContent>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    {product.model} {product.version}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {product.color} • {product.fuelType}
                  </Typography>

                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                    {formatPrice(product.exShowroomPrice)}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      onClick={() => handleViewDetails(product)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      disabled={product.allotmentCarStatus === "Allocated"}
                      onClick={() =>
                        navigate("/booking", { state: { carData: product } })
                      }
                    >
                      {product.allotmentCarStatus === "Allocated"
                        ? "Booked"
                        : "Book"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          <IconButton
            sx={{
              position: "absolute",
              right: -16,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "background.paper",
              boxShadow: 1,
              zIndex: 1,
              display: { xs: "none", md: "flex" },
              "&:hover": { backgroundColor: "background.default" },
            }}
            onClick={() => scrollSuggestedProducts("right")}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
}

export default CarViewDetails;
