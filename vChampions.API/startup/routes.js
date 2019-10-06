const express = require('express');

// routes
const auth = require('../routes/auth');
const users = require('../routes/users');
const roles = require('../routes/roles');

// middlewares
const error = require('../middlewares/error');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/auth', auth);
    app.use('/api/roles', roles);
    app.use('/api/users', users);

    // SaoNM this error logging middleware is registered after all routes middlewares
    app.use(error);
}
