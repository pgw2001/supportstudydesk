import React from 'react';

const Boombox1Speaker = ({ width = "125", height = "125", color = "black", ...props }) => (
    <svg 
        width="125" 
        height="125" 
        viewBox="0 0 125 125" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        >
    <circle cx="62.5" cy="62.5" r="62" fill="white" stroke="black"/>
    <circle cx="62.5" cy="63" r="55.5" fill="white" stroke="black"/>
    <circle cx="62.5" cy="63" r="53.5" fill="white" stroke="black"/>
    <circle cx="72.5" cy="59" r="13.5" fill="white" stroke="black"/>
    <circle cx="72.5" cy="59" r="10.5" fill="white" stroke="black"/>
    </svg>
);

export default Boombox1Speaker;