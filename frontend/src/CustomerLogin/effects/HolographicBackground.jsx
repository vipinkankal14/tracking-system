"use client"

import React from "react"
import '../styles/effects.css'

const HolographicBackground = ({
  children,
  className = "",
  withNeonText = false,
  intensity = "medium", // low, medium, high
  ...props
}) => {
  // Adjust opacity based on intensity
  const getIntensityStyle = () => {
    switch (intensity) {
      case "low":
        return { opacity: 0.7 }
      case "high":
        return { opacity: 1 }
      case "medium":
      default:
        return { opacity: 0.85 }
    }
  }

  return (
    <div className={`holographic-bg ${className}`} style={getIntensityStyle()} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && withNeonText) {
          return React.cloneElement(child, {
            className: `${child.props.className || ""} neon-text`,
          })
        }
        return child
      })}
    </div>
  )
}

export default HolographicBackground
