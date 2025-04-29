const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Author = require('../models/author');
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

exports.register = async (req, res) => {
  console.log('Request received at /register');
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);
  console.log(filename);
  try {
    let data = req.body;
    if (!data) {
      throw new Error('Invalid request data');
    }
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      console.log('Cloudinary result:', result);
      filename = result.secure_url;
    }
    let author = new Author(data);
    author.image = filename;
    let salt = bcrypt.genSaltSync(10);
    author.password = bcrypt.hashSync(data.password, salt);
    await author.save();
    filename = '';
    res.status(200).send(author);
  } catch (err) {
    console.error('Request processing error:', err);
    res.status(400).send({ error: 'Bad Request', details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    let data = req.body;
    const author = await Author.findOne({ email: data.email });
    if (!author) {
      return res.status(401).send('Email or password invalid!');
    }
    const valid = bcrypt.compareSync(data.password, author.password);
    if (!valid) {
      return res.status(401).send('Email or password invalid!');
    }
    let payload = {
      _id: author._id,
      email: author.email,
      fullName: author.name + ' ' + author.lastName
    }
    let key = process.env.JWT_SECRET;
    let token = jwt.sign(payload, key,{ expiresIn: '1h' });
    res.send({ mytoken: token });
  } catch (err) {
    console.error('Unable to login', err);
    res.status(400).send({ error: 'Error while login', details: err });
  }
};

exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find({});
    res.status(200).send(authors);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getAuthorById = async (req, res) => {
  try {
    const author = await Author.findOne({ _id: req.params.id });
    res.status(200).send(author);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete({ _id: req.params.id });
    res.status(200).send(author);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.updateAuthor = async (req, res) => {
  try {
    let id = req.params.id;
    let data = req.body;
    if (filename.length > 0) {
      data.image = filename;
    }
    const author = await Author.findByIdAndUpdate({ _id: id }, data);
    filename = '';
    res.status(200).send(author);
  } catch (err) {
    res.status(400).send(err);
  }
};