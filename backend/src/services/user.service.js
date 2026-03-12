const User = require('../models/user.model');

exports.getAllUsers = (search) => {
    const query = search ? {
        $or: [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ]
    } : {};
    return User.find(query);
}

exports.createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
}

exports.addContact = async (userId, contactId) => {
    return await User.findByIdAndUpdate(
        userId,
        { $addToSet: { contacts: contactId } },
        { new: true }
    ).populate('contacts', 'username name email');
}

const Message = require('../models/message.model');

exports.getContacts = async (userId) => {
    const user = await User.findById(userId).populate('contacts', 'username name email');
    if (!user) return [];

    const contactsWithLastMessage = await Promise.all(user.contacts.map(async (contact) => {
        const lastMessage = await Message.findOne({
            $or: [
                { sender: userId, receiver: contact._id },
                { sender: contact._id, receiver: userId }
            ]
        }).sort({ timestamp: -1 });

        return {
            ...contact.toObject(),
            lastMessage: lastMessage ? lastMessage.content : null,
            lastMessageTime: lastMessage ? lastMessage.timestamp : null
        };
    }));

    // Sort by last message time, most recent first
    return contactsWithLastMessage.sort((a, b) => {
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });
}
