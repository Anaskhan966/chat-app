const User = require('../models/user.model');

exports.getAllUsers = () => {
    const user = User.find();
    return user;
}

exports.createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
}