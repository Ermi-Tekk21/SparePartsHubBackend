import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

export class CloudinaryService {
  constructor() {
    if (process.env.NODE_ENV !== "test") {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
        api_key: process.env.CLOUDINARY_API_KEY!,
        api_secret: process.env.CLOUDINARY_API_SECRET!,
      });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (process.env.NODE_ENV === "test") {
      return `https://mock.cloudinary.com/sparepartshub/test-${file.originalname}`;
    }
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "sparepartshub" },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload failed"));
          } else {
            resolve(result.secure_url);
          }
        }
      );
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(stream);
    });
  }
}