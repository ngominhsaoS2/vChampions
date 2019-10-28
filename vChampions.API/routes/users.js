const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const { Fawn } = require('../middlewares/fawn');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { User, validateUser } = require('../models/user');
const { Role, validateRole } = require('../models/role');
const { Club } = require('../models/club');


router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password'); // Không chọn property password
    if (!user) return res.status(400).send('The User was not found.');
    res.send(user);
});

router.get('/:id', auth, async (req, res) => {
    const user = await User.findById(req.params.id).select(['-password']);
    if (!user) return res.status(400).send('The User was not found.');
    res.send(user);
});

router.get('/', [auth], async (req, res) => {
    const users = await User.find().select('-password').sort('email');
    res.send(users);
});

router.get('/:id/joining-requests', [auth], async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(400).send('The User with the given ID was not found.');
    if (req.user._id != req.params.id) return res.status(400).send('The given ID was not correct.');
    res.send(_.filter(user.clubs, { 'confirmation': 'received' }));
});

router.put('/confirm-request/:clubId', [auth], async (req, res) => {
    let club = await Club.findById(req.params.clubId);
    if (!club) return res.status(400).send('Invalid Club.');

    try {
        var task = Fawn.Task();
        task.update('users', { _id: req.user._id, 'clubs._id': mongoose.Types.ObjectId(req.params.clubId) }, {
            $set: { 'clubs.$.confirmation' : req.body.confirmation }
        });

        task.update('clubs', { _id: req.params.clubId, 'players._id': mongoose.Types.ObjectId(req.user._id) }, {
            $set: { 'players.$.confirmation' : req.body.confirmation }
        });

        let result = await task.run({useMongoose: true});
        //res.send(result);
        res.send(req.body.confirmation == 'accepted' ? 'You are a member of this Club now.' : "You denined to be this Club's member successfully");
    }
    catch (ex) {
        console.log(ex);
        res.status(500).send(ex);
    }
});

router.post('/demo', async (req, res) => {
    console.log(req.body);
});

router.post('/', async (req, res) => {
    const error = validateUser(req.body);
    if (error != true) return res.status(400).send(error);

    let user = await User.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] });
    if (user) return res.status(400).send('Email or phone number is already used by other User.');

    user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        roles: [],
        birthday: req.body.birthday || null,
        description: req.body.description || null
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    if (req.body.roles != undefined && req.body.roles.length > 0) {
        for (let item of req.body.roles) {
            let found = await Role.findOne({ name: item });
            if (found) {
                user.roles.push(found.name);
            }
        }
    }
    else {
        return res.status(400).send('Provide at least one Role for User');
    }

    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'phone', 'roles', 'description', 'birthday']));
});

router.put('/', auth, async (req, res) => {
    const error = validateUser(req.body);
    if (error != true) return res.status(400).send(error);

    let user = await User.findOne({ phone: req.body.phone });
    if (user.email != req.user.email) return res.status(400).send('Phone number is already used by other User.');

    let roles = [];
    if (req.body.roles != undefined && req.body.roles.length > 0) {
        for (let item of req.body.roles) {
            let found = await Role.findOne({ name: item });
            if (found) {
                roles.push(found.name);
            }
        }
    }
    else {
        return res.status(400).send('Provide at least one Role for User');
    }

    user = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
            name: req.body.name,
            phone: req.body.phone,
            roles: roles,
            birthday: req.body.birthday,
            description: req.body.description
        },
        { new: true }
    );

    if (!user) return res.status(404).send('The User with the given ID was not found.');

    res.send(_.pick(user, ['_id', 'name', 'email', 'phone', 'roles', 'description', 'birthday']));
});

module.exports = router;