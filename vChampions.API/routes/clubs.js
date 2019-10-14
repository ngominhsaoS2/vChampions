const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const { Club, validateClub } = require('../models/club');
const { User } = require('../models/user');

router.get('/', async (req, res) => {
    const clubs = await Club.find().sort('name');
    res.send(clubs);
});

router.get('/:id', async (req, res) => {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).send('The Club with the given ID was not found.');
    res.send(club);
});

router.post('/', auth, async (req, res) => {
    const error = await validateClub(req.body);
    if (error != true) return res.status(400).send(error);

    let club = await Club.findOne({ code: req.body.code });
    if (club) return res.status(400).send('Code is already registerd by another Club.');

    const captain = await User.findById(req.body.captainId);
    if (!captain) return res.status(400).send('Invalid captain.');

    club = new Club({
        code: req.body.code,
        name: req.body.name,
        captain: {
            _id: req.body.captainId,
            name: captain.name,
            email: captain.email,
            phone: captain.phone,
            description: captain.description
        },
        players: []
    });

    if (req.body.players != undefined && req.body.players.length > 0) {
        for (let item of req.body.players) {
            let player = await User.findById(item._id);
            if (player) {
                club.players.push(_.pick(player, ['_id', 'name', 'email', 'phone', 'description']));
            }
        }
    }

    await club.save();
    res.send(club);
});

router.put('/:id', auth, async (req, res) => {
    const error = await validateClub(req.body);
    if (error != true) return res.status(400).send(error);

    const captain = await User.findById(req.body.captainId);
    if (!captain) return res.status(400).send('Invalid captain.');

    let club = await Club.findOne({ code: req.body.code });
    if (club != null && club._id != req.params.id) return res.status(400).send('Code is already registerd by another Club.');

    let players = [];
    if (req.body.players != undefined && req.body.players.length > 0) {
        for (let item of req.body.players) {
            let player = await User.findById(item._id);
            if (player) {
                players.push(_.pick(player, ['_id', 'name', 'email', 'phone', 'description']));
            }
        }
    }

    club = await Club.findOneAndUpdate(
        { _id: req.params.id },
        { 
            code: req.body.code,
            name: req.body.name,
            captain: {
                _id: req.body.captainId,
                name: captain.name,
                email: captain.email,
                phone: captain.phone,
                description: captain.description
            },
            players: players
        },
        { new: true }
    );

    if (!club) return res.status(404).send('The Club with the given ID was not found.');
    res.send(club);
});

module.exports = router;