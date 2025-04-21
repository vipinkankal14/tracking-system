"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Badge,
  Divider,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "react-feather";

function SuggestedProducts1530() {
  const navigate = useNavigate();
  const suggestedProductsRef = useRef(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/suggested-products/1530"
        );
        if (!response.ok) throw new Error("Failed to fetch suggested products");
        const data = await response.json();
        setSuggestedProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedProducts();
  }, []);

  const scrollSuggestedProducts = (direction) => {
    const container = suggestedProductsRef.current;
    const scrollAmount = container.offsetWidth * 0.8;

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

    if (numericPrice >= 100000 && numericPrice < 10000000) {
      return `₹${(numericPrice / 100000).toFixed(2)} Lakh`;
    }
    if (numericPrice >= 10000000) {
      return `₹${(numericPrice / 10000000).toFixed(2)} Crore`;
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(numericPrice);
  };

  const handleViewDetails = (product) => {
    navigate(`/car/${product.id}`);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ mt: -6, mb: 4 }}>
        <Typography variant="inherit" gutterBottom sx={{ fontWeight: 600 }}>
          Similar Vehicles You Might Like{" "}
          <Box component="span" sx={{ color: "red" }}>
            15.00 Lakh - 30.00 Lakh
          </Box>
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
                      src={product.image1 || "/default-car.jpg"}
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
    </Box>
  );
}

export default SuggestedProducts1530;
