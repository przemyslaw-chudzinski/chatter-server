const express = require('express');
const router = express.Router();
const messagesController = require('../../../controllers/messages/messages.controller');

router.post('/', (req, res) => new messagesController.SaveMessageAction(req, res));

module.exports = router;