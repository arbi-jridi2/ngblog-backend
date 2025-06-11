const Article = require('../models/article');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

let filename = '';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ngblog',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });
exports.upload = upload;

exports.createArticle = async (req, res) => {
  console.log('Request received at /create');
  console.log('Request body:', req.body);
  console.log('Uploaded files:', req.files);

  try {
    let data = req.body;
    if (!data || !data.tags) {
      throw new Error('Invalid request data');
    }
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      console.log('Cloudinary result:', result);
      filename = result.secure_url;
    }
    let article = new Article(data);
    article.date = new Date();
    article.image = filename;
    article.tags = data.tags.split(',');
    await article.save();
    filename = '';
    res.status(200).send(article);
  } catch (err) {
    console.error('Request processing error:', err);
    res.status(400).send({ error: 'Bad Request', details: err.message });
  }
};

exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find({});
    res.status(200).send(articles);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findOne({ _id: req.params.id });
    res.status(200).send(article);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getArticlesByAuthor = async (req, res) => {
  try {
    const articles = await Article.find({ idAuthor: req.params.id });
    res.status(200).send(articles);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete({ _id: req.params.id });
    res.status(200).send(article);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.updateArticle = async (req, res) => {
  try {
    let id = req.params.id;
    let data = req.body;
    data.tags = data.tags.split(',');
    if (filename.length > 0) {
      data.image = filename;
    }
    const article = await Article.findByIdAndUpdate({ _id: id }, data);
    filename = '';
    res.status(200).send(article);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.likeArticle = async (req, res) => {
   try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.commentArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: req.body } },
      { new: true }
    );
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchArticles = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) {
      return res.status(400).json({ message: 'No search query provided' });
    }
    const articles = await Article.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ]
    });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.tagArticles = async (req, res) => {
  try {
    const articles = await Article.find({ tags: req.params.tag }).sort({ date: -1 });
    const authorIds = [...new Set(articles.map(a => a.idAuthor))];
    
    // Fetch authors 
    const authors = await Author.find({ 
      _id: { $in: authorIds }
    }, '_id name lastName image');
    
    // Map authors to articles
    const articlesWithAuthors = articles.map(article => ({
      ...article.toObject(),
      idAuthor: authors.find(a => a._id.toString() === article.idAuthor)
    }));
    
    res.json(articlesWithAuthors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}