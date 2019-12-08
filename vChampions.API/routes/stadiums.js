const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const isAdminOrModerator = require('../middlewares/isAdminOrModerator');
const { Fawn } = require('../middlewares/fawn');
const { Stadium, validateStadium, validateYards, validatePrices } = require('../models/stadium');
const { User } = require('../models/user');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    const stadiums = await Stadium.find().sort('name');
    res.send(stadiums);
});

router.get('/find-by-id/:id', async (req, res) => {
    const stadium = await Stadium.findById(req.params.id);
    if (!stadium) return res.status(404).send('The Stadium with the given ID was not found.');
    res.send(stadium);
});

router.get('/manage/:id', [auth, isAdminOrModerator], async (req, res) => {
    const stadium = await Stadium.findById(req.params.id);
    if (!stadium) return res.status(404).send('The Stadium with the given ID was not found.');

    if (_.findIndex(stadium.owners, { _id: mongoose.Types.ObjectId(req.user._id) }) == -1 && req.isAdminOrModerator == false)
        return res.status(400).send('Just Owner of this Stadium is authorized to edit');

    res.send(stadium);
});

router.get('/managed-by-you', [auth], async (req, res) => {
    const stadiums = await Stadium.find({ 'owners._id': req.user._id });
    res.send(stadiums);
});

router.post('/', auth, async (req, res) => {
    const error = await validateStadium(req.body);
    if (error != true) return res.status(400).send(error);

    let stadium = await Stadium.findOne({ name: req.body.name });
    if (stadium) return res.status(400).send('Name is already registered by other Stadium.');

    let owner = await User.findById(req.user._id);
    if (!owner || _.indexOf(owner.roles, 'StadiumOwner') < 0) return res.status(400).send('Invalid owner.');

    stadium = new Stadium({
        name: req.body.name,
        address: req.body.address,
        logo: req.body.logo,
        owners: [
            _.pick(owner, ['_id', 'name', 'email', 'phone', 'description', 'avatar'])
        ],
        yards: _.uniqBy(req.body.yards, 'name')
    });

    await stadium.save();
    res.send(stadium);
});

router.put('/:id', [auth, isAdminOrModerator], async (req, res) => {
    const error = await validateStadium(req.body);
    if (error != true) return res.status(400).send(error);

    let stadium = await Stadium.findById(req.params.id);
    if (!stadium) return res.status(400).send('Invalid Stadium.');

    if (_.findIndex(stadium.owners, { _id: mongoose.Types.ObjectId(req.user._id) }) == -1 && req.isAdminOrModerator == false)
        return res.status(400).send('Just Owner of this Stadium is authorized to edit');

    stadium = await Stadium.findOneAndUpdate(
        { _id: req.params.id },
        {
            name: req.body.name,
            address: req.body.address,
            logo: req.body.logo,
            yards: _.uniqBy(req.body.yards, 'name')
        },
        { new: true }
    );

    return res.status(200).send(stadium);
});

router.put('/:id/add-yards', auth, async (req, res) => {
    const error = await validateYards(req.body);
    if (error != true) return res.status(400).send(error);

    let stadium = await Stadium.findById(req.params.id);
    if (!stadium) return res.status(400).send('Invalid Stadium.');

    if (!(_.find(stadium.owners, { 'email': req.user.email })))
        return res.status(400).send('Just owners of this Stadium are authorized to add new yards.');

    stadium = await Stadium.findOneAndUpdate(
        { _id: req.params.id },
        {
            $push: {
                yards: { $each: _.uniqBy(req.body.yards, 'name') }
            }
        },
        { new: true }
    );

    res.send(stadium);
});

router.put('/:id/add-prices', auth, async (req, res) => {
    const error = await validatePrices(req.body);
    if (error != true) return res.status(400).send(error);

    let stadium = await Stadium.findById(req.params.id);
    if (!stadium) return res.status(400).send('Invalid Stadium.');

    if (!(_.find(stadium.owners, { 'email': req.user.email })))
        return res.status(400).send('Just owners of this Stadium are authorized to add new yards.');

    stadium.prices = _.concat(stadium.prices, req.body.prices);

    await stadium.save();
    res.send(stadium);
});

router.delete('/:id/remove-yard/:yardId', [auth], async (req, res) => {
    let stadium = await Stadium.findById(req.params.id);
    if (!stadium) return res.status(400).send('Invalid Stadium.');

    if (!(_.find(stadium.owners, { 'email': req.user.email })))
        return res.status(400).send('Just owners of this Stadium are authorized to add new yards.');

    stadium.yards = _.filter(stadium.yards, function (x) { return x._id != req.params.yardId });

    await stadium.save();
    res.send(stadium);
});

module.exports = router;