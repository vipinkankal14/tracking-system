"use client"

import React from "react"
import "../effects/styles.css"

const HolographicBackground = ({
  children,
  className = "",
  withNeonText = false,
  intensity = "medium", // low, medium, high
  style = {},
  colors = "default", // default, blue, purple, custom
  customColors = [],
  ...props
}) => {
  // Get colors based on prop
  const getColorStyle = () => {
    if (colors === "custom" && customColors.length >= 4) {
      return {
        "--holo-color-1": customColors[0],
        "--holo-color-2": customColors[1],
        "--holo-color-3": customColors[2],
        "--holo-color-4": customColors[3],
      }
    }

    switch (colors) {
      case "blue":
        return {
          "--holo-color-1": "#1e3a8a",
          "--holo-color-2": "#3b82f6",
          "--holo-color-3": "#0ea5e9",
          "--holo-color-4": "#0284c7",
        }
      case "purple":
        return {
          "--holo-color-1": "#4c1d95",
          "--holo-color-2": "#8b5cf6",
          "--holo-color-3": "#d946ef",
          "--holo-color-4": "#c026d3",
        }
      case "default":
      default:
        return {
          "--holo-color-1": "#2a2a72",
          "--holo-color-2": "#009ffd",
          "--holo-color-3": "#7303c0",
          "--holo-color-4": "#ec38bc",
        }
    }
  }

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
    <div 
      className={`holographic-bg ${className}`} 
      style={{ ...getColorStyle(), ...getIntensityStyle(), ...style }} 
      {...props}
    >
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
