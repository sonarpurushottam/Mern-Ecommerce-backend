// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import multer from "multer";
// import cloudinary from "./cloudinaryConfig.js";

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary.v2,
//   params: {
//     folder: "profile_pics",
//     format: async (req, file) => "jpeg", // or "png", "jpg"
//     public_id: (req, file) => `profile-${Date.now()}`,
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedMimeTypes = [
//     "image/jpeg",
//     "image/png",
//     "image/gif",
//     "image/webp",
//   ];
//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error(
//         "Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed."
//       ),
//       false
//     );
//   }
// };
import multer from "multer";

const storage = multer.memoryStorage();
const imageUpload = multer({ storage });

export default imageUpload;
