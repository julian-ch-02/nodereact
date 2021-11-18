const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// multer config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Asset",
  },
});

exports.multerUpload = multer({
  limits: {
    fieldSize: 1024 * 512,
  },
  storage,
});
