const express = require('express');
const router = express.Router();
const notificationsController = require('../../../controllers/notifications/notifications.controller');

/**
 * @desc It returns a notifications list of logged user
 */
router.get('/', (req, res) => new notificationsController.GetNotificationsAction(req, res));

module.exports = router;