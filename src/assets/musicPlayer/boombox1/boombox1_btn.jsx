import React from "react";

export const Boombox1PlayBtn = ({ width = "31", height = "20", color = "black", ...props }) => (
    <svg width={width} height={height} viewBox="0 0 31 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="0.5" y="0.5" width="30" height="19" rx="1.5" fill="white" stroke={color}/>
        <path fillRule="evenodd" clipRule="evenodd" d="M19.9041 8.64251C20.5514 9.03091 20.5514 9.96909 19.9041 10.3575L12.8477 14.5913C12.1812 14.9912 11.3333 14.5111 11.3333 13.7338L11.3333 5.26619C11.3333 4.4889 12.1812 4.00878 12.8477 4.4087L19.9041 8.64251Z" stroke={color} strokeLinejoin="round"/>
    </svg>
);

export const Boombox1PauseBtn = ({ width = "31", height = "20", color = "black", ...props }) => (
    <svg width={width} height={height} viewBox="0 0 31 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="0.5" y="0.5" width="30" height="19" rx="1.5" fill="white" stroke={color}/>
        <path fillRule="evenodd" clipRule="evenodd" d="M11.3333 4.16669L11.3333 14.8334H13.9999V4.16669H11.3333Z" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M18 4.16669V14.8334H20.6667V4.16669H18Z" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const Boombox1PrevBtn = ({ width = "31", height = "20", color = "black", ...props }) => (
    <svg width={width} height={height} viewBox="0 0 31 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="0.5" y="0.5" width="30" height="19" rx="1.5" fill="white" stroke={color}/>
        <path fillRule="evenodd" clipRule="evenodd" d="M11.9792 8.61071C11.2556 8.98282 11.2556 10.0172 11.9792 10.3893L18.6364 13.813C19.3019 14.1553 20.0938 13.6721 20.0938 12.9237V6.07628C20.0937 5.32793 19.3019 4.84473 18.6364 5.18699L11.9792 8.61071Z" stroke={color} strokeLinejoin="round"/>
        <path d="M10.25 14V5" stroke={color} strokeLinecap="round"/>
    </svg>
);

export const Boombox1NextBtn = ({ width = "31", height = "20", color = "black", ...props }) => (
    <svg width={width} height={height} viewBox="0 0 31 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="0.5" y="0.5" width="30" height="19" rx="1.5" fill="white" stroke={color}/>
        {/* 이전 곡 버튼을 좌우 반전시키기 위해 transform 속성 추가 */}
        <g transform="translate(31, 0) scale(-1, 1)">
            <path fillRule="evenodd" clipRule="evenodd" d="M11.9792 8.61071C11.2556 8.98282 11.2556 10.0172 11.9792 10.3893L18.6364 13.813C19.3019 14.1553 20.0938 13.6721 20.0938 12.9237V6.07628C20.0937 5.32793 19.3019 4.84473 18.6364 5.18699L11.9792 8.61071Z" stroke={color} strokeLinejoin="round"/>
            <path d="M10.25 14V5" stroke={color} strokeLinecap="round"/>
        </g>
    </svg>
);

export const Boombox1beforeShuffleBtn = ({ width = "31", height = "20", color = "black", ...props }) => (
    <svg width="31" height="20" viewBox="0 0 31 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
<rect x="0.5" y="0.5" width="30" height="19" rx="1.5" fill="white" stroke="black"/>
<path d="M21 11.6933H18.8472C17.5443 11.6933 16.323 10.9798 15.5741 9.78109L14.1982 7.57889C13.4492 6.38017 12.228 5.66669 10.9251 5.66669L9 5.66669" stroke="black" stroke-linecap="round"/>
<path d="M21 5.66665H18.8472C17.5443 5.66665 16.323 6.4559 15.5741 7.78194L14.1982 10.218C13.4492 11.5441 12.228 12.3333 10.9251 12.3333L9 12.3333" stroke="black" stroke-linecap="round"/>
<path d="M19.6667 3.66669L21.6667 5.66669L19.6667 7.66669" stroke="black" stroke-linecap="round"/>
<path d="M19.6667 9.66669L21.6667 11.6667L19.6667 13.6667" stroke="black" stroke-linecap="round"/>
</svg>

);

export const Boombox1afterShuffleBtn = ({ width = "31", height = "20", color = "black", ...props }) => (
    <svg width="31" height="20" viewBox="0 0 31 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="0.5" y="0.5" width="30" height="19" rx="1.5" fill="white" stroke="black"/>
    <path d="M21 11.6933H18.8472C17.5443 11.6933 16.323 10.9798 15.5741 9.78109L14.1982 7.57889C13.4492 6.38017 12.228 5.66669 10.9251 5.66669L9 5.66669" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M21 5.66665H18.8472C17.5443 5.66665 16.323 6.4559 15.5741 7.78194L14.1982 10.218C13.4492 11.5441 12.228 12.3333 10.9251 12.3333L9 12.3333" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M19.6667 3.66669L21.6667 5.66669L19.6667 7.66669" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M19.6667 9.66669L21.6667 11.6667L19.6667 13.6667" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
);

export const Boombox1beforeRepeatBtn = ({ width = "31", height = "20", color = "black", ...props }) => (
    <svg width="31" height="20" viewBox="0 0 31 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="0.5" y="0.5" width="30" height="19" rx="1.5" fill="white" stroke="black"/>
    <path d="M9.25 10.65V9.375C9.25 7.30393 10.9289 5.625 13 5.625H21.125V5.625" stroke="black" stroke-linecap="round"/>
    <path d="M19.875 3.75L21.75 5.625L19.875 7.5" stroke="black" stroke-linecap="round"/>
    <path d="M21.75 8.73755V10.0125C21.75 12.0836 20.0711 13.7625 18 13.7625H9.875V13.7625" stroke="black" stroke-linecap="round"/>
    <path d="M11.125 15.625L9.25 13.75L11.125 11.875" stroke="black" stroke-linecap="round"/>
    </svg>
);

export const Boombox1afterRepeatBtn = ({ width = "31", height = "20", color = "black", ...props }) => (
    <svg width="31" height="20" viewBox="0 0 31 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="0.5" y="0.5" width="30" height="19" rx="1.5" fill="white" stroke="black"/>
    <path d="M9.25 10.65V9.375C9.25 7.30393 10.9289 5.625 13 5.625H21.125V5.625" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M19.875 3.75L21.75 5.625L19.875 7.5" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M21.75 8.73755V10.0125C21.75 12.0836 20.0711 13.7625 18 13.7625H9.875V13.7625" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M11.125 15.625L9.25 13.75L11.125 11.875" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M16.0811 7.96484V11.5H15.4414V8.58496H15.4219L14.5967 9.1123V8.53125L15.4707 7.96484H16.0811Z" fill="black"/>
    </svg>
);


