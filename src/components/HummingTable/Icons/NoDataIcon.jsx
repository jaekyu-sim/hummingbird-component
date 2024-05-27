const NoDataIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="64"
      height="64"
      fill="gray"
    >
      <g>

        <circle cx="50" cy="30" r="28" stroke="gray" strokeWidth="4" fill="none" />

        <circle cx="40" cy="26" r="2" fill="gray" />
        <circle cx="60" cy="26" r="2" fill="gray" />

        <path d="M38 38 Q50 48 62 38" stroke="gray" strokeWidth="3" fill="none" />

        <path d="M40 30 Q38 34 40 38" fill="blue" />

        <line x1="30" y1="65" x2="70" y2="65" stroke="gray" strokeWidth="3" />
        <line x1="50" y1="55" x2="50" y2="75" stroke="gray" strokeWidth="3" />

        <text x="50" y="90" textAnchor="middle" fill="gray" fontSize="10">Nothing To Show</text>
      </g>
    </svg>
  );
  
  export default NoDataIcon;