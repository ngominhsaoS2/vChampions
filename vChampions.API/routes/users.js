const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { User, validateUser } = require('../models/user');
const { Role, validateRole } = require('../models/role');

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password'); // Không chọn property password
    if (!user) return res.status(400).send('The User was not found.');
    res.send(user);
});

router.get('/', [auth], async (req, res) => {
    const users = await User.find().select('-password').sort('name');
    res.send(users);
});

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const role = await Role.findById(req.body.roleId);
    if (!role) return res.status(400).send('Invalid role.');

    let user = await User.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] });
    if (user) return res.status(400).send('Email or phone number is already used by another User.');

    user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        role: {
            _id: role._id,
            name: role.name
        },
        birthday: req.body.birthday || null,
        description: req.body.description || null
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'phone', 'role', 'description', 'birthday']));
});

router.put('/', auth, async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const role = await Role.findById(req.body.roleId);
    if (!role) return res.status(400).send('Invalid role.');

    let user = await User.findOne({ phone: req.body.phone });
    console.log(user.email);
    console.log(req.user.email);
    

    if (user.email != req.user.email) return res.status(400).send('Phone number is already used by another User.');

    user = await User.findOneAndUpdate(
        { _id: req.user._id },
        { 
            name: req.body.name,
            phone: req.body.phone,
            role: {
                _id: role._id,
                name: role.name
            },
            birthday: req.body.birthday,
            description: req.body.description
        },
        { new: true }
    );

    if (!user) return res.status(404).send('The User with the given ID was not found.');

    res.send(_.pick(user, ['_id', 'name', 'email', 'phone', 'role', 'description', 'birthday']));
});

module.exports = router;