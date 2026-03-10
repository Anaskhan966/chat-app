const Fastify = require('fastify');
const app = Fastify({ logger: true });
const userRoutes = require('./routes/user/index.js');
const messageRoutes = require('./routes/messages/index.js');

app.register(require('@fastify/cors'), {
  origin: '*',
});

app.register(require('./plugins/db'));
app.register(userRoutes, { prefix: '/api/users' });
app.register(messageRoutes, { prefix: '/api/messages' });

module.exports = { app };
