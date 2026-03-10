// src/routes/user/index.js
const userSchema = require('./schema');
const userController = require('../../controller/user.controller');

async function userRoutes(fastify, options) {
  fastify.get('/', { schema: userSchema.getUsers }, userController.getUsers);
  fastify.post('/', { schema: userSchema.createUser }, userController.createUser);
}

module.exports = userRoutes;
