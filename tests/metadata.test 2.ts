import { describe, expect, it } from 'vitest';
import { scanImage } from '@/lib/metadata/scanner';
import { cleanImage, verifyCleanedImage } from '@/lib/metadata/cleaner';
import { jpegWithExif, pngWithText, webpWithExif } from './helpers';

describe('metadata engine', () => {
  it('detects JPEG EXIF metadata', async () => {
    const result = await scanImage(jpegWithExif());
    expect(result.entries.length).toBeGreaterThan(0);
    expect(result.entries.some((entry) => entry.category === 'device')).toBe(true);
  });

  it('detects PNG text metadata', async () => {
    const result = await scanImage(pngWithText());
    expect(result.entries.length).toBe(1);
  });

  it('detects WebP EXIF chunks', async () => {
    const result = await scanImage(webpWithExif());
    expect(result.entries.length).toBeGreaterThan(0);
  });

  it('removes JPEG metadata and verifies the result', async () => {
    const cleaned = await cleanImage(jpegWithExif(), 'standard');
    const verification = await verifyCleanedImage(cleaned);
    expect(verification.verified).toBe(true);
    expect(verification.remainingMetadata).toBe(0);
  });

  it('removes PNG text metadata and verifies the result', async () => {
    const cleaned = await cleanImage(pngWithText(), 'maximum');
    const verification = await verifyCleanedImage(cleaned);
    expect(verification.verified).toBe(true);
  });

  it('removes WebP EXIF chunks and verifies the result', async () => {
    const cleaned = await cleanImage(webpWithExif(), 'standard');
    const verification = await verifyCleanedImage(cleaned);
    expect(verification.verified).toBe(true);
  });
});
