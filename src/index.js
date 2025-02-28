const app = require('./app/web');
require('dotenv').config();

const PORT = 3000;

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${ PORT }`);
});
