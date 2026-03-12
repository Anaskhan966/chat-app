const Message = require('../models/message.model');
const User = require('../models/user.model');

exports.getMessages = async (req, reply) => {
  try {
    const messages = await Message.find()
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .sort({ timestamp: -1 });
    reply.send(messages);
  } catch (error) {
    reply.code(500).send({ error: 'Failed to retrieve messages' });
  }
};

exports.createMessage = async (req, reply) => {
  const { sender, receiver, content } = req.body;

  if (!sender || !receiver || !content) {
    return reply.code(400).send({ error: 'Sender, receiver, and content are required' });
  }

  try {
    const receiverExists = await User.findById(receiver);
    if (!receiverExists) {
      return reply.code(404).send({ error: 'Receiver not found in database' });
    }

    const message = new Message({
      sender,
      receiver,
      content
    });

    await message.save();
    reply.code(201).send(message);
  } catch (error) {
    reply.code(500).send({ error: 'Failed to create message' });
  }
};

// Get a list of conversations where the logged-in user is either sender or receiver, showing:
// The latest message for each contact.
// Contact info (not the user themselves).
// Optional: unread count, pinned chats, archived, etc. (future improvements).


exports.getLatestMessagesFromChatByUser = async (req, reply) => {
    const { userId } = req.params;

    if (!userId) {
        return reply.code(400).send({ error: 'User ID is required' });
    }

    try {
        const messages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userId },
                        { receiver: userId }
                    ]
                }
            },
            {
                $addFields: {
                    contactId: {
                        $cond: [
                            { $eq: ['$sender', userId] },
                            '$receiver',
                            '$sender'
                        ]
                    }
                }
            },
            {
                $sort: { timestamp: -1 } // latest messages first
            },
            {
                $group: {
                    _id: '$contactId',
                    latestMessage: { $first: '$$ROOT' }
                }
            },
            {
                $replaceRoot: { newRoot: '$latestMessage' }
            }
        ]);

        // Populate sender and receiver info
        await Message.populate(messages, [
            { path: 'sender', select: 'username name' },
            { path: 'receiver', select: 'username name' }
        ]);

        // Optional: format response to make it clearer who the "contact" is
        const chats = messages.map(msg => {
            const contact =
                msg.sender._id.toString() === userId
                    ? msg.receiver
                    : msg.sender;

            return {
                contact, // { _id, username, name }
                message: msg,
            };
        });
        console.log(chats);
        reply.send(chats);
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Failed to retrieve latest messages for user' });
    }
};



exports.getChatMessages = async (req, reply) => {
  const { senderId, receiverId } = req.params;

  if (!senderId || !receiverId) {
    return reply.code(400).send({ error: 'Sender ID and Receiver ID are required' });
  }

  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    })
      .populate('sender', 'username name')
      .populate('receiver', 'username name')
      .sort({ timestamp: 1 });

    reply.send(messages);
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Failed to retrieve messages' });
  }
};

exports.deleteMessage = async (req, reply) => {
  const { messageId } = req.params;

  if (!messageId) {
    return reply.code(400).send({ error: 'Message ID is required' });
  }

  try {
    const message = await Message.findByIdAndDelete(messageId);
    if (!message) {
      return reply.code(404).send({ error: 'Message not found' });
    }
    reply.send({ message: 'Message deleted successfully' });
  }
  catch (error) {
    reply.code(500).send({ error: 'Failed to delete message' });
  }
};