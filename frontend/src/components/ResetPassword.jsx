import React, { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';

export const ResetPassword = ({ onNavigate, token }) => {
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.password !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (passwords.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`http://localhost:5000/api/auth/resetpassword/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: passwords.password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password reset successful!' });
        setTimeout(() => onNavigate('/auth'), 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to reset password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>
      
      {message && (
        <Alert className={`mb-4 w-full max-w-md ${
          message.type === 'success' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={passwords.password}
            onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
            className="w-full p-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter new password"
            minLength="6"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            className="w-full p-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="Confirm new password"
            minLength="6"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full p-2 text-white rounded transition-colors ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <button
        onClick={() => onNavigate('/auth')}
        className="mt-4 text-blue-500 hover:text-blue-600"
      >
        Back to Login
      </button>
    </div>
  );
};