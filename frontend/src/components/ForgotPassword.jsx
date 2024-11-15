import React, { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { EmailInput } from './ui/EmailInput';

export const ForgotPassword = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'If an account exists with this email, you will receive password reset instructions.'
        });
        setTimeout(() => onNavigate('/auth'), 3000);
      } else {
        throw new Error(data.message || 'Failed to process request');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to send reset request. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      
      {message && (
        <Alert className={`mb-4 w-full max-w-md ${
          message.type === 'success' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <EmailInput
        value={email}
        onChange={setEmail}
        required
        />

        <button
          type="submit"
          className={`w-full p-2 text-white rounded transition-colors ${
            isLoading || !email
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={isLoading || !email}
        >
          {isLoading ? 'Processing...' : 'Send Reset Link'}
        </button>
      </form>

      <button
        onClick={() => onNavigate('/auth')}
        className="mt-4 text-blue-500 hover:text-blue-600"
      >
        Back to Login
      </button>

      <div className="mt-6 text-sm text-gray-600 max-w-md space-y-2">
        <p className="text-center">
          Enter your email address and we'll send you instructions 
          to reset your password.
        </p>
      </div>
    </div>
  );
};