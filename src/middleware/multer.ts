import multer from "multer";
import { randomBytes } from "crypto";
import path from 'path';

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: (arg0: null, arg1: string) => void) {
    cb(null, 'src/uploads/'); // Define the upload directory
  },
  filename: function (req: any, file: { originalname: string; }, cb: (arg0: null, arg1: string) => void) {
    const extname = path.extname(file.originalname);
    cb(null, Date.now() + extname); // Rename the file with a unique name
  },
});

export const upload = multer({ storage: storage });