const express = require('express');
const router = new express.Router();

const {
  predictionController
} = require('../controllers/prediction-controller');

// Multer configuration
const upload = require('../configs/multer');

// Predict
router.post('/predict',
  upload.single('prediction-image'),
  (req, res) => {
    predictionController(req, res);
  }
);

module.exports = router;