import React from 'react';

const NoDataIcon = () => {

  return(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="104"
      height="74"
      fill="gray"
    >
      <g>

        <circle cx="50" cy="30" r="28" stroke="gray" strokeWidth="4" fill="none" />

        <circle cx="40" cy="26" r="2" fill="gray" />
        <circle cx="60" cy="26" r="2" fill="gray" />

        <path d="M38 38 Q50 48 62 38" stroke="gray" strokeWidth="3" fill="none" />

        

        <line x1="41" y1="64" x2="57" y2="80" stroke="gray" strokeWidth="3" />
        <line x1="41" y1="80" x2="57" y2="64" stroke="gray" strokeWidth="3" />

        <text x="50" y="95" textAnchor="middle" fill="gray" fontSize="15">Nothing To Show</text>
      </g>
    </svg>
    )
  
}

export default NoDataIcon;