import React, { useState, useEffect, useCallback } from 'react';

export const EmailInput = ({ 
  value, 
  onChange, 
  label = "Email Address",
  required = true,
  disabled = false,
  className = ""
}) => {
  const [emailError, setEmailError] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  
  const validateEmail = useCallback((email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const allowedDomains = [
      'gmail.com',
      'msn.com',
      'wilp.bits-pilani.ac.in'
    ];
    
    if (!email) {
      setEmailError('');
      return false;
    }
    
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email id');
      return false;
    }
    
    const [, domain] = email.split('@');
    if (!allowedDomains.includes(domain.toLowerCase())) {
      setEmailError('Invalid email id');
      return false;
    }

    setEmailError('');
    return true;
  }, []);

  useEffect(() => {
    if (value) {
      setIsValidEmail(validateEmail(value));
    } else {
      setEmailError('');
      setIsValidEmail(false);
    }
  }, [value, validateEmail]);

  return (
    <div className={className}>
      <label 
        htmlFor="email" 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type="email"
          id="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-2 border rounded focus:outline-none focus:ring-2 
            ${disabled ? 'bg-gray-100' : ''}
            ${emailError 
              ? 'border-red-500 focus:ring-red-200' 
              : isValidEmail 
                ? 'border-green-500 focus:ring-green-200' 
                : 'border-gray-300 focus:ring-blue-200'
            }
          `}
          placeholder="Enter your email address"
          required={required}
          disabled={disabled}
        />
        {value && !disabled && (
          <span className="absolute right-3 top-2.5">
            {isValidEmail ? (
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </span>
        )}
      </div>
      {emailError && value && (
        <p className="mt-1 text-sm text-red-600">
          {emailError}
        </p>
      )}
    </div>
  );
};