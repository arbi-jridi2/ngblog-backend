const mongoose = require('mongoose');
const Author = mongoose.model('Author', {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    about: { type: String },
    linkedin: { type: String },
    //articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }]
});

module.exports = Author;
