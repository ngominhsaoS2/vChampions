const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middlewares/error');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/auth', auth);

    // SaoNM this error logging middleware is registered after all routes middlewares
    app.use(error);
}
