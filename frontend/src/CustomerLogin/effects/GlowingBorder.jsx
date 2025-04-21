"use client"
import '../styles/effects.css'

const GlowingBorder = ({
  children,
  className = "",
  colors = "default", // default, blue, purple, custom
  customColors = [],
  intensity = "medium", // low, medium, high
  ...props
}) => {
  // Get colors based on prop
  const getColorStyle = () => {
    if (colors === "custom" && customColors.length >= 2) {
      return {
        "--glow-primary": customColors[0],
        "--glow-secondary": customColors[1],
        "--glow-accent": customColors[2] || customColors[0],
      }
    }

    switch (colors) {
      case "blue":
        return {
          "--glow-primary": "#3b82f6",
          "--glow-secondary": "#06b6d4",
          "--glow-accent": "#2563eb",
        }
      case "purple":
        return {
          "--glow-primary": "#8b5cf6",
          "--glow-secondary": "#d946ef",
          "--glow-accent": "#a855f7",
        }
      case "default":
      default:
        return {
          "--glow-primary": "#4f46e5",
          "--glow-secondary": "#06b6d4",
          "--glow-accent": "#8b5cf6",
        }
    }
  }

  // Adjust glow intensity
  const getIntensityStyle = () => {
    switch (intensity) {
      case "low":
        return { filter: "brightness(0.8) blur(0.5px)" }
      case "high":
        return { filter: "brightness(1.2) blur(0px)" }
      case "medium":
      default:
        return { filter: "brightness(1) blur(0px)" }
    }
  }

  return (
    <div className={`glow-border ${className}`} style={{ ...getColorStyle(), ...getIntensityStyle() }} {...props}>
      {children}
    </div>
  )
}

export default GlowingBorder
