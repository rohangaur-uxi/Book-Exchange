const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createBook,
    updateBook,
    deleteBook,
    getBooks,
    getUserBooks,
    searchBooks
} = require('../controllers/bookController');

router.get('/', getBooks);
router.get('/search', searchBooks);

router.post('/', protect, createBook);
router.get('/user/:userId', protect, getUserBooks);

router.route('/:id')
    .put(protect, updateBook)
    .delete(protect, deleteBook);

module.exports = router;