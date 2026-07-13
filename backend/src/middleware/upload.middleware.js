import multer from "multer";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // Maximum file size: 25 MB

export const upload = multer({
  // Store uploaded files temporarily in memory
  storage: multer.memoryStorage(),

  // Limit the maximum file size
  limits: { fileSize: MAX_FILE_SIZE },

  // Allow only image and video files
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");

    // Reject unsupported file types
    if (!isImage && !isVideo) {
      cb(new Error("Only image and video uploads are allowed"));
      return;
    }

    // Accept the file
    cb(null, true);
  },
});
