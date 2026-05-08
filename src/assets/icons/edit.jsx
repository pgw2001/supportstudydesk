import React from 'react';

const EditIcon = ({ width = "16", height = "16", ...props }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    {...props}
  >
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M9.99998 3.33333C10.7364 2.59695 11.9303 2.59695 12.6666 3.33333C13.403 4.06971 13.403 5.26362 12.6666 6L5.9191 12.7475C5.54403 13.1226 5.03532 13.3333 4.50489 13.3333L2.66665 13.3333L2.66665 11.4951C2.66665 10.9647 2.87736 10.456 3.25243 10.0809L9.99998 3.33333Z" 
      stroke="currentColor"
    />
    <path 
      d="M9.33331 4L12 6.66667" 
      stroke="currentColor"
    />
  </svg>
);

export default EditIcon;