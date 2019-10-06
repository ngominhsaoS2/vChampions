const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const { Club, validateClub } = require('../models/club');

router.post('/', auth, async (req, res) => {
    const { error } = validateClub(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const role = await Role.findById(req.body.roleId);
    if (!role) return res.status(400).send('Invalid role.');

    let user = await User.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] });
    if (user) return res.status(400).send('Email or phone number is already used by another user.');

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

module.exports = router;