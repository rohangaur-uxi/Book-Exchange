import React, { useState } from 'react';
import { BOOK_GENRES, AVAILABILITY_STATUS } from '../constants/bookConstants';

export const BookSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    genre: '',
    availabilityStatus: ''
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 12;

  const searchBooks = async (newSearch = false) => {
    if (newSearch) {
      setPage(1);
      setSearchResults([]);
    }

    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page: newSearch ? 1 : page,
        limit: ITEMS_PER_PAGE
      });

      const response = await fetch(`http://localhost:5000/api/books/search?${queryParams}`);
      const data = await response.json();
      
      if (newSearch) {
        setSearchResults(data.books);
      } else {
        setSearchResults(prev => [...prev, ...data.books]);
      }
      setHasMore(data.books.length === ITEMS_PER_PAGE);
    } catch (error) {
      setMessage('Error searching books');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks(true);
  };

  const BookDetailsModal = ({ book, onClose }) => {
    if (!book) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{book.title}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Book Details */}
            <div className="space-y-4">
              {/* Author */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Author</h3>
                <p className="text-gray-600">{book.author}</p>
              </div>

              {/* Genre */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Genre</h3>
                <p className="text-gray-600">{book.genre}</p>
              </div>

              {/* Condition */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Condition</h3>
                <p className="text-gray-600">{book.condition}</p>
              </div>

              {/* Availability Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Availability Status</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                  book.availabilityStatus === 'Available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {book.availabilityStatus}
                </span>
              </div>

              {/* Owner Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Owner</h3>
                <p className="text-gray-600">{book.owner?.name}</p>
                <p className="text-gray-500 text-sm">{book.owner?.email}</p>
              </div>

              {/* Description */}
              {book.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Description</h3>
                  <p className="text-gray-600">{book.description}</p>
                </div>
              )}

              {/* Added Date */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Added</h3>
                <p className="text-gray-500 text-sm">
                  {new Date(book.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6">
              <button
                onClick={onClose}
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Search Books</h2>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              name="title"
              value={filters.title}
              onChange={handleFilterChange}
              placeholder="Book Title"
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <input
              type="text"
              name="author"
              value={filters.author}
              onChange={handleFilterChange}
              placeholder="Author"
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              name="genre"
              value={filters.genre}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Genres</option>
              {BOOK_GENRES.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              name="availabilityStatus"
              value={filters.availabilityStatus}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              {AVAILABILITY_STATUS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search Books'}
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {message && (
        <div className="text-red-600 mb-4">{message}</div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {searchResults.map((book) => (
          <div 
            key={book._id} 
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedBook(book)}
          >
            <h3 className="font-semibold text-lg text-gray-800">{book.title}</h3>
            <p className="text-gray-600">by {book.author}</p>
            <p className="text-gray-500 mt-2">
              Owner: {book.owner?.name || 'Unknown'}
            </p>
            <p className="text-sm text-blue-500 mt-1">
              Status: {book.availabilityStatus}
            </p>
          </div>
        ))}
      </div>

      {/* Book Details Modal */}
      {selectedBook && (
        <BookDetailsModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
        />
      )}

      {/* Loading More */}
      {loading && (
        <div className="text-center mt-6">
          <div className="inline-block p-2 text-blue-600">Loading...</div>
        </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && searchResults.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setPage(prev => prev + 1);
              searchBooks(false);
            }}
            className="px-6 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {/* No Results Message */}
      {!loading && searchResults.length === 0 && (
        <div className="text-center text-gray-500 mt-6">
          No books found. Try different search criteria.
        </div>
      )}
    </div>
  );
};