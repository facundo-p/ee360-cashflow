function EyeIcon() {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M1 12C3.5 7 7.5 4 12 4s8.5 3 11 8c-2.5 5-6.5 8-11 8s-8.5-3-11-8z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  
  function EyeOffIcon() {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" />
        <path
          d="M1 12C3.5 7 7.5 4 12 4c2.1 0 4.1.6 5.9 1.7M23 12c-2.5 5-6.5 8-11 8-2.1 0-4.1-.6-5.9-1.7"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }

  export { EyeIcon, EyeOffIcon };