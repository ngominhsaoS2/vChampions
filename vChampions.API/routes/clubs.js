const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const { Club, validateClub, validatePlayers } = require('../models/club');
const { User } = require('../models/user');

// Transactions
const mongoose = require('mongoose');
const Fawn = require('fawn');
Fawn.init(mongoose);

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

    const manager = await User.findById(req.body.managerId);
    if (!manager) return res.status(400).send('Invalid manager.');

    club = new Club({
        code: req.body.code,
        name: req.body.name,
        manager: {
            _id: req.body.managerId,
            name: manager.name,
            email: manager.email,
            phone: manager.phone,
            description: manager.description
        },
        players: []
    });

    try {
        var task = Fawn.Task();

        if (req.body.players != undefined && req.body.players.length > 0) {
            for (let item of req.body.players) {
                let found = await User.findById(item._id);
                if (found) {
                    let player = _.pick(found, ['_id', 'name', 'email', 'phone', 'description'])
                    player.title = item.title ? item.title : 'player';
                    player.positions = item.positions.length > 0 ? item.positions : [];
                    club.players.push(player);

                    // Update clubs of Player
                    if (_.findIndex(player.clubs, ['_id', club._id]) < 0) {
                        task.update('users', { _id: player._id }, {
                            $push: {
                                clubs: {
                                    _id: club._id,
                                    code: req.body.code,
                                    name: req.body.name,
                                    titleOfUser: item.title ? item.title : 'player',
                                    isConfirmed: false
                                }
                            }
                        });
                    }
                }
            }
        }

        task.save('clubs', club);
        task.run();

        res.send(club);
    }
    catch (ex) {
        res.status(500).send(ex);
    }
});

router.put('/:id/add-players', auth, async (req, res) => {
    const error = await validatePlayers(req.body);
    if (error != true) return res.status(400).send(error);

    let club = await Club.findById(req.params.id);
    if (!club) return res.status(400).send('Invalid Club.');

    try {
        var task = Fawn.Task();

        if (req.body.players != undefined && req.body.players.length > 0) {
            let newPlayers = [];
            for (let item of req.body.players) {
                let found = await User.findById(item._id);
                if (found) {
                    let player = _.pick(found, ['_id', 'name', 'email', 'phone', 'description'])
                    player.title = item.title ? item.title : 'player';
                    player.positions = item.positions.length > 0 ? item.positions : [];
                    newPlayers.push(player);

                    // Update clubs of Player
                    if (_.findIndex(player.clubs, ['_id', club._id]) < 0) {
                        task.update('users', { _id: player._id }, {
                            $push: {
                                clubs: {
                                    _id: club._id,
                                    code: club.code,
                                    name: club.name,
                                    titleOfUser: item.title ? item.title : 'player',
                                    isConfirmed: false
                                }
                            }
                        });
                    }
                }
            }

            task.update('clubs', { _id: club._id }, {
                $push: {
                    players: { $each: newPlayers }
                }
            });

            task.run();
            res.send('Add Players successfully.');
        }
        else {
            return res.status(400).send('Add at least one Player.');
        }
    }
    catch (ex) {
        res.status(500).send(ex);
    }
});

router.delete('/:id/remove-player/:playerId', [auth], async (req, res) => {
    let club = await Club.findById(req.params.id);
    if (!club) return res.status(400).send('Invalid Club.');

    let player = await User.findById(req.params.playerId);
    if (!player) return res.status(400).send('Invalid Player.');

    try {
        var task = Fawn.Task();
        task.update('clubs', { _id: req.params.id }, {
            $pull: {
                players: { _id: mongoose.Types.ObjectId(req.params.playerId) }
            }
        });

        task.update('users', { _id: req.params.playerId }, {
            $pull: {
                clubs: { _id: mongoose.Types.ObjectId(req.params.id) }
            }
        });

        task.run({useMongoose: true});
        res.send('Remove Player successfully.');
    }
    catch (ex) {
        res.status(500).send(ex);
    }
});

module.exports = router;