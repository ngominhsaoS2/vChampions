const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const uuidv1 = require('uuid/v1');
const config = require('config');

const cloudinaryFolder = config.get('cloudinaryFolder');

cloudinary.config({
    cloud_name: config.get('cloud_name'),
    api_key: config.get('api_key'),
    api_secret: config.get('api_secret')
});

router.post('/add-image', async (req, res) => {
    const publidId = cloudinaryFolder + req.body.folder + '/' + uuidv1();
    cloudinary.uploader.upload(req.body.image, { public_id: publidId }, (error, result) => {
        if (error) res.status(500).send(error);
        res.send(result);
    });
});

module.exports = router;