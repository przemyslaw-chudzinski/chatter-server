const express = require('express');
const router = express.Router();
const usersController = require('../../../controllers/users/users.controller');

/**
 *
 */
router.get('/logged-user', (req, res) => new usersController.GetLoggedUserAction(req, res));
/**
 *
 */
router.get('/', (req, res) => new usersController.GetUsersAction(req, res));
/**
 *
 */
router.post('/update-profile', (req, res) => new usersController.UpdateUserAction(req, res));
/**
 * @desc It returns user avatar object
 */
router.get('/avatar', (req, res) => new usersController.GetAvatarAction(req, res));
/**
 *
 */
router.get('/:id', (req, res) => new usersController.GetUserAction(req, res));
module.exports = router;