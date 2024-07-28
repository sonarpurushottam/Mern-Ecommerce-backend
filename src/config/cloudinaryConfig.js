import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handleUpload = (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(file, { folder }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

const handleDelete = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

export { cloudinary, handleUpload, handleDelete };
