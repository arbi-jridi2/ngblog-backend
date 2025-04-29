
const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

router.post('/register', authorController.upload.single('image'), authorController.register);
router.post('/login', authorController.login);
router.get('/all', authorController.getAllAuthors);
router.get('/getbyid/:id', authorController.getAuthorById);
router.delete('/delete/:id', authorController.deleteAuthor);
router.put('/update/:id', authorController.upload.single('image'), authorController.updateAuthor);

module.exports = router;
