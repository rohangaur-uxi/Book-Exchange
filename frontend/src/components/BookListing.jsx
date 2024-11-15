import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '../context/AuthContext';
import { BOOK_GENRES, BOOK_CONDITIONS, AVAILABILITY_STATUS } from '../constants/bookConstants';

export const BookListing = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    condition: '',
    availabilityStatus: 'Available',
    description: ''
  });
  const [editingBook, setEditingBook] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUserBooks();
  }, [user]);

  const fetchUserBooks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/user/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch your books' });
    }
  };

  const handleNewBookChange = (e) => {
    const { name, value } = e.target;
    setNewBook(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(newBook)
      });

      if (response.ok) {
        const book = await response.json();
        setBooks([...books, book]);
        setNewBook({
          title: '',
          author: '',
          genre: '',
          condition: '',
          availabilityStatus: 'Available',
          description: ''
        });
        setMessage({ type: 'success', text: 'Book added successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add book' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${editingBook._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(editingBook)
      });

      if (response.ok) {
        const updatedBook = await response.json();
        setBooks(books.map(book => 
          book._id === updatedBook._id ? updatedBook : book
        ));
        setMessage({ type: 'success', text: 'Book updated successfully!' });
        setEditingBook(null);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update book' });
    }
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (response.ok) {
          setBooks(books.filter(book => book._id !== bookId));
          setMessage({ type: 'success', text: 'Book deleted successfully!' });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete book' });
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Add New Book Form */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
        {message && (
          <Alert className={`mb-4 ${
            message.type === 'success' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newBook.title}
              onChange={handleNewBookChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter book title"
              required
            />
          </div>

          {/* Author Input */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={newBook.author}
              onChange={handleNewBookChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter author name"
              required
            />
          </div>

          {/* Genre Dropdown */}
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
              Genre<span className="text-red-500">*</span>
            </label>
            <select
              id="genre"
              name="genre"
              value={newBook.genre}
              onChange={handleNewBookChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a genre</option>
              {BOOK_GENRES.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Condition Dropdown */}
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
              Condition<span className="text-red-500">*</span>
            </label>
            <select
              id="condition"
              name="condition"
              value={newBook.condition}
              onChange={handleNewBookChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select condition</option>
              {BOOK_CONDITIONS.map(condition => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
          </div>

          {/* Availability Status Dropdown */}
          <div>
            <label htmlFor="availabilityStatus" className="block text-sm font-medium text-gray-700 mb-1">
              Availability Status
            </label>
            <select
              id="availabilityStatus"
              name="availabilityStatus"
              value={newBook.availabilityStatus}
              onChange={handleNewBookChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            >
              {AVAILABILITY_STATUS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Description Textarea */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={newBook.description}
              onChange={handleNewBookChange}
              rows="3"
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a brief description of the book (optional)"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 text-white rounded-md transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Adding Book...' : 'Add Book'}
          </button>
        </form>
      </div>

      {/* Your Books List */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Your Books</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <div key={book._id} className="bg-white border rounded-lg p-4 shadow-sm">
              {editingBook && editingBook._id === book._id ? (
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editingBook.title}
                    onChange={(e) => setEditingBook({
                      ...editingBook,
                      title: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={editingBook.author}
                    onChange={(e) => setEditingBook({
                      ...editingBook,
                      author: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    placeholder="Author"
                  />
                  <select
                    value={editingBook.genre}
                    onChange={(e) => setEditingBook({
                      ...editingBook,
                      genre: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                  >
                    {BOOK_GENRES.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                  <select
                    value={editingBook.condition}
                    onChange={(e) => setEditingBook({
                      ...editingBook,
                      condition: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                  >
                    {BOOK_CONDITIONS.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                  <select
                    value={editingBook.availabilityStatus}
                    onChange={(e) => setEditingBook({
                      ...editingBook,
                      availabilityStatus: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                  >
                    {AVAILABILITY_STATUS.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <textarea
                    value={editingBook.description || ''}
                    onChange={(e) => setEditingBook({
                      ...editingBook,
                      description: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    placeholder="Description (optional)"
                    rows="3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdate}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingBook(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-lg">{book.title}</h3>
                  <p className="text-gray-600">by {book.author}</p>
                  <div className="mt-2">
                    <p>Genre: {book.genre}</p>
                    <p>Condition: {book.condition}</p>
                    <p>Status: {book.availabilityStatus}</p>
                    {book.description && (
                      <p className="mt-2 text-sm text-gray-600">{book.description}</p>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        {books.length === 0 && (
          <p className="text-center text-gray-500 mt-4">You haven't added any books yet.</p>
        )}
      </div>
    </div>
  );
};