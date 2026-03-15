import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo = ({ className = "", size = 24 }: LogoProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <path
      d="M5 6h14M5 12h14M5 18h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default Logo;
