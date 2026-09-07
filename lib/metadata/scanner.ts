import type { ScanResult, MetadataEntry } from './types';

// ─── JPEG ──────────────────────────────────────────────────────────────────

function scanJpeg(bytes: Uint8Array): MetadataEntry[] {
  const entries: MetadataEntry[] = [];
  let i = 2; // skip SOI marker
  while (i < bytes.length - 1) {
    if (bytes[i] !== 0xff) break;
    const marker = bytes[i + 1];
    if (marker === 0xda) break; // SOS — image data starts

    const segLen = (bytes[i + 2] << 8) | bytes[i + 3];

    // APP1 (0xe1) — EXIF or XMP
    if (marker === 0xe1 && segLen > 6) {
      const header = String.fromCharCode(...bytes.slice(i + 4, i + 10));
      if (header.startsWith('Exif\0\0')) {
        entries.push({ key: 'EXIF', value: 'APP1 segment present', category: 'device' });
        // Parse basic IFD0 tags
        const exifStart = i + 10;
        const little = bytes[exifStart] === 0x49;
        const read32 = (o: number) => little
          ? bytes[exifStart + o] | (bytes[exifStart + o + 1] << 8) | (bytes[exifStart + o + 2] << 16) | (bytes[exifStart + o + 3] << 24)
          : (bytes[exifStart + o] << 24) | (bytes[exifStart + o + 1] << 16) | (bytes[exifStart + o + 2] << 8) | bytes[exifStart + o + 3];
        const read16 = (o: number) => little
          ? bytes[exifStart + o] | (bytes[exifStart + o + 1] << 8)
          : (bytes[exifStart + o] << 8) | bytes[exifStart + o + 1];

        const ifdOffset = read32(4);
        const entryCount = read16(ifdOffset);
        for (let e = 0; e < entryCount; e++) {
          const base = ifdOffset + 2 + e * 12;
          const tag = read16(base);
          const type = read16(base + 2);
          const count = read32(base + 4);
          const valueOffset = base + 8;

          if (type === 2) { // ASCII
            const offset = count <= 4 ? valueOffset : read32(valueOffset);
            const str = String.fromCharCode(...bytes.slice(exifStart + offset, exifStart + offset + count)).replace(/\0/g, '');
            const label = TAG_LABELS[tag] ?? `0x${tag.toString(16)}`;
            const cat = GPS_TAGS.has(tag) ? 'location' : DATETIME_TAGS.has(tag) ? 'datetime' : 'device';
            if (str) entries.push({ key: label, value: str, category: cat });
          }
        }
      } else if (header.startsWith('http://') || header.startsWith('adobe')) {
        entries.push({ key: 'XMP', value: 'XMP metadata present', category: 'software' });
      }
    }
    // APP13 (0xed) — IPTC / Photoshop
    if (marker === 0xed) {
      entries.push({ key: 'IPTC', value: 'APP13 segment present', category: 'software' });
    }

    i += 2 + segLen;
  }
  return entries;
}

// ─── PNG ───────────────────────────────────────────────────────────────────

function scanPng(bytes: Uint8Array): MetadataEntry[] {
  const entries: MetadataEntry[] = [];
  let i = 8; // skip PNG signature
  const view = new DataView(bytes.buffer, bytes.byteOffset);
  while (i < bytes.length - 12) {
    const length = view.getUint32(i, false);
    const type = String.fromCharCode(bytes[i + 4], bytes[i + 5], bytes[i + 6], bytes[i + 7]);
    if (type === 'IEND') break;
    if (type === 'tEXt' || type === 'iTXt' || type === 'zTXt') {
      const chunk = bytes.slice(i + 8, i + 8 + length);
      const nullIdx = chunk.indexOf(0);
      const key = nullIdx >= 0 ? new TextDecoder().decode(chunk.slice(0, nullIdx)) : type;
      entries.push({ key, value: `${type} chunk present`, category: 'other' });
    }
    if (type === 'eXIf') {
      entries.push({ key: 'EXIF', value: 'eXIf chunk present', category: 'device' });
    }
    i += 12 + length;
  }
  return entries;
}

// ─── WebP ──────────────────────────────────────────────────────────────────

function scanWebp(bytes: Uint8Array): MetadataEntry[] {
  const entries: MetadataEntry[] = [];
  if (bytes.length < 12) return entries;
  const view = new DataView(bytes.buffer, bytes.byteOffset);
  let i = 12; // skip RIFF header + WEBP
  while (i < bytes.length - 8) {
    const chunkType = String.fromCharCode(bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]);
    const chunkSize = view.getUint32(i + 4, true);
    if (chunkType === 'EXIF') entries.push({ key: 'EXIF', value: 'EXIF chunk present', category: 'device' });
    if (chunkType === 'XMP ') entries.push({ key: 'XMP', value: 'XMP chunk present', category: 'software' });
    if (chunkType === 'ICCP') entries.push({ key: 'ICC Profile', value: 'ICC profile present', category: 'other' });
    i += 8 + chunkSize + (chunkSize & 1); // chunks are padded to even size
  }
  return entries;
}

// ─── Tag helpers ───────────────────────────────────────────────────────────

const TAG_LABELS: Record<number, string> = {
  0x010f: 'Make', 0x0110: 'Model', 0x0131: 'Software',
  0x013b: 'Artist', 0x8298: 'Copyright',
  0x9003: 'DateTimeOriginal', 0x9004: 'DateTimeDigitized', 0x0132: 'DateTime',
  0x8825: 'GPSInfo',
};
const GPS_TAGS = new Set([0x8825, 0x0001, 0x0002, 0x0003, 0x0004]);
const DATETIME_TAGS = new Set([0x9003, 0x9004, 0x0132]);

// ─── Public API ────────────────────────────────────────────────────────────

export async function scanImage(file: File): Promise<ScanResult> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let format = 'unknown';
  let entries: MetadataEntry[] = [];

  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    format = 'jpeg';
    entries = scanJpeg(bytes);
  } else if (bytes[0] === 0x89 && bytes[1] === 0x50) {
    format = 'png';
    entries = scanPng(bytes);
  } else if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    format = 'webp';
    entries = scanWebp(bytes);
  }

  return { format, entries };
}
