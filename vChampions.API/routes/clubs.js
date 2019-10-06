const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const { validateClub } = require('../models/club');

router.post('/', auth, async (req, res) => {
    const error = validateClub(req.body);
    if (error != true) return res.status(400).send(error);

    res.send('Valid');
});

module.exports = router;