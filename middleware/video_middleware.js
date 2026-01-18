import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/videos";

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

const videoFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("video/")) {
    cb(new Error("Only video files are allowed"), false);
  } else {
    cb(null, true);
  }
};

export const uploadVideo = multer({
  storage,
  videoFilter,
  limits: {
    fileSize: 1024 * 1024 * 500, // 500 MB
  },
});
