exports.getUsers = {
  querystring: {
    type: 'object',
    properties: {
      search: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string', format: 'email' },
        }
      }
    }
  }
};

exports.createUser = {
  body: {
    type: 'object',
    required: ['username', 'password', 'email', 'name'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
      email: { type: 'string', format: 'email' },
      name: { type: 'string' },
      clerkId: { type: 'string' }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string', format: 'email' },
        name: { type: 'string' },
        clerkId: { type: 'string' }
      }
    },
    200: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string', format: 'email' },
        name: { type: 'string' },
        clerkId: { type: 'string' }
      }
    }
  }
};
