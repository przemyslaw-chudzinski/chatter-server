const express = require('express');
const router = express.Router();
const notificationsController = require('../../../controllers/notifications/notifications.controller');

/**
 * @desc It returns a notifications list of logged user
 */
router.get('/', (req, res) => new notificationsController.GetNotificationsAction(req, res).init());
/**
 * @desc It returns number of notifications
 */
router.get('/count', (req, res) => new notificationsController.CountNotificationsAction(req, res).init());
/**
 * @desc It marks as read unread notifications
 */
router.post('/mark-as-read', (req, res) => new notificationsController.ResetUnreadNotificationsAction(req, res).init());

module.exports = router;
