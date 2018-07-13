const env = require('./env');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/api/v1/auth', require('./api/v1/routes/auth.routes'));
app.use('/api/v1/users', require('./api/v1/routes/users.routes'));
app.use('/api/v1/messages', require('./api/v1/routes/messages.routes'));

module.exports = app;