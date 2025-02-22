
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Author = require('../models/author');
const multer = require('multer');
let filename = '';

const mystorage = multer.diskStorage({ destination: './uploads',
filename: (req, file, redirect) => {
let date = Date.now();
let fl = date + '.' + file.mimetype.split('/')[1];
redirect(null, fl); 
filename = fl;
}});

const upload = multer({ storage: mystorage }); 

//regiter
router.post('/register', upload.any('image'), (req, res) => {
console.log('Request received at /register');
console.log('Request body:', req.body); 
console.log('Uploaded files:', req.files);
try {
let data = req.body;
// Validate data
if (!data) {
throw new Error('Invalid request data');
}

let author = new Author(data);
author.image = filename;
let salt = bcrypt.genSaltSync(10);
author.password= bcrypt.hashSync(data.password,salt)
author.save()
.then(
    (savedAuthor) => {
     filename = '';
     res.status(200).send(savedAuthor);
    })
.catch((err) => {
console.error('Error saving author:', err);
res.status(400).send({ error: 'Error saving author', details: err });
});
} 
catch (err){
console.error('Request processing error:', err);
res.status(400).send({ error: 'Bad Request', details: err.message });
}});

//login
router.post('/login', (req, res) => {
    let data = req.body;
    Author.findOne({email:data.email})
    .then(
        (author) => {
         let valid = bcrypt.compareSync(data.password,author.password)
         if(!valid)
            {
            res.send('email or password invalid !');
            }
         else 
           {
              
            let payload = {
                _id:author._id,
                email:author.email,
                fullName:author.name+''+author.lastname
              }
              let key ='123456';
              let token=jwt.sign(payload,key)
              res.send({mytoken:token});
           }
        })
    .catch((err) => {
    console.error('unable to login', err);
    res.status(400).send({ error: 'Error while login', details: err });
    });

})

router.get('/all', (req, res) => {
  Author.find({}).then((authors)=>{
   res.status(200).send(authors);
  })
  .catch((err)=>{
   res.status(400).send(err)
 })});


 router.get('/getbyid/:id', (req, res) => {
  let id = req.params.id;
  Author.findOne({_id:id}).then((author)=>{
    res.status(200).send(author);
   })
   .catch((err)=>{
    res.status(400).send(err)
  })});


  
  router.delete('/supprimer/:id', (req, res) => {
    
    let id = req.params.id;
    Author.findByIdAndDelete({_id:id})
    .then((author)=>{
      res.status(200).send(author);
     })
     .catch((err)=>{
      res.status(400).send(err)
    })});


    router.put('/update/:id',upload.any('image'),(req, res) => {
      let id = req.params.id;
      let data = req.body;
   
      if (filename.length > 0) 
          {data.image = filename;}
       Author.findByIdAndUpdate({_id:id},data)
       .then((author)=>{
       filename = '';
       res.status(200).send(author);
        })
       .catch((err)=>{
       res.status(400).send(err)
     })});
       
     module.exports = router;
