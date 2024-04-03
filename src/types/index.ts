export type MimeTypes =
  | 'image/png'
  | 'image/jpeg'
  | 'image/svg+xml'
  | 'image/gif'
  | 'image/webp'
  | 'image/bmp'
  | 'image/tiff'
  | 'image/vnd.microsoft.icon';

export type UploadFileTransportType = {
  uint8array: Uint8Array;
  filename: string;
  mimetype: MimeTypes;
};
