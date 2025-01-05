import api from './api';

export const uploadFile = async (file, type = 'avatar') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.url;
  } catch (error) {
    throw new Error('Failed to upload file');
  }
}; 