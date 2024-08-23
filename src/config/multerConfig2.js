import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinaryConfig2.js";

// Set up Cloudinary storage configuration for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // Use the Cloudinary instance from the config
  params: {
    folder: "uploads", // Specify the folder name in Cloudinary where files will be stored
    public_id: (req, file) => `image-${Date.now()}-${file.originalname}`, // Generate a unique public ID for each file
  },
});

// Define a file filter to ensure only images are accepted
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    // Reject the file with an error message if it's not an allowed type
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed."
      ),
      false
    );
  }
};

// Configure Multer with the defined storage and file filter
const imageUpload = multer({
  storage: storage, // Use the Cloudinary storage setup
  fileFilter: fileFilter, // Apply the file filter to restrict file types
});

export default imageUpload;
