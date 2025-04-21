"use client"

import React, { useRef } from "react"
import '../styles/effects.css'

const ParticleBackground = ({ 
  children, 
  className = "", 
  particleColor = "#ffffff",
  particleCount = 50,
  particleSpeed = 1,
  particleSize = 2,
  ...props 
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
 
  return (
    <div ref={containerRef} className={`particle-container ${className}`} {...props}>
      <canvas ref={canvasRef} className="particle-overlay" />
      <div className="content-layer">
        {children}
      </div>
    </div>
  );
};

export default ParticleBackground;
