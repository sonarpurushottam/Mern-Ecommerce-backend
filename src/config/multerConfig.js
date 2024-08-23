import multer from "multer";

// Set up Multer to store uploaded files in memory
const storage = multer.memoryStorage();

// Configure Multer with the in-memory storage setup
const imageUpload = multer({ storage });


export default imageUpload;
