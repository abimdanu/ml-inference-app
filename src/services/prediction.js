const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

// async function predict(model, image) {
//   try {
//       return tf.tidy(() => {
//           // Decode and preprocess image
//           const tensor = tf.node
//               .decodeImage(image)
//               .resizeNearestNeighbor([224, 224])
//               .expandDims()
//               .toFloat();

//           // Run inference and extract result
//           const prediction = model.predict(tensor);
//           const score = prediction.dataSync(); // Convert tensor to array
//           const confidenceScore = Math.max(...score) * 100;

//           // Map index to class
//           const classes = ['BrownSpot', 'Healthy', 'Hispa', 'LeafBlast'];
//           const classResult = tf.argMax(prediction, 1).dataSync()[0];
//           const disease = classes[classResult];

//           // Dispose prediction tensor (other tensors inside `tf.tidy()` are auto-disposed)
//           prediction.dispose();

//           return { disease, confidenceScore };
//       });
//   } catch (error) {
//       console.error(error);
//       throw error;
//   }
// }

async function predictionService(req) {
  try {
    const imagePath = req.file.path;
    const image = await readImageFile(imagePath);

    console.log('Before loading model:', tf.memory()); // 🔍 Check memory before loading model

    // Load model inside function scope to ensure it is disposed later
    const modelPathOrUrl = `file://${path.join(__dirname, '../..', 'model', 'model.json')}`;
    console.log('Loading model...');
    let model = await tf.loadLayersModel(modelPathOrUrl);
    console.log('Model loaded.');
    console.log('After loading model:', tf.memory()); // 🔍 Check memory after loading model

    const predictionData = tf.tidy(() => {
      console.log('Before inference:', tf.memory());

      // Decode and preprocess image
      const tensor = tf.node
        .decodeImage(image)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat();

      // Run inference
      const prediction = model.predict(tensor);

      // Extract results
      const scores = prediction.dataSync();
      const classIndexTensor = tf.argMax(prediction, 1);
      const classResult = classIndexTensor.dataSync()[0];

      // Dispose intermediate tensors
      tensor.dispose();
      prediction.dispose();
      classIndexTensor.dispose();

      // Map class index to disease name
      const classes = ['BrownSpot', 'Healthy', 'Hispa', 'LeafBlast'];
      const disease = classes[classResult];

      console.log('After inference:', tf.memory());

      return { disease, confidenceScore: Math.max(...scores) * 100 };
    });

    await deleteImageFile(imagePath);

    // Dispose the model to free memory
    tf.dispose(model);
    model = null;
    console.log('After disposing model:', tf.memory());

    return predictionData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function readImageFile(filePath) {
  return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
          if (err) reject(new Error(`Error reading file: ${err.message}`));
          else resolve(data);
      });
  });
}

function deleteImageFile(filePath) {
  return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
          if (err) reject(new Error(`Error deleting file: ${err.message}`));
          else resolve();
      });
  });
}

module.exports = { predictionService };  