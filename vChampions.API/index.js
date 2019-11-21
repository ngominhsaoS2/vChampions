const winston = require('winston');
const express = require('express');
const app = express();

app.use(express.json({ limit: '50mb' })); // dùng để nhận json từ request
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // dùng cho x-www-form-urlencoded tại postman

require('./startup/cors-config')(app);
require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));