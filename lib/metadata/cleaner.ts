export type CleaningMode = 'standard' | 'maximum';

const decoder = new TextDecoder('latin1');

function jpegClean(input: ArrayBuffer): Uint8Array {
  const src = new Uint8Array(input);
  if (src.length < 4 || src[0] !== 0xff || src[1] !== 0xd8) throw new Error('Invalid JPEG file.');
  const out: number[] = [0xff, 0xd8];
  let p = 2;
  while (p < src.length) {
    if (src[p] !== 0xff) { out.push(src[p++]); continue; }
    while (p < src.length && src[p] === 0xff) p++;
    if (p >= src.length) break;
    const marker = src[p++];
    if (marker === 0xd9) { out.push(0xff, marker); break; }
    if (marker === 0xda) {
      if (p + 2 > src.length) throw new Error('Malformed JPEG scan header.');
      out.push(0xff, marker, src[p], src[p + 1]);
      p += 2;
      out.push(...src.subarray(p));
      break;
    }
    if (marker >= 0xd0 && marker <= 0xd7) { out.push(0xff, marker); continue; }
    if (p + 2 > src.length) throw new Error('Malformed JPEG segment.');
    const len = (src[p] << 8) | src[p + 1];
    if (len < 2 || p + len > src.length) throw new Error('Malformed JPEG segment.');
    const payload = src.subarray(p + 2, p + len);
    const text = decoder.decode(payload);
    const isApp1 = marker === 0xe1;
    const isApp11 = marker === 0xeb; // JPEG APP11 is the C2PA/JUMBF carrier.
    const isApp13 = marker === 0xed;
    const isComment = marker === 0xfe;
    const isPrivacyApp2 = marker === 0xe2 && /http:\/\/ns\.adobe\.com\/xap|xmp|iptc|photoshop/i.test(text);
    const remove = isApp1 || isApp11 || isApp13 || isComment || isPrivacyApp2;
    if (!remove) out.push(0xff, marker, (len >> 8) & 255, len & 255, ...payload);
    p += len;
  }
  return new Uint8Array(out);
}

function pngClean(input: ArrayBuffer): Uint8Array {
  const src = new Uint8Array(input);
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  if (src.length < 8 || !signature.every((v, i) => src[i] === v)) throw new Error('Invalid PNG file.');
  const out: number[] = [...signature];
  let p = 8;
  const remove = new Set(['tEXt', 'zTXt', 'iTXt', 'eXIf', 'caBX']); // caBX is the C2PA/JUMBF carrier.
  const view = new DataView(src.buffer, src.byteOffset, src.byteLength);
  while (p + 12 <= src.length) {
    const len = view.getUint32(p, false);
    const type = String.fromCharCode(...src.subarray(p + 4, p + 8));
    if (p + 12 + len > src.length) throw new Error('Malformed PNG chunk.');
    if (!remove.has(type)) out.push(...src.subarray(p, p + 12 + len));
    p += 12 + len;
    if (type === 'IEND') break;
  }
  if (p > src.length) throw new Error('Malformed PNG file.');
  return new Uint8Array(out);
}

function webpClean(input: ArrayBuffer): Uint8Array {
  const src = new Uint8Array(input);
  const header = String.fromCharCode(...src.subarray(0, 4));
  const form = String.fromCharCode(...src.subarray(8, 12));
  if (src.length < 20 || header !== 'RIFF' || form !== 'WEBP') throw new Error('Invalid WebP file.');
  const out: number[] = [...src.subarray(0, 12)];
  let p = 12;
  const view = new DataView(src.buffer, src.byteOffset, src.byteLength);
  while (p + 8 <= src.length) {
    const type = String.fromCharCode(...src.subarray(p, p + 4));
    const size = view.getUint32(p + 4, true);
    const total = 8 + size + (size % 2);
    if (p + total > src.length) throw new Error('Malformed WebP chunk.');
    if (type !== 'EXIF' && type !== 'XMP ' && type !== 'C2PA') out.push(...src.subarray(p, p + total));
    p += total;
  }
  return new Uint8Array(out);
}

export async function cleanImage(file: File, mode: CleaningMode): Promise<Blob> {
  // Both modes use the same structural privacy removal in V1. Maximum Privacy is
  // the product default and removes EXIF, XMP/IPTC/comment carriers and C2PA/JUMBF
  // containers without re-encoding the visible pixels.
  void mode;
  const buffer = await file.arrayBuffer();
  let bytes: Uint8Array;
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') bytes = jpegClean(buffer);
  else if (file.type === 'image/png') bytes = pngClean(buffer);
  else if (file.type === 'image/webp') bytes = webpClean(buffer);
  else throw new Error('Unsupported image format.');
  const blobBytes = new Uint8Array(bytes.byteLength);
  blobBytes.set(bytes);
  return new Blob([blobBytes.buffer], { type: file.type || 'application/octet-stream' });
}

export async function verifyCleanedImage(blob: Blob): Promise<{ verified: boolean; remainingMetadata: number }> {
  const { scanImage } = await import('./scanner');
  const file = new File([blob], 'nometa-cleaned', { type: blob.type });
  const result = await scanImage(file);
  return { verified: result.entries.length === 0, remainingMetadata: result.entries.length };
}
