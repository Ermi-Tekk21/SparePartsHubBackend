declare module "cloudinary" {
  export const v2: {
    config: (config: {
      cloud_name: string;
      api_key: string;
      api_secret: string;
    }) => void;
    uploader: {
      upload_stream: (
        options: { resource_type: string; folder: string },
        callback: (error: any, result: { secure_url: string }) => void
      ) => NodeJS.WritableStream;
    };
  };
}