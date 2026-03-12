const userService = require('../services/user.service');

exports.getUsers = async (req, reply) => {
  const { search } = req.query;
  const users = await userService.getAllUsers(search);
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

exports.addContact = async (req, reply) => {
  const { userId } = req.params;
  const { contactId } = req.body;

  if (!userId || !contactId) {
    return reply.code(400).send({ error: 'User ID and Contact ID are required' });
  }

  try {
    const updatedUser = await userService.addContact(userId, contactId);
    reply.send(updatedUser.contacts);
  } catch (error) {
    reply.code(500).send({ error: 'Failed to add contact' });
  }
};

exports.getContacts = async (req, reply) => {
  const { userId } = req.params;

  if (!userId) {
    return reply.code(400).send({ error: 'User ID is required' });
  }

  try {
    const contacts = await userService.getContacts(userId);
    reply.send(contacts);
  } catch (error) {
    reply.code(500).send({ error: 'Failed to retrieve contacts' });
  }
};
