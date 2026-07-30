const cloudinary = require("cloudinary").v2;
const multerStorage = require("multer-storage-cloudinary");

// Handle both v4 named export and legacy default export automatically
const CloudinaryStorage = multerStorage.CloudinaryStorage || multerStorage;

// 2. Fix for Cloudinary SDK v2 + multer-storage-cloudinary v2 bridge!
if (!cloudinary.v2) {
    cloudinary.v2 = cloudinary;
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "wanderLust_Dev",
        allowedFormats: ["png", "jpg", "jpeg"],
    },
});

module.exports = {
    cloudinary,
    storage,
};