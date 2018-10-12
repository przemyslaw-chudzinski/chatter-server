const env = require('./env');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

// app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/api/v1/auth', require('./api/v1/routes/auth.routes'));
app.use('/api/v1/user', require('./api/v1/routes/users.routes'));
app.use('/api/v1/users', require('./api/v1/routes/users.routes'));
app.use('/api/v1/messages', require('./api/v1/routes/messages.routes'));
app.use('/api/v1/validator', require('./api/v1/routes/validator.routes'));
app.use('/api/v1/channels', require('./api/v1/routes/channels.routes'));
app.use('/api/v1/notifications', require('./api/v1/routes/notifications.routes'));

module.exports = app;