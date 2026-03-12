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

exports.getContacts = async (userId) => {
    const user = await User.findById(userId).populate('contacts', 'username name email');
    return user ? user.contacts : [];
}
