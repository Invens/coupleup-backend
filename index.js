const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const chatbotRoutes = require('./routes/botRoute');
const cluster = require('cluster');
const os = require('os');
require('dotenv').config(); // To use environment variables

const numCPUs = os.cpus().length; // Get the number of CPU cores

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for dying workers and fork a new one if any worker dies
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died, starting a new worker...`);
    cluster.fork();
  });
} else {
  // Worker processes will run this block

  const app = express();

  // Middleware
  app.use(bodyParser.json());
  app.use(cors());
  app.use('/uploads', express.static('uploads')); // Serve static files

  // Routes
  app.use('/api/chatbots', chatbotRoutes);

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} is running on port ${PORT}`);
  });
}
