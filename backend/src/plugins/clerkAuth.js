const { createClerkClient, verifyToken } = require('@clerk/backend');

let clerkClient;

const clerkAuth = async (request, reply) => {
  if (!process.env.CLERK_SECRET_KEY) {
    request.log.error('CLERK_SECRET_KEY is not defined');
    return reply.code(500).send({ error: 'Server configuration error' });
  }

  if (!clerkClient) {
    clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  }

  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      request.log.warn('Unauthorized: No Bearer token provided');
      return reply.code(401).send({ error: 'Unauthorized: Missing token' });
    }

    const token = authHeader.split(' ')[1];
    
    const sessionClaims = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      jwtKey: process.env.CLERK_JWT_KEY,
    });
    
    if (!sessionClaims) {
      request.log.warn('Unauthorized: Token verification failed (no claims)');
      return reply.code(401).send({ error: 'Unauthorized: Invalid token' });
    }

    // Attach claims to request
    request.auth = sessionClaims;
    request.log.info({ userId: sessionClaims.sub || sessionClaims.azp }, 'User authenticated successfully');
  } catch (error) {
    request.log.error({ err: error, message: error.message }, 'Clerk Authentication Exception');
    return reply.code(401).send({ error: `Unauthorized: ${error.message}` });
  }
};

module.exports = clerkAuth;
