// const express = require('express');
// const tf = require('@tensorflow/tfjs-node');
// const path = require('path');
// const router = require('../routes/routes');

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ Load model when app starts
// async function loadModel() {
//   console.log('⏳ Loading TensorFlow model...');
//   const modelPath = `file://${path.join(__dirname, '../..', 'model', 'model.json')}`;
//   app.locals.model = await tf.loadLayersModel(modelPath);
//   console.log('✅ Model loaded successfully.');
// }

// loadModel().catch((err) => {
//   console.error('❌ Error loading model:', err);
// });

// app.use(router);
// module.exports = app;

const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const router = require('../routes/routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Load model when each worker starts
async function loadModel() {
  try {
    console.log(`⏳ [Worker ${process.pid}] Loading TensorFlow model...`);
    const modelPath = `file://${path.join(__dirname, '../..', 'model', 'model.json')}`;
    app.locals.model = await tf.loadLayersModel(modelPath);
    console.log(`✅ [Worker ${process.pid}] Model loaded successfully.`);
  } catch (err) {
    console.error(`❌ [Worker ${process.pid}] Error loading model:`, err);
  }
}

// Load model on app start
loadModel();

app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 [Worker ${process.pid}] Server is running on http://localhost:${PORT}`);
});

module.exports = app;