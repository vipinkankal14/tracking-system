"use client"

import { useState, useRef, useEffect } from "react"
import '../styles/effects.css'

const FloatingCard = ({
  children,
  className = "",
  intensity = "medium", // low, medium, high
  interactive = true,
  ...props
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)

  // Adjust floating animation based on intensity
  const getIntensityStyle = () => {
    switch (intensity) {
      case "low":
        return {
          "--float-distance": "5px",
          "--float-duration": "8s",
        }
      case "high":
        return {
          "--float-distance": "20px",
          "--float-duration": "5s",
        }
      case "medium":
      default:
        return {
          "--float-distance": "15px",
          "--float-duration": "6s",
        }
    }
  }

  const handleMouseMove = (e) => {
    if (!interactive || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 25
    const rotateY = (centerX - x) / 25

    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    if (!interactive) return
    setRotation({ x: 0, y: 0 })
  }

  // Disable interactive effects on mobile
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches
    if (isMobile) {
      setRotation({ x: 0, y: 0 })
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className={`float-card ${className}`}
      style={{
        ...getIntensityStyle(),
        transform: interactive ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` : undefined,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  )
}

export default FloatingCard
