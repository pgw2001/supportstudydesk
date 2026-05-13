import React from 'react';

const Boombox1Body = ({ width = "400", height = "251", color = "black", ...props }) => (   
    <svg 
        width={width}
        height={height}
        viewBox="0 0 400 251" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        {...props}
        >
    <rect x="35.5" y="7.5" width="13" height="48" fill="white" stroke={color}/>
    <rect x="352.5" y="7.5" width="13" height="48" fill="white" stroke={color}/>
    <path d="M35 2C35 0.89543 35.8954 0 37 0H364C365.105 0 366 0.895431 366 2V13H35V2Z" fill={color}/>
    <rect x="0.5" y="51.5" width="399" height="199" rx="1.5" fill="white" stroke={color}/>
    <rect x="0.5" y="93.5" width="139" height="157" rx="1.5" fill="white" stroke={color}/>
    <rect x="260.5" y="93.5" width="139" height="157" rx="1.5" fill="white" stroke={color}/>
    <rect x="143.5" y="177.5" width="112" height="68" rx="1.5" fill="white" stroke={color}/>
    <rect x="140.5" y="93.5" width="119" height="79" rx="1.5" fill="white" stroke={color}/>
    <rect x="145.5" y="97.5" width="110" height="71" rx="1.5" fill="white" stroke={color}/>
    <rect x="156.5" y="108.5" width="87" height="43" fill="white" stroke={color}/>
    <rect x="166.5" y="119.5" width="67" height="20" rx="10" fill="white" stroke={color}/>
    <circle cx="177" cy="129.5" r="8" fill="white" stroke={color}/>
    <rect x="188" y="122.5" width="24" height="14" fill="white" stroke={color}/>
    <circle cx="223" cy="129.5" r="8" fill="white" stroke={color}/>
    <circle cx="368" cy="60" r="1" fill={color}/>
    <circle cx="371.2" cy="57.2" r="1.2" fill={color}/>
    <circle cx="375.4" cy="55.4" r="1.4" fill={color}/>
    <circle cx="380.5" cy="55.5" r="1.5" fill={color}/>
    <circle cx="385.65" cy="57.65" r="1.65" fill={color}/>
    </svg>
);

export default Boombox1Body;