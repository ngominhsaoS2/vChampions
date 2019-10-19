const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const { Fawn } = require('../middlewares/fawn');
const { Stadium, validateStadium } = require('../models/stadium');

router.get('/', async (req, res) => {
    const stadiums = await Stadium.find().sort('name');
    res.send(stadiums);
});

router.get('/:id', async (req, res) => {
    const stadium = await Stadium.findById(req.params.id);
    if (!stadium) return res.status(404).send('The Stadium with the given ID was not found.');
    res.send(stadium);
});

router.post('/', auth, async (req, res) => {
    const error = await validateStadium(req.body);
    if (error != true) return res.status(400).send(error);

    let stadium = await Stadium.findOne({ name: req.body.name });
    if (stadium) return res.status(400).send('Name is already registerd by another Stadium.');

    stadium = new Stadium({
        name: req.body.name,
        address: req.body.address,
        yards: []
    });

    await stadium.save();
    res.send(stadium);
});

module.exports = router;