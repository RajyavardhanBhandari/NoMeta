import { describe, expect, it } from 'vitest';
import { scanImage } from '@/lib/metadata/scanner';
import { cleanImage, verifyCleanedImage } from '@/lib/metadata/cleaner';
import { jpegWithC2pa, jpegWithExif, pngWithC2pa, pngWithText, webpWithC2pa, webpWithExif } from './helpers';

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

  it('detects C2PA provenance containers in JPEG, PNG and WebP', async () => {
    for (const file of [jpegWithC2pa(), pngWithC2pa(), webpWithC2pa()]) {
      const result = await scanImage(file);
      expect(result.entries.some((entry) => entry.rawKey === 'C2PA/JUMBF')).toBe(true);
      expect(result.counts.provenance).toBeGreaterThan(0);
    }
  });

  it('removes JPEG metadata and verifies the result', async () => {
    const cleaned = await cleanImage(jpegWithExif(), 'maximum');
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
    const cleaned = await cleanImage(webpWithExif(), 'maximum');
    const verification = await verifyCleanedImage(cleaned);
    expect(verification.verified).toBe(true);
  });

  it('removes C2PA containers and verifies JPEG, PNG and WebP outputs', async () => {
    for (const file of [jpegWithC2pa(), pngWithC2pa(), webpWithC2pa()]) {
      const cleaned = await cleanImage(file, 'maximum');
      const verification = await verifyCleanedImage(cleaned);
      expect(verification.verified).toBe(true);
      expect(verification.remainingMetadata).toBe(0);
    }
  });
});
