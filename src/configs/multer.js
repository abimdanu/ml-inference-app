const multer = require('multer');
const path = require('path');
require('dotenv').config();

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/uploads/');
  },
  filename: function (req, file, cb) {
    const suffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + suffix + path.extname(file.originalname));
  }
});

const memoryStorage = multer.memoryStorage();

const upload = multer({
  storage: diskStorage
});

module.exports = upload;
