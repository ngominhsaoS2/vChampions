const winston = require('winston')
const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

module.exports = function () {
    mongoose.connect('mongodb://saonm:minhsao11@139.180.134.199:27017/vChampions-dev')
        .then(() => winston.info('Connected to MongoDB...'));
}