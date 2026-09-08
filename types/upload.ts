export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'] as const;
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

export type SupportedImageType = (typeof SUPPORTED_IMAGE_TYPES)[number];
export type UploadStatus = 'ready' | 'scanning' | 'complete' | 'error';

export type UploadItem = {
  id: string;
  file: File;
  previewUrl: string;
  status: UploadStatus;
  error?: string;
};
