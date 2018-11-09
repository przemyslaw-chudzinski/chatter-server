const express = require('express');
const router = express.Router();
const channelsController = require('../../../controllers/channels/channels.controller');

/**
 * @desc It creates single channel
 */
router.post('/', (req, res) => new channelsController.SaveChannelAction(req, res).init());
/**
 * @desc It returns channels list belongs to logged user
 */
router.get('/', (req, res) => new channelsController.GetChannelsAction(req, res).init());

module.exports = router;