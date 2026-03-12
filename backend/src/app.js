const Fastify = require('fastify');
const app = Fastify({ logger: true });
const userRoutes = require('./routes/user/index.js');
const messageRoutes = require('./routes/messages/index.js');
const clerkAuth = require('./plugins/clerkAuth');

app.register(require('@fastify/cors'), {
  origin: '*',
});

app.decorate('clerkAuth', clerkAuth);

app.register(require('./plugins/db'));

app.register(userRoutes, { prefix: '/api/users' });

// Protected message routes
app.register(async (instance) => {
  instance.addHook('preHandler', async (request, reply) => {
    try {
      await instance.clerkAuth(request, reply);
    } catch (err) {
      request.log.error(err, 'clerkAuth hook failed');
      return reply.code(401).send({ error: 'Unauthorized', details: err.message });
    }
  });
  instance.register(messageRoutes);
}, { prefix: '/api/messages' });

module.exports = { app };
