
import multer from "multer";

const storage = multer.memoryStorage();
const imageUpload = multer({ storage });

export default imageUpload;
