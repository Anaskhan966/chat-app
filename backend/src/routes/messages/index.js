const messageController = require("../../controller/message.controller");
const messageSchema = require('./schema');

async function messageRoutes(fastify, options) {
  fastify.get('/',{schema: messageSchema.getMessagesSchema}, messageController.getMessages);
  fastify.post('/', {schema: messageSchema.createMessageSchema}, messageController.createMessage);
  fastify.get('/:userId', {schema: messageSchema.getMessagesByUserSchema}, messageController.getLatestMessagesFromChatByUser)
  fastify.delete('/:messageId', {schema: messageSchema.deleteMessageSchema}, messageController.deleteMessage);
};

module.exports = messageRoutes;