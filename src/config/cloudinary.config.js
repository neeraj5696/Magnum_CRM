import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_FOLDER } from '@env';

const cloudinaryConfig = {
  cloudName: CLOUDINARY_CLOUD_NAME||'dtcwwgcsp',
  uploadPreset: CLOUDINARY_UPLOAD_PRESET||'magnum_crm_preset',
  folder: 'demo'
};

console.log('Cloudinary config loaded:', cloudinaryConfig);

export default cloudinaryConfig; 