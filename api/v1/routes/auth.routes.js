const express = require('express');
const router = express.Router();
const authController = require('../../../controllers/auth/auth.controller');

router.post('/sign-in', (req, res) => new authController.SingInAction(req, res).init());
router.post('/sign-up', (req, res) => new authController.SignUpAction(req, res).init());

module.exports = router;