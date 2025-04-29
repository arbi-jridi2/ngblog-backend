const express = require('express');
const path = require('path');
const articleApi = require('./routes/article');
const authorApi = require('./routes/author');
const cors = require('cors');
const cloudinary = require('./config/cloudinary');

require('./config/connect')
const port = 3000; 

const app = express();
app.use(express.json());

app.use(cors());
app.use('/article',articleApi);
app.use('/author',authorApi);

app.use('/getimage', (req, res) => {
   
    const imageName = req.params.image;
    cloudinary.v2.uploader.url(imageName, (error, result) => {
        if (error) {
            console.error('Image not found:', error);
            res.status(404).send('Image not found');
        } else {
            res.send(result);
        }
    });
});


app.get('/getimage/:imageName', (req, res) => {
    const imageName = req.params.image;

    cloudinary.v2.uploader.url(imageName, (error, result) => {
        if (error) {
            console.error('Image not found:', error);
            res.status(404).send('Image not found');
        } else {
            res.send(result);
        }
    });
});
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})