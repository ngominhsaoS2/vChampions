const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');
const config = require('config');

cloudinary.config({
    cloud_name: config.get('cloud_name'),
    api_key: config.get('api_key'),
    api_secret: config.get('api_secret')
});

router.post('/add-image', async (req, res) => {
    cloudinary.uploader.upload(req.body.image, async (result) => {
        res.send(result);
    }, error => {
        res.status(500).send(error);
    });
});



module.exports = router;