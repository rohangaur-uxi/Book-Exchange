const Book = require('../models/bookModel');

const createBook = async (req, res) => {
    try {
        const { title, author, genre, condition, availabilityStatus, description } = req.body;

        const book = await Book.create({
            title,
            author,
            genre,
            condition,
            availabilityStatus,
            description,
            owner: req.user._id
        });

        const populatedBook = await Book.findById(book._id).populate('owner', 'name email');

        res.status(201).json(populatedBook);
    } catch (error) {
        console.error('Create book error:', error);
        res.status(500).json({ message: 'Error creating book' });
    }
};

const getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('owner', 'name email');
        res.json(books);
    } catch (error) {
        console.error('Get books error:', error);
        res.status(500).json({ message: 'Error fetching books' });
    }
};

const getUserBooks = async (req, res) => {
    try {
        const books = await Book.find({ owner: req.params.userId })
            .populate('owner', 'name email')
            .sort('-createdAt');
        res.json(books);
    } catch (error) {
        console.error('Get user books error:', error);
        res.status(500).json({ message: 'Error fetching user books' });
    }
};

const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        
        if (book.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this book' });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('owner', 'name email');

        res.json(updatedBook);
    } catch (error) {
        console.error('Update book error:', error);
        res.status(500).json({ message: 'Error updating book' });
    }
};

const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        
        if (book.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this book' });
        }

        await book.deleteOne();

        res.json({ message: 'Book removed successfully' });
    } catch (error) {
        console.error('Delete book error:', error);
        res.status(500).json({ message: 'Error deleting book' });
    }
};

const searchBooks = async (req, res) => {
    try {
        const { title, author, genre, availabilityStatus, page = 1, limit = 9 } = req.query;
        
        const query = {};
        if (title) query.title = new RegExp(title, 'i');
        if (author) query.author = new RegExp(author, 'i');
        if (genre) query.genre = genre;
        if (availabilityStatus) query.availabilityStatus = availabilityStatus;

        const books = await Book.find(query)
            .populate('owner', 'name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort('-createdAt');

        const count = await Book.countDocuments(query);

        res.json({
            books,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalBooks: count
        });
    } catch (error) {
        console.error('Search books error:', error);
        res.status(500).json({ message: 'Error searching books' });
    }
};

module.exports = {
    createBook,
    getBooks,
    getUserBooks,
    updateBook,
    deleteBook,
    searchBooks
};