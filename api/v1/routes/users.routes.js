const express = require('express');
const router = express.Router();
const usersController = require('../../../controllers/users/users.controller');

/**
 * @desc It returns logged user object
 */
router.get('/logged-user', (req, res) => new usersController.GetLoggedUserAction(req, res).init());
/**
 * @desc It returns all users excluding logged user
 */
router.get('/', (req, res) => new usersController.GetUsersAction(req, res).init());
/**
 * @desc It updates user's profile
 */
router.post('/update-profile', (req, res) => new usersController.UpdateUserAction(req, res).init());
/**
 * @desc It returns user avatar object
 */
router.get('/avatar', (req, res) => new usersController.GetAvatarAction(req, res).init());
/**
 *
 */
router.get('/:id', (req, res) => new usersController.GetUserAction(req, res).init());

module.exports = router;