import { apiClient } from './apiClient';

/**
 * Upload image file to server
 * @param file - Image file to upload
 * @returns Promise<string> - URL of uploaded image
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log('Uploading file:', file.name, file.type, file.size);
    
    const response = await apiClient.post('/admin/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Upload response:', response.data);

    // Response format: { data: { url: "http://.../uploads/xxx.png" } }
    const url = response.data?.data?.url || response.data?.url;
    
    if (!url) {
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid response: missing image URL');
    }

    return url;
  } catch (error: any) {
    console.error('Upload failed:', error);
    console.error('Error response:', error.response?.data);
    const errorMsg = error.response?.data?.error?.message || error.message || 'Failed to upload image';
    throw new Error(errorMsg);
  }
}

/**
 * Validate if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Validate image size (default max 5MB)
 */
export function validateImageSize(file: File, maxSizeMB: number = 5): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
}
