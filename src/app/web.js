const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const router = require('../routes/routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Load model when app starts
async function loadModel() {
  console.log('⏳ Loading TensorFlow model...');
  const modelPath = `file://${path.join(__dirname, '../..', 'model', 'model.json')}`;
  app.locals.model = await tf.loadLayersModel(modelPath);
  console.log('✅ Model loaded successfully.');
}

loadModel().catch((err) => {
  console.error('❌ Error loading model:', err);
});

app.use(router);
module.exports = app;