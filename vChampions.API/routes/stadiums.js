const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const { Fawn } = require('../middlewares/fawn');
const { Stadium, validateStadium } = require('../models/stadium');
const { User } = require('../models/user');

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
    if (stadium) return res.status(400).send('Name is already registered by other Stadium.');

    let owner = await User.findById(req.user._id);
    if (!owner) return res.status(400).send('Invalid owner.');

    stadium = new Stadium({
        name: req.body.name,
        address: req.body.address,
        owners: [
            {
                name: owner.name,
                email: owner.email,
                phone: owner.phone,
                avatar: owner.avatar,
                description: owner.description,
            }
        ],
        yards: _.uniqBy(req.body.yards, 'name')
    });

    await stadium.save();
    res.send(stadium);
});

router.put('/:id/add-yards', auth, async (req, res) => {


});

module.exports = router;