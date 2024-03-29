const express = require('express');
const router = express.Router();
const { Role, validateRole } = require('../models/role');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

router.get('/', async (req, res) => {
    const roles = await Role.find().sort('name');
    res.send(roles);
});

router.get('/:id', [auth], async (req, res) => {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).send('The Role with the given ID was not found.');
    res.send(role);
});

router.post('/', [auth, admin], async (req, res) => {
    const { error } = validateRole(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let role = await Role.findOne({ name: req.body.name });
    if (role) return res.status(400).send('The Role name already exists.');

    role = new Role({ name: req.body.name });
    role = await role.save();

    res.send(role);
});

router.put('/:id', [auth, admin], async (req, res) => {
    const { error } = validateRole(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let found = await Role.findOne({ name: req.body.name });
    if (found) return res.status(400).send('The Role name already exists.');

    const role = await Role.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    });

    if (!role) return res.status(404).send('The Role with the given ID was not found.');

    res.send(role);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const role = await Role.findByIdAndRemove(req.params.id);
    if (!role) return res.status(404).send('The Role with the given ID was not found.');
    res.send(role);
});

module.exports = router;