import { cloudinary } from '../config/cloudinary.js';
import { env } from '../config/env.js';
import { ApiError } from './apiError.js';

export async function uploadBuffer(file, folder = 'connecthub') {
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    throw new ApiError(503, 'Cloudinary credentials are required for image uploads');
  }

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'image',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }]
  });

  return { url: result.secure_url, publicId: result.public_id, width: result.width, height: result.height };
}
