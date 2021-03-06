const express = require('express');
const router = express.Router();
const messagesController = require('../../../controllers/messages/messages.controller');

/**
 * @desc It returns a list of unread messages
 */
router.get('/unread-messages', (req, res) => new messagesController.GetUnreadMessagesAction(req, res).init());
/**
 * @desc It returns list of messages from single contact
 * @todo: Change the recipientId into contactId
 */
router.get('/:recipientId', (req, res) => new messagesController.GetMessagesAction(req, res).init());
/**
 * @desc It updates single message
 */
router.patch('/update-message', (req, res) => new messagesController.UpdateMessageAction(req, res).init());
/**
 * @desc It creates single message
 */
router.post('/', (req, res) => new messagesController.SaveMessageAction(req, res).init());
/**
 * @desc It resets unread messages by contactId
 */
router.patch('/reset-unread/:contactId', (req ,res) => new messagesController.ResetUnreadMessagesAction(req, res).init());

module.exports = router;