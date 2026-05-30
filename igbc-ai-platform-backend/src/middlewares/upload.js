import fs from "fs";
import multer from "multer";
import path from "path";

const uploadDirectory = path.resolve("uploads", "documents");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const allowedExtensions = new Set([".pdf", ".xlsx", ".xls", ".png", ".jpg", ".jpeg"]);
const allowedMimeTypes = new Set([
  "application/pdf",
  "application/octet-stream",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "image/png",
  "image/jpg",
  "image/jpeg",
]);

const sanitizeFileName = (fileName) =>
  fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const baseName = sanitizeFileName(file.originalname) || "document";
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    cb(null, `${baseName}-${uniqueSuffix}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.has(extension) || !allowedMimeTypes.has(file.mimetype)) {
    const error = new Error(
      "Unsupported file type. Allowed file types: pdf, xlsx, xls, png, jpg, jpeg"
    );
    error.statusCode = 400;
    return cb(error);
  }

  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

export default upload;
export { uploadDirectory };
