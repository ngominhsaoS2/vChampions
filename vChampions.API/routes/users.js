const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const { User, validate } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password'); // Không chọn property password
    if (!user) return res.status(400).send('The user was not found.');
    res.send(user);
});

router.get('/', [auth, admin], async (req, res) => {
    const users = await User.find().select('-password').sort('name');
    res.send(users);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already existed.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.put('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        { name: req.body.name, isAdmin: req.body.isAdmin },
        { new: true }
    );

    if (!user) return res.status(404).send('The user with the given ID was not found.');

    res.send(_.pick(user, ['name', 'email', 'isAdmin']));
});

module.exports = router;