import cloudinary from "cloudinary";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Configure Cloudinary with your cloud name, API key, and API secret
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to handle file uploads to Cloudinary
const handleUpload = (file, folder) => {
  return new Promise((resolve, reject) => {
    // Upload the file to Cloudinary
    cloudinary.v2.uploader.upload(file, { folder }, (error, result) => {
      if (error) {
        // If something goes wrong, reject the promise with the error
        reject(error);
      } else {
        // If everything is good, resolve the promise with the result
        resolve(result);
      }
    });
  });
};

// Function to handle file deletions from Cloudinary
const handleDelete = (publicId) => {
  return new Promise((resolve, reject) => {
    // Delete the file from Cloudinary using its public ID
    cloudinary.v2.uploader.destroy(publicId, (error, result) => {
      if (error) {
        // If something goes wrong, reject the promise with the error
        reject(error);
      } else {
        // If everything is good, resolve the promise with the result
        resolve(result);
      }
    });
  });
};

export { cloudinary, handleUpload, handleDelete };
