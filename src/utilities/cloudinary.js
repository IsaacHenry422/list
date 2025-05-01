// utilities/cloudinary.js
const cloudinary = require('cloudinary').v2;
const config = require('../src/configuration/config'); // Assuming your config file has Cloudinary credentials

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
