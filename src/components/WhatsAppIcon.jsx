import React from 'react';

/**
 * WhatsAppIcon Component
 * - variant="branded" (default): Authentic green (#25D366) speech bubble with white phone handset
 * - variant="monochrome": Single path using `currentColor`, perfect for social link circles
 */
export default function WhatsAppIcon({
  variant = 'branded',
  className = 'w-5 h-5',
  ...props
}) {
  if (variant === 'monochrome') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        {...props}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zM8.36 5.4c.17 0 .37 0 .57.01.18.01.43.07.67.51.24.59.84 2.05.91 2.2.08.15.13.32.03.52-.1.2-.15.32-.3.5-.15.17-.32.38-.45.52-.15.14-.3.3-.13.6.17.3.77 1.27 1.65 2.06 1.13 1.02 2.09 1.33 2.39 1.48.29.14.47.12.64-.08.17-.19.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.97.3.15.5.23.57.35.08.13.08.72-.17 1.42-.25.69-1.44 1.33-2.01 1.41-.51.08-1.16.11-1.87-.12-.43-.13-.98-.32-1.69-.62-2.98-1.29-4.93-4.29-5.08-4.49-.14-.2-1.21-1.62-1.21-3.08 0-1.46.77-2.18 1.04-2.48.27-.3.59-.37.79-.37z"
        />
      </svg>
    );
  }

  // Branded full-color WhatsApp logo (Authentic green speech bubble with crisp white phone handset)
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* Green WhatsApp Speech Bubble */}
      <path
        fill="#25D366"
        d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"
      />
      {/* Crisp White Handset */}
      <path
        fill="#FFFFFF"
        d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z"
      />
    </svg>
  );
}
