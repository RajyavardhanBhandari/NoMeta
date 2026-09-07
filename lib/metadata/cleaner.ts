import type { CleanResult, VerifyResult } from './types';
import { scanImage } from './scanner';

// ─── JPEG ──────────────────────────────────────────────────────────────────

function cleanJpeg(bytes: Uint8Array): { data: Uint8Array; removedCount: number } {
  const out: number[] = [0xff, 0xd8]; // keep SOI
  let removedCount = 0;
  let i = 2;

  while (i < bytes.length - 1) {
    if (bytes[i] !== 0xff) break;
    const marker = bytes[i + 1];

    // Keep SOS and everything after it (image data)
    if (marker === 0xda) {
      out.push(...bytes.slice(i));
      break;
    }

    const segLen = (bytes[i + 2] << 8) | bytes[i + 3];

    // Remove APP segments (0xe0–0xef) and COM
    if ((marker >= 0xe0 && marker <= 0xef) || marker === 0xfe) {
      removedCount++;
      i += 2 + segLen;
      continue;
    }

    // Keep everything else (DQT, DHT, SOF, etc.)
    out.push(...bytes.slice(i, i + 2 + segLen));
    i += 2 + segLen;
  }

  return { data: new Uint8Array(out), removedCount };
}

// ─── PNG ───────────────────────────────────────────────────────────────────

function cleanPng(bytes: Uint8Array, mode: 'standard' | 'maximum'): { data: Uint8Array; removedCount: number } {
  const out: number[] = [...bytes.slice(0, 8)]; // PNG signature
  const view = new DataView(bytes.buffer, bytes.byteOffset);
  let i = 8;
  let removedCount = 0;

  const METADATA_CHUNKS = new Set(['tEXt', 'iTXt', 'zTXt', 'eXIf', 'tIME', 'pHYs', 'iCCP', 'sPLT', 'hIST']);
  const MAXIMUM_EXTRA = new Set(['gAMA', 'cHRM', 'sRGB']);

  while (i < bytes.length - 12) {
    const length = view.getUint32(i, false);
    const type = String.fromCharCode(bytes[i + 4], bytes[i + 5], bytes[i + 6], bytes[i + 7]);
    const chunkTotal = 12 + length;

    if (METADATA_CHUNKS.has(type) || (mode === 'maximum' && MAXIMUM_EXTRA.has(type))) {
      removedCount++;
    } else {
      out.push(...bytes.slice(i, i + chunkTotal));
    }

    if (type === 'IEND') break;
    i += chunkTotal;
  }

  return { data: new Uint8Array(out), removedCount };
}

// ─── WebP ──────────────────────────────────────────────────────────────────

function cleanWebp(bytes: Uint8Array): { data: Uint8Array; removedCount: number } {
  if (bytes.length < 12) return { data: bytes, removedCount: 0 };
  const view = new DataView(bytes.buffer, bytes.byteOffset);
  const chunks: Uint8Array[] = [];
  let removedCount = 0;

  const REMOVE_CHUNKS = new Set(['EXIF', 'XMP ', 'ICCP']);
  let i = 12;

  while (i < bytes.length - 8) {
    const chunkType = String.fromCharCode(bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]);
    const chunkSize = view.getUint32(i + 4, true);
    const paddedSize = chunkSize + (chunkSize & 1);
    const chunkTotal = 8 + paddedSize;

    if (REMOVE_CHUNKS.has(chunkType)) {
      removedCount++;
    } else {
      chunks.push(bytes.slice(i, i + chunkTotal));
    }
    i += chunkTotal;
  }

  const payloadSize = chunks.reduce((s, c) => s + c.length, 0);
  const out = new Uint8Array(12 + payloadSize);
  out.set(bytes.slice(0, 12)); // RIFF header + WEBP
  new DataView(out.buffer).setUint32(4, 4 + payloadSize, true); // update RIFF size
  let off = 12;
  for (const c of chunks) { out.set(c, off); off += c.length; }

  return { data: out, removedCount };
}

// ─── Public API ────────────────────────────────────────────────────────────

export async function cleanImage(file: File, mode: 'standard' | 'maximum'): Promise<File> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let data: Uint8Array;
  let removedCount: number;

  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    ({ data, removedCount } = cleanJpeg(bytes));
  } else if (bytes[0] === 0x89 && bytes[1] === 0x50) {
    ({ data, removedCount } = cleanPng(bytes, mode));
  } else if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    ({ data, removedCount } = cleanWebp(bytes));
  } else {
    data = bytes;
    removedCount = 0;
  }

  return new File([data.buffer as ArrayBuffer], file.name, { type: file.type });
}

export async function verifyCleanedImage(file: File): Promise<VerifyResult> {
  const result = await scanImage(file);
  return {
    verified: result.entries.length === 0,
    remainingMetadata: result.entries.length,
  };
}
