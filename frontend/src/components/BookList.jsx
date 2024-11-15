import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BOOK_GENRES, BOOK_CONDITIONS, AVAILABILITY_STATUS } from '../constants/bookConstants';

export const BookList = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);

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
      setMessage({ type: 'error', text: 'Failed to fetch books' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (book) => {
    setEditingBook({ ...book });
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
        setBooks(books.map(book => 
          book._id === editingBook._id ? editingBook : book
        ));
        setMessage({ type: 'success', text: 'Book updated successfully' });
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
          setMessage({ type: 'success', text: 'Book deleted successfully' });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete book' });
      }
    }
  };

  if (isLoading) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Books</h2>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {books.map(book => (
          <div key={book._id} className="border rounded-lg p-4 shadow-sm">
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
    </div>
  );
};