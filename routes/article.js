const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const multer = require('multer');
let filename = '';

const mystorage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, redirect) => {
    let date = Date.now();
    let fl = date + '.' + file.mimetype.split('/')[1];
    redirect(null, fl);
    filename = fl;
  }
});

const upload = multer({ storage: mystorage });

router.post('/ajout', upload.any('image'), (req, res) => {
  console.log('Request received at /ajout');
  console.log('Request body:', req.body);
  console.log('Uploaded files:', req.files);

  try {
    let data = req.body;

    // Validate data
    if (!data || !data.tags) {
      throw new Error('Invalid request data');
    }

    let article = new Article(data);
    article.date = new Date();
    article.image = filename;
    article.tags = data.tags.split(',');

    article.save().then(
      (saved) => {
        filename = '';
        res.status(200).send(saved);
      }
    )
    .catch((err) => {
      console.error('Error saving article:', err);
      res.status(400).send({ error: 'Error saving article', details: err });
    });
  } catch (err) {
    console.error('Request processing error:', err);
    res.status(400).send({ error: 'Bad Request', details: err.message });
  }
});

router.get('/all', (req, res) => {
 Article.find({}).then((articles)=>{
  res.status(200).send(articles);
 })
 .catch((err)=>{
  res.status(400).send(err)
})});


router.get('/getbyid/:id', (req, res) => {
let id = req.params.id;
Article.findOne({_id:id}).then((articles)=>{
  res.status(200).send(articles);
 })
 .catch((err)=>{
  res.status(400).send(err)
})});

router.get('/getbyIdAuthor/:id', (req, res) => {
  let id = req.params.id;
  Article.find({idAuthor:id}).then((articles)=>{
    res.status(200).send(articles);
   })
   .catch((err)=>{
    res.status(400).send(err)
  })});


  router.delete('/supprimer/:id', (req, res) => {
    
    let id = req.params.id;
    Article.findByIdAndDelete({_id:id}).then((articles)=>{
      res.status(200).send(articles);
     })
     .catch((err)=>{
      res.status(400).send(err)
    })});


    router.put('/update/:id',upload.any('image'), (req, res) => {
   let id = req.params.id;
   let data = req.body;
   data.tags = data.tags.split(',');

   if (filename.length > 0) 
       {data.image = filename;}
    Article.findByIdAndUpdate({_id:id},data).then((articles)=>{
    filename = '';
    res.status(200).send(articles);
  })
  .catch((err)=>{
    res.status(400).send(err)
  })});
    


    


module.exports = router;
