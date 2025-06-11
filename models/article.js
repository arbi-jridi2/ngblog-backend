const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    reader: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
  });

const Article = mongoose.model('Article',{
    title: { type :String },
    idAuthor: { type :String },
    description: { type :String },
    date: { type :String },
    content: { type :String },
    image: { type :String },
    tags:{ type :Array },
    likes: { type: Number, default: 0 },
    comments: [commentSchema]
});

module.exports = Article;