"use client"
import "../effects/styles.css"

const GlassMorphism = ({
  children,
  className = "",
  withGlow = false,
  intensity = "medium", // low, medium, high
  onClick,
  style = {},
  ...props
}) => {
  // Adjust blur intensity based on prop
  const getIntensityClass = () => {
    switch (intensity) {
      case "low":
        return "backdrop-blur-sm bg-white/10 border-white/10"
      case "high":
        return "backdrop-blur-xl bg-white/20 border-white/30"
      case "medium":
      default:
        return "backdrop-blur-md bg-white/15 border-white/20"
    }
  }

  const baseClass = `glass-effect ${getIntensityClass()} ${withGlow ? "glow-border" : ""} ${className}`

  return (
    <div className={baseClass} onClick={onClick} style={style} {...props}>
      {children}
    </div>
  )
}

export default GlassMorphism
