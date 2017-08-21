const User = require('../models/user').User;
const UserService = require('../services/userService');

class UserController {
  static register(req, res) {
    UserService.register(req.body.username, req.body.password, res);
  }

  static login(req, res) {
    UserService.login(req.body.username, req.body.password, res);
  }
};

module.exports = UserController;
