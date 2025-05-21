const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

router.post('/create', articleController.upload.single('image'), articleController.createArticle);
router.get('/all', articleController.getAllArticles);
router.get('/getbyid/:id', articleController.getArticleById);
router.get('/getArticlesByAuthor/:id', articleController.getArticlesByAuthor);
router.delete('/delete/:id', articleController.deleteArticle);
router.put('/update/:id', articleController.upload.single('image'), articleController.updateArticle);
router.put('/:id/like', articleController.likeArticle);
router.put('/:id/comment', articleController.commentArticle);
router.get('/search', articleController.searchArticles);

module.exports = router;
