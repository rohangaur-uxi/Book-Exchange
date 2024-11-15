import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Navigation = ({ currentPath, onNavigate }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('/auth');
  };

  return (
    <nav className="bg-blue-600 p-4 mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Book Exchange</h1>
        <div className="space-x-4">
          {user ? (
            <>
              <span className="text-white">Welcome, {user.name}</span>
              <button
                onClick={() => onNavigate('/books/add')}
                className={`text-white hover:text-blue-200 ${currentPath === '/books/add' ? 'font-bold' : ''}`}
              >
                Add Book
              </button>
              <button
                onClick={() => onNavigate('/books/search')}
                className={`text-white hover:text-blue-200 ${currentPath === '/books/search' ? 'font-bold' : ''}`}
              >
                Search Books
              </button>
              <button
                onClick={handleLogout}
                className="text-white hover:text-blue-200"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate('/auth')}
              className={`text-white hover:text-blue-200 ${currentPath === '/auth' ? 'font-bold' : ''}`}
            >
              Login/Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};