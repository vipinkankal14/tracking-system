"use client"

import { useEffect } from "react"
import "./styles/effects.css"

export default function ClientLayout({ children }) {
  // Add a class to the body for global styling
  useEffect(() => {
    document.body.classList.add('effect-enabled');
    
    return () => {
      document.body.classList.remove('effect-enabled');
    };
  }, []);

  return (
      <body>
        {children}
      </body>
  );
}
