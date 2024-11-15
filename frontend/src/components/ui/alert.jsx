import React from 'react';

export const Alert = ({ children, className = '' }) => {
  return (
    <div role="alert" className={`rounded-lg border p-4 ${className}`}>
      {children}
    </div>
  );
};

export const AlertDescription = ({ children }) => {
  return <div className="text-sm">{children}</div>;
};