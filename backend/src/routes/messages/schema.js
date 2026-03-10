exports.getMessagesSchema = {
    response: {
        200: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
            _id: { type: 'string' },
            sender: { type: 'string' },
            receiver: { type: 'string' },
            content: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' }
            }
        }
        }
    }
};

exports.createMessageSchema = {
    body: {
        type: 'object',
        required: ['sender', 'receiver', 'content'],
        properties: {
            sender: { type: 'string' },
            receiver: { type: 'string' },
            content: { type: 'string' }
        }
    },
    response: {
        201: {
            type: 'object',
            properties: {
                _id: { type: 'string' },
                sender: { type: 'string' },
                receiver: { type: 'string' },
                content: { type: 'string' },
                timestamp: { type: 'string', format: 'date-time' }
            }
        }
    }
};
exports.getMessagesByUserSchema = {
    params: {
        type: 'object',
        properties: {
            userId: { type: 'string' }
        },
        required: ['userId']
    },
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    sender: { type: 'string' },
                    receiver: { type: 'string' },
                    content: { type: 'string' },
                    timestamp: { type: 'string', format: 'date-time' }
                }
            }
        }
    }
};
exports.deleteMessageSchema = {
    params: {
        type: 'object',
        properties: {
            messageId: { type: 'string' }
        },
        required: ['messageId']
    },
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
    }
};