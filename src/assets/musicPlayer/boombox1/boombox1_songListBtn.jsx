import react from 'react';

const Boombox1SongListBtn = ({ width = "28", height = "28", color = "black", ...props }) => (
    <svg 
        width="28" 
        height="28" 
        viewBox="0 0 28 28" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        >
    <circle cx="14" cy="14" r="13.5" fill="white" stroke="black"/>
    <path d="M12.5 10.25H18.5" stroke="black" stroke-linecap="round"/>
    <path d="M12.5 14H18.5" stroke="black" stroke-linecap="round"/>
    <path d="M12.5 17.75H18.5" stroke="black" stroke-linecap="round"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 11C9.91421 11 10.25 10.6642 10.25 10.25C10.25 9.83579 9.91421 9.5 9.5 9.5C9.08579 9.5 8.75 9.83579 8.75 10.25C8.75 10.6642 9.08579 11 9.5 11Z" fill="black"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 14.75C9.91421 14.75 10.25 14.4142 10.25 14C10.25 13.5858 9.91421 13.25 9.5 13.25C9.08579 13.25 8.75 13.5858 8.75 14C8.75 14.4142 9.08579 14.75 9.5 14.75Z" fill="black"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 18.5C9.91421 18.5 10.25 18.1642 10.25 17.75C10.25 17.3358 9.91421 17 9.5 17C9.08579 17 8.75 17.3358 8.75 17.75C8.75 18.1642 9.08579 18.5 9.5 18.5Z" fill="black"/>
    </svg>
);

export default Boombox1SongListBtn;
