const { createClerkClient } = require('@clerk/backend');

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const clerkAuth = async (request, reply) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const sessionClaims = await clerkClient.verifyToken(token);

    if (!sessionClaims) {
      return reply.code(401).send({ error: 'Invalid session' });
    }

    request.auth = sessionClaims;
  } catch (error) {
    console.error('Clerk Auth Error:', error);
    return reply.code(401).send({ error: 'Unauthorized' });
  }
};

module.exports = clerkAuth;
