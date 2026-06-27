export const generateFileName = (originalFileName: string, fileType:string, userName: string): string => {
    const timestamp = Date.now();

    const safeFileType = fileType.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const safeUserName = userName.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    const lastDotIndex = originalFileName.lastIndexOf('.');
    const extension = lastDotIndex !== -1 ? originalFileName.substring(lastDotIndex) : '';
    
    return `${safeUserName}_${safeFileType}_${timestamp}${extension}`;
};

export const normalizeLocalUri = (uri: string): string => {
  if (uri.startsWith('file://')) {
    return uri.replace('file://', '');
  }
  return uri;
};