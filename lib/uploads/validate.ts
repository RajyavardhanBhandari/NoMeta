import { MAX_FILE_SIZE, SUPPORTED_IMAGE_TYPES, type SupportedImageType } from '@/types/upload';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ValidationResult {
  if (!file || file.size === 0) {
    return { valid: false, error: 'File is empty.' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File exceeds the ${formatFileSize(MAX_FILE_SIZE)} limit.` };
  }
  if (!(SUPPORTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return { valid: false, error: `Unsupported file type: ${file.type}. Supported: JPEG, PNG, WebP, HEIC.` };
  }
  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
