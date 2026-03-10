require('dotenv').config();
const mongoose = require('mongoose');
const { app } = require('./src/app');

const start = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.log.info('✅ Database connected');

    // Start Fastify using its own listen method
    const PORT = process.env.PORT || 3000;
    await app.listen({ port: PORT, host: '0.0.0.0' });
    
    app.log.info(`Server running at http://localhost:${PORT}/`);

  } catch (err) {
    app.log.error('Error starting server:', err);
    process.exit(1);
  }
};

start();
