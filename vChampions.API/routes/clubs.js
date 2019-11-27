const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const isAdminOrModerator = require('../middlewares/isAdminOrModerator');
const { Fawn } = require('../middlewares/fawn');
const { Club, validateClub, validatePlayers } = require('../models/club');
const { User } = require('../models/user');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    const clubs = await Club.find().sort('name');
    res.send(clubs);
});

router.get('/find-by-id/:id', async (req, res) => {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).send('The Club with the given ID was not found.');
    res.send(club);
});

router.get('/find-by-code/:clubCode', async (req, res) => {
    const club = await Club.findOne({ code: req.params.clubCode });
    if (!club) return res.status(404).send('The Club with the given Code was not found.');
    res.send(club);
});

router.get('/managed-by-you', [auth], async (req, res) => {
    const clubs = await Club.find({ 'manager._id': req.user._id });
    res.send(clubs);
});

router.get('/manage/:clubCode', [auth, isAdminOrModerator], async (req, res) => {
    const club = await Club.findOne({ code: req.params.clubCode });
    if (!club) return res.status(404).send('The Club with the given Code was not found.');

    if (club.manager._id != req.user._id && req.isAdminOrModerator == false)
        return res.status(404).send('Just Manager of this Club is authorized to manage.');

    // Order by Positions
    club.players = _.orderBy(club.players, ['positions'], ['asc']);

    res.send(club);
});

router.post('/', auth, async (req, res) => {
    const error = await validateClub(req.body);
    if (error != true) return res.status(400).send(error);

    let club = await Club.findOne({ code: req.body.code });
    if (club) return res.status(400).send('Code is already registerd by other Club.');

    const manager = await User.findById(req.body.managerId);
    if (!manager) return res.status(400).send('Invalid manager.');

    club = new Club({
        code: req.body.code.toLowerCase(),
        name: req.body.name,
        city: req.body.city,
        district: req.body.district,
        description: req.body.description,
        manager: _.pick(manager, ['_id', 'name', 'email', 'phone', 'description', 'avatar']),
        players: []
    });

    try {
        var task = Fawn.Task();

        if (req.body.players != undefined && req.body.players.length > 0) {
            for (let item of req.body.players) {
                let found = await User.findById(item.id);
                if (found) {
                    let player = _.pick(found, ['_id', 'name', 'email', 'phone', 'description', 'avatar']);
                    player.title = item.title ? item.title : 'player';
                    player.positions = item.positions.length > 0 ? item.positions : [];
                    player.confirmation = 'received';
                    club.players.push(player);

                    // Update clubs of Player
                    if (_.findIndex(player.clubs, ['_id', club._id]) < 0) {
                        task.update('users', { _id: player._id }, {
                            $push: {
                                clubs: {
                                    _id: club._id,
                                    code: req.body.code,
                                    name: req.body.name,
                                    city: req.body.city,
                                    district: req.body.district,
                                    titleOfUser: item.title ? item.title : 'player',
                                    confirmation: 'received'
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

router.put('/:id', [auth, isAdminOrModerator], async (req, res) => {
    const error = await validateClub(req.body);
    if (error != true) return res.status(400).send(error);

    let club = await Club.findById(req.params.id);
    if (!club) return res.status(400).send('Invalid Club.');

    if (club.manager._id != req.user._id && req.isAdminOrModerator == false)
        return res.status(400).send('Just Manager of this Club is authorized to edit');

    try {
        var task = Fawn.Task();

        if (club.players.length > 0) {
            for (let player of club.players) {
                task.update('users', { _id: player._id, 'clubs._id': mongoose.Types.ObjectId(req.params.id) }, {
                    $set: {
                        'clubs.$.code': req.body.code,
                        'clubs.$.name': req.body.name,
                        'clubs.$.city': req.body.city,
                        'clubs.$.district': req.body.district,
                        'clubs.$.description': req.body.description,
                        'clubs.$.logo': req.body.logo
                    }
                });
            }
        }

        task.update('clubs', { _id: mongoose.Types.ObjectId(req.params.id) }, {
            $set: {
                'code': req.body.code,
                'name': req.body.name,
                'city': req.body.city,
                'district': req.body.district,
                'description': req.body.description,
                'logo': req.body.logo,
            }
        });

        task.run();
        res.send(club);
    }
    catch (ex) {
        res.status(500).send(ex);
    }
});

router.put('/:id/add-players', [auth, isAdminOrModerator], async (req, res) => {
    const error = await validatePlayers(req.body);
    if (error != true) return res.status(400).send(error);

    let club = await Club.findById(req.params.id);
    if (!club) return res.status(400).send('Invalid Club.');

    if (club.manager._id != req.user._id && req.isAdminOrModerator == false)
        return res.status(400).send('Just Manager of this Club is authorized to add new Players');

    try {
        var task = Fawn.Task();

        if (req.body.players != undefined && req.body.players.length > 0) {
            let newPlayers = [];
            for (let item of req.body.players) {
                let found = await User.findById(item.id);
                if (found) {
                    let player = _.pick(found, ['_id', 'name', 'email', 'phone', 'description', 'avatar'])
                    player.title = item.title ? item.title : 'player';
                    player.positions = item.positions.length > 0 ? item.positions : [];
                    player.confirmation = 'received';
                    newPlayers.push(player);

                    // Update clubs of Player
                    if (_.findIndex(player.clubs, ['_id', club._id]) < 0) {
                        task.update('users', { _id: player._id }, {
                            $push: {
                                clubs: {
                                    _id: club._id,
                                    code: club.code,
                                    name: club.name,
                                    city: club.city,
                                    district: club.district,
                                    logo: club.logo,
                                    titleOfUser: item.title ? item.title : 'player',
                                    confirmation: 'received'
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
            res.send({ message: 'Add Players Successfully' });
        }
        else {
            return res.status(400).send('Add at least one Player.');
        }
    }
    catch (ex) {
        console.log(ex);
        res.status(500).send(ex);
    }
});

router.put('/:clubId/set-as-captain/:playerId', [auth, isAdminOrModerator], async (req, res) => {
    let club = await Club.findById(req.params.clubId);
    if (!club) return res.status(400).send('Invalid Club.');

    if (club.manager._id != req.user._id && req.isAdminOrModerator == false)
        return res.status(400).send('Just Manager of this Club is authorized to dicide who would be Captain');

    if (_.findIndex(club.players, { _id: mongoose.Types.ObjectId(req.params.playerId) }) >= 0) {
        club.players.forEach(player => {
            if (player._id == req.params.playerId) {
                player.title = 'captain';
            } else {
                player.title = 'player';
            }
        });

        await club.save();
        return res.status(200).send(club);
    } else {
        return res.status(400).send("This Player is not memeber of you Club");
    }
});

router.put('/:clubId/change-position/:playerId/:postion', [auth, isAdminOrModerator], async (req, res) => {
    let club = await Club.findById(req.params.clubId);
    if (!club) return res.status(400).send('Invalid Club.');

    if (club.manager._id != req.user._id && req.isAdminOrModerator == false)
        return res.status(400).send('Just Manager of this Club is authorized to dicide who would be Captain');

    if (_.findIndex(club.players, { _id: mongoose.Types.ObjectId(req.params.playerId) }) >= 0) {
        club = await Club.findOneAndUpdate(
            { _id: req.params.clubId, 'players._id': mongoose.Types.ObjectId(req.params.playerId) },
            {
                'players.$.positions': [req.params.postion],
            },
            { new: true }
        );

        return res.status(200).send(club);
    } else {
        return res.status(400).send("This Player is not memeber of you Club");
    }
});

router.delete('/:id/remove-player/:playerId', [auth, isAdminOrModerator], async (req, res) => {
    let club = await Club.findById(req.params.id);
    if (!club) return res.status(400).send('Invalid Club.');

    if (club.manager._id != req.user._id && req.isAdminOrModerator == false)
        return res.status(400).send('Just Manager of this club is authorized to remove players');

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

        let result = await task.run({ useMongoose: true });
        //res.send(result);
        res.send({ message: 'Remove Player successfully.' });
    }
    catch (ex) {
        console.log(ex);
        res.status(500).send(ex);
    }
});

module.exports = router;