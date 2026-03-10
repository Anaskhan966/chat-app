// you cann also you fastify plugin for mogodb
const fp = require('fastify-plugin');
const mongoose = require('mongoose');

async function dbConnector(fastify, options) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    fastify.decorate('mongoose', mongoose);
    fastify.log.info('✅ MongoDB connected');
  } catch (err) {
    fastify.log.error('MongoDB connection error:', err);
    throw err;
  }
}

module.exports = fp(dbConnector);
