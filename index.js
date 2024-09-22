const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const chatbotRoutes = require('./routes/botRoute');
const cluster = require('cluster');
const os = require('os');
// require('dotenv').config(); // To use environment variables

const numCPUs = os.cpus().length; // Get the number of CPU cores

// Global error handling for uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`, err);
  // Optionally terminate process or attempt graceful recovery
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`Unhandled Rejection: ${reason}`, promise);
  // Optionally terminate process or attempt graceful recovery
});

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for dying workers and fork a new one if any worker dies
  cluster.on('exit', (worker, code, signal) => {
    console.error(`Worker ${worker.process.pid} died with exit code ${code}, signal ${signal}`);
    console.log('Starting a new worker...');
    setTimeout(() => {
      cluster.fork(); // Delay restart to avoid rapid crashing
    }, 5000); // 5-second delay
  });

} else {
  // Worker processes will run this block

  const app = express();

  // Middleware
  app.use(bodyParser.json());
  app.use(cors());

  // Serve static files
  app.use('/uploads', express.static('uploads'));

  // Routes
  app.use('/api/chatbots', chatbotRoutes);

  // Catch-all route for undefined routes
  app.use((req, res, next) => {
    res.status(404).send({ message: 'Route not found' });
  });

  // Global error handler middleware
  app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
      error: 'Something went wrong!',
      message: err.message,
    });
  });

  // Start server
  const PORT = 5000;
  const server = app.listen(PORT, () => {
    console.log(`Worker ${process.pid} is running on port ${PORT}`);
  });

  // Graceful shutdown handling for the worker
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });
}
