const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
  folder: process.env.CLOUDINARY_FOLDER
};

export default cloudinaryConfig; 