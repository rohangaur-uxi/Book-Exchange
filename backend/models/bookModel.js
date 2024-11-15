const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    author: {
        type: String,
        required: [true, 'Please add an author']
    },
    genre: {
        type: String,
        required: [true, 'Please add a genre']
    },
    condition: {
        type: String,
        required: [true, 'Please add condition'],
        enum: ['New', 'Like New', 'Very Good', 'Good', 'Fair', 'Poor']
    },
    availabilityStatus: {
        type: String,
        enum: ['Available', 'Currently Lent', 'Reserved', 'Not Available'],
        default: 'Available'
    },
    description: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);