"use client"

import React from "react"
import '../styles/effects.css'

const NeonText = ({ 
  children, 
  className = "", 
  color = "primary", // primary, secondary, custom
  customColor = "",
  intensity = "medium", // low, medium, high
  ...props 
}) => {
  // Get color based on prop
  const getColorStyle = () => {
    if (color === "custom" && customColor) {
      return { "--neon-primary": customColor, "--neon-secondary": customColor };
    }
    
    switch(color) {
      case "secondary":
        return { "--neon-primary": "#818cf8", "--neon-secondary": "#4f46e5" };
      case "primary":
      default:
        return { "--neon-primary": "#f0abfc", "--neon-secondary": "#d946ef" };
    }
  };
  
  // Adjust text shadow intensity
  const getIntensityStyle = () => {
    switch(intensity) {
      case "low":
        return { 
          "--neon-text-shadow": "0 0 5px rgba(240, 171, 252, 0.6), 0 0 8px rgba(240, 171, 252, 0.4)" 
        };
      case "high":
        return { 
          "--neon-text-shadow": "0 0 7px rgba(240, 171, 252, 1), 0 0 10px rgba(240, 171, 252, 0.8), 0 0 21px rgba(240, 171, 252, 0.6), 0 0 42px rgba(240, 171, 252, 0.4)" 
        };
      case "medium":
      default:
        return { 
          "--neon-text-shadow": "0 0 7px rgba(240, 171, 252, 0.8), 0 0 10px rgba(240, 171, 252, 0.5), 0 0 21px rgba(240, 171, 252, 0.3)" 
        };
    }
  };

  return (
    <span 
      className={`neon-text ${className}`} 
      style={{...getColorStyle(), ...getIntensityStyle()}}
      {...props}
    >
      {children}
    </span>
  );
};

export default NeonText;
