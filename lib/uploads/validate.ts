import { MAX_FILE_SIZE, SUPPORTED_IMAGE_TYPES, type SupportedImageType } from '../../types/upload';

export type ValidationResult =
  | { valid: true; type: SupportedImageType }
  | { valid: false; error: string };

export function validateImageFile(file: File): ValidationResult {
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type as SupportedImageType)) {
    return { valid: false, error: 'Unsupported format. Use JPG, PNG or WebP.' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'This file appears to be empty or unreadable.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'This image is larger than 50 MB.' };
  }

  return { valid: true, type: file.type as SupportedImageType };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
