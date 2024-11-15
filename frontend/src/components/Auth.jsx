import React, { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { EmailInput } from './ui/EmailInput';
import { useAuth } from '../context/AuthContext';

export const Auth = ({ onNavigate }) => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Email and password are required' });
      return false;
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return false;
    }

    if (!isLogin) {
      if (!formData.name) {
        setMessage({ type: 'error', text: 'Name is required' });
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Passwords do not match' });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage(null);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const submitData = isLogin 
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(submitData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        login(data);
        setMessage({ 
          type: 'success', 
          text: `Successfully ${isLogin ? 'logged in' : 'registered'}!` 
        });
        setTimeout(() => onNavigate('/books/add'), 1500);
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'An error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-2xl font-bold mb-4">
        {isLogin ? 'Login to Your Account' : 'Create New Account'}
      </h2>
      
      {message && (
        <Alert className={`mb-4 w-full max-w-md ${
          message.type === 'success' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>
        )}

        <EmailInput
          value={formData.email}
          onChange={(email) => setFormData({ ...formData, email })}
          required
        />

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={`w-full p-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500
              ${formData.password && formData.password.length < 6 ? 'border-red-500' : ''}`}
            placeholder="Enter your password"
            minLength="6"
            required
          />
          {formData.password && formData.password.length < 6 && (
            <p className="mt-1 text-sm text-red-600">
              Password must be at least 6 characters long
            </p>
          )}
        </div>

        {!isLogin && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={`w-full p-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500
                ${formData.confirmPassword && formData.password !== formData.confirmPassword 
                  ? 'border-red-500' 
                  : ''}`}
              placeholder="Confirm your password"
              minLength="6"
              required
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                Passwords do not match
              </p>
            )}
          </div>
        )}

        <button 
          type="submit" 
          className={`w-full p-2 text-white rounded transition-colors ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={isLoading}
        >
          {isLoading
            ? 'Processing...'
            : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>

      {isLogin && (
        <button
          onClick={() => onNavigate('/forgot-password')}
          className="mt-4 text-sm text-blue-500 hover:text-blue-600"
        >
          Forgot Password?
        </button>
      )}

      <button
        onClick={() => {
          setIsLogin(!isLogin);
          setMessage(null);
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
          });
        }}
        className="mt-4 text-blue-500 hover:text-blue-600"
      >
        {isLogin 
          ? "Don't have an account? Register" 
          : 'Already have an account? Login'}
      </button>
    </div>
  );
};