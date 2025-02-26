const tf = require('@tensorflow/tfjs-node');
const path = require('path');

let model = null;

async function getModel() {
  console.log('Before loading model:', tf.memory()); // 🔍 Check memory before model is loaded

  if (!model) {

    const modelPathOrUrl = `file://${path.join(__dirname, '../..', 'model', 'model.json')}`;
    console.log('Loading model...');
    model = await tf.loadLayersModel(modelPathOrUrl);
    
    console.log('Model loaded.');
    console.log('After loading model:', tf.memory()); // 🔍 Check memory after model is loaded
  }

  return model;
}

module.exports = { getModel }