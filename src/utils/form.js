import { Platform } from 'react-native';

export const createFormData = (photo) => {
  const data = new FormData();
  data.append('file', {
    name: photo.fileName,
    type: photo.type,
    uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
  });
  return data;
};