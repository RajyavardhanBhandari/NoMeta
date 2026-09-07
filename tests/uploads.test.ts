import { describe, expect, it } from 'vitest';
import { MAX_FILE_SIZE, SUPPORTED_IMAGE_TYPES } from '@/types/upload';
import { formatFileSize, validateImageFile } from '@/lib/uploads/validate';

describe('upload validation', () => {
  it('accepts supported image types', () => {
    for (const type of SUPPORTED_IMAGE_TYPES) {
      const result = validateImageFile(new File([new Uint8Array([1])], 'x', { type }));
      expect(result.valid).toBe(true);
    }
  });

  it('rejects unsupported types', () => {
    const result = validateImageFile(new File([new Uint8Array([1])], 'x.gif', { type: 'image/gif' }));
    expect(result.valid).toBe(false);
  });

  it('rejects empty and oversized files', () => {
    expect(validateImageFile(new File([], 'empty.jpg', { type: 'image/jpeg' })).valid).toBe(false);
    const oversized = new File([new Uint8Array(MAX_FILE_SIZE + 1)], 'large.jpg', { type: 'image/jpeg' });
    expect(validateImageFile(oversized).valid).toBe(false);
  });

  it('formats file sizes consistently', () => {
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(1024)).toBe('1.0 KB');
  });
});
