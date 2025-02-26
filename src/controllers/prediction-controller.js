const { predictionService } = require('../services/prediction');

async function predictionController(req, res) {
  try {
    const predictionData = await predictionService(req);
    res.status(201)
      .json({
        success: true,
        message: 'Prediction success',
        data: predictionData,
      });
  } catch (error) {
    res.status(500)
      .json({
        success: false,
        message: 'Prediction failed: ' + error.message,
      });
  }
}

module.exports = {
  predictionController,
};