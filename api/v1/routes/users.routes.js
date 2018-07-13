const express = require('express');
const router = express.Router();
const usersController = require('../../../controllers/users/users.controller');

router.get('/:id', (req, res) => new usersController.GetUserAction(req, res));
router.get('/', (req, res) => new usersController.GetUsersAction(req, res));

module.exports = router;