// Transactions
const mongoose = require('mongoose');
const Fawn = require('fawn');
Fawn.init(mongoose);

exports.Fawn = Fawn; 