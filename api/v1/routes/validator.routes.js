const express = require('express');
const router = express.Router();
const validatorController = require('../../../controllers/validator/validator.controller');

router.post('/check-email', (req, res) => new validatorController.CheckEmailAction(req, res));

module.exports = router;