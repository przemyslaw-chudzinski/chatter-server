const express = require('express');
const router = express.Router();
const validatorController = require('../../../controllers/validator/validator.controller');

/**
 * @desc It checks email is valid
 */
router.post('/check-email', (req, res) => new validatorController.CheckEmailAction(req, res));

module.exports = router;