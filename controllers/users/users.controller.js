const GetUsersAction = require('./actions/get-users.action');
const GetUserAction = require('./actions/get-user.action');
const UpdateUserAction = require('./actions/update-user.action');
const GetLoggedUserAction = require('./actions/get-logged-user.action');

module.exports = {
    GetUsersAction: GetUsersAction,
    GetUserAction: GetUserAction,
    UpdateUserAction: UpdateUserAction,
    GetLoggedUserAction: GetLoggedUserAction
};