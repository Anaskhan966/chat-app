const userService = require('../services/user.service');

exports.getUsers = async (req, reply) => {
  const users = await userService.getAllUsers();
  reply.send(users);
};

const User = require('../models/user.model');

exports.createUser = async (req, reply) => {
  const { email, clerkId } = req.body;
  
  // If it's a sync request from Clerk, check if user exists
  if (clerkId) {
    let user = await User.findOne({ $or: [{ clerkId }, { email }] });
    if (user) {
      // Update existing user with clerkId if they don't have it
      if (!user.clerkId) {
        user.clerkId = clerkId;
        await user.save();
      }
      return reply.send(user);
    }
  }

  const user = await userService.createUser(req.body);
  reply.code(201).send(user);
};
