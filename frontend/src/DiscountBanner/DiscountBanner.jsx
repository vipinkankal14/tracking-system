"use client"

import { useState, useEffect } from "react"
import { Box, Typography, IconButton, useMediaQuery, useTheme } from "@mui/material"
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material"
import "../DiscountBanner/DiscountBanner.scss"

// Import your discount images
import discount1 from "./assets/homepage.avif"
import discount2 from "./assets/home-banner-second.avif"
import discount3 from "./assets/v2-safari.avif"

const DiscountBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const sliderImages = [
    {
      image: discount1,
      title: "🎉 Summer Sale! 20% Off 🎉",
      description: "Use code SUMMER20 at checkout",
      mobileImagePosition: "center 30%", // Custom background position for mobile
    },
    {
      image: discount2,
      title: "🚗 New Arrivals!",
      description: "Explore our latest models",
      mobileImagePosition: "center 70%",
    },
    {
      image: discount3,
      title: "🌟 Special Edition",
      description: "Limited stock available",
      mobileImagePosition: "center center",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1))
  }

  // Auto-rotate slides every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  // Touch/swipe handling for mobile
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) nextSlide() // swipe left
    if (touchStart - touchEnd < -50) prevSlide() // swipe right
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "50vh", sm: "70vh", md: "580px" },
        maxHeight: { xs: "400px", md: "none" },
        overflow: "hidden",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {sliderImages.map((slide, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: {
              xs: slide.mobileImagePosition || "center center",
              sm: "center center",
            },
            opacity: index === currentSlide ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
            display: "flex",
            flexDirection: "column",
            justifyContent: { xs: "flex-end", sm: "center" },
            alignItems: { xs: "center", sm: "flex-start" },
            color: "#fff",
            textAlign: { xs: "center", sm: "left" },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
            },
          }}
        >
          {/* Content */}
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              maxWidth: { xs: "90%", sm: "80%", md: "50%" },
              px: { xs: 2, sm: 4 },
              py: { xs: 3, sm: 4 },
              mb: { xs: 4, sm: 0 },
              ml: { xs: 0, sm: "10%" },
            }}
          >
            {slide.title && (
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: {
                    xs: "1.6rem",
                    sm: "2rem",
                    md: "2.5rem",
                    lg: "3rem",
                  },
                  lineHeight: 1.2,
                  textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
                }}
              >
                {slide.title}
              </Typography>
            )}

            {slide.description && (
              <Typography
                variant="h5"
                component="p"
                sx={{
                  mb: 3,
                  fontSize: {
                    xs: "1rem",
                    sm: "1.2rem",
                    md: "1.4rem",
                  },
                  textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                }}
              >
                {slide.description}
              </Typography>
            )}
          </Box>
        </Box>
      ))}

      {/* Navigation Controls */}
      {!isMobile && (
        <>
          <IconButton
            onClick={prevSlide}
            sx={{
              position: "absolute",
              left: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 3,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.3)",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.6)",
              },
              width: 48,
              height: 48,
              display: { xs: "none", sm: "flex" },
            }}
          >
            <KeyboardArrowLeft fontSize="large" />
          </IconButton>

          <IconButton
            onClick={nextSlide}
            sx={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 3,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.3)",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.6)",
              },
              width: 48,
              height: 48,
              display: { xs: "none", sm: "flex" },
            }}
          >
            <KeyboardArrowRight fontSize="large" />
          </IconButton>
        </>
      )}

      {/* Dots Indicator */}
      <Box
        sx={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          zIndex: 3,
          gap: "10px",
        }}
      >
        {sliderImages.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentSlide(index)}
            sx={{
              width: { xs: "12px", sm: "10px" },
              height: { xs: "12px", sm: "10px" },
              borderRadius: "50%",
              backgroundColor: index === currentSlide ? "primary.main" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              transition: "all 0.3s",
              "&:hover": {
                backgroundColor: index === currentSlide ? "primary.dark" : "rgba(255,255,255,0.8)",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

export default DiscountBanner