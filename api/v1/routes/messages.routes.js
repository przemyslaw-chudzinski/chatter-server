const express = require('express');
const router = express.Router();
const messagesController = require('../../../controllers/messages/messages.controller');

router.get('/:recipientId', (req, res) => new messagesController.GetMessagesAction(req, res));
router.post('/', (req, res) => new messagesController.SaveMessageAction(req, res));

module.exports = router;