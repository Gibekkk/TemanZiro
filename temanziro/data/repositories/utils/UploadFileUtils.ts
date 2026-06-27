export const generateFileName = (fileName: string): string => {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex !== -1 ? fileName.substring(lastDotIndex).toLowerCase() : '';
};

export const normalizeLocalUri = (uri: string): string => {
  if (uri.startsWith('file://')) {
    return uri.replace('file://', '');
  }
  return uri;
};