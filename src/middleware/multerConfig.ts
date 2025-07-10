import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG and PNG files are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export const uploadFields = upload.fields([
  { name: "companyLogo", maxCount: 1 },
  { name: "digitalSignature", maxCount: 1 },
  { name: "stamp", maxCount: 1 },
]);