const app = require('./app/web');
require('dotenv').config();


// ✅ Routine Garbage Collection (every 2 minutes)
if (global.gc) {
  setInterval(() => {
    console.log('🔄 Running manual garbage collection...');
    global.gc();
    console.log('✅ Garbage collection done.');
  }, 5000); // 2 minutes (120000 ms)
} else {
  console.warn('⚠️ GC not exposed. Run the server with: node --expose-gc index.js');
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${ PORT }`);
});

// const cluster = require('cluster');
// const os = require('os');

// if (cluster.isMaster) {
//   // Get CPU limit from Kubernetes environment variable or fallback to all available cores
//   const numCPUs = process.env.USE_CPUS
//     ? Math.min(os.cpus().length, parseInt(process.env.USE_CPUS, 10))
//     : os.cpus().length;

//   console.log(`🖥️ Master process is running (PID: ${process.pid}). Forking ${numCPUs} workers...`);

//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.error(`⚠️ Worker ${worker.process.pid} died. Restarting...`);
//     cluster.fork();
//   });

// } else {
//   // Workers execute the Express app
//   console.log(`🔹 Worker ${process.pid} started`);
//   require('./app/web'); // Each worker loads the Express server
// }