const userService = require('../services/user.service');

exports.getUsers = async (req, reply) => {
  const users = await userService.getAllUsers();
  reply.send(users);
};

exports.createUser = async (req, reply) => {
  const user = await userService.createUser(req.body);
  reply.code(201).send(user);
};
