import React from "react";

export function Avatar({ children, className }) {
  return <div className={`avatar ${className}`}>{children}</div>;
}

export function AvatarFallback({ children }) {
  return <div className="avatar-fallback">{children}</div>;
}
