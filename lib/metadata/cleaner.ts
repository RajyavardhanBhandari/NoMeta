export type CleaningMode = 'standard' | 'maximum';

const decoder = new TextDecoder('latin1');

function jpegClean(input: ArrayBuffer): Uint8Array {
  const src = new Uint8Array(input);
  if (src.length < 4 || src[0] !== 0xff || src[1] !== 0xd8) throw new Error('Invalid JPEG file.');
  const out: number[] = [0xff, 0xd8]; let p = 2;
  while (p < src.length) {
    if (src[p] !== 0xff) { out.push(src[p++]); continue; }
    while (p < src.length && src[p] === 0xff) p++;
    if (p >= src.length) break;
    const marker = src[p++];
    if (marker === 0xd9) { out.push(0xff, marker); break; }
    if (marker === 0xda) { if (p + 2 > src.length) throw new Error('Malformed JPEG scan header.'); out.push(0xff, marker, src[p], src[p + 1]); p += 2; out.push(...src.subarray(p)); break; }
    if (marker >= 0xd0 && marker <= 0xd7) { out.push(0xff, marker); continue; }
    if (p + 2 > src.length) throw new Error('Malformed JPEG segment.');
    const len = (src[p] << 8) | src[p + 1]; if (len < 2 || p + len > src.length) throw new Error('Malformed JPEG segment.');
    const payload = src.subarray(p + 2, p + len); const text = decoder.decode(payload);
    const remove = marker === 0xe1 || marker === 0xeb || marker === 0xed || marker === 0xfe || (marker === 0xe2 && /http:\/\/ns\.adobe\.com\/xap|xmp|iptc|photoshop/i.test(text));
    if (!remove) out.push(0xff, marker, (len >> 8) & 255, len & 255, ...payload);
    p += len;
  }
  return new Uint8Array(out);
}
function pngClean(input: ArrayBuffer): Uint8Array {
  const src = new Uint8Array(input); const signature = [137,80,78,71,13,10,26,10];
  if (src.length < 8 || !signature.every((v,i)=>src[i]===v)) throw new Error('Invalid PNG file.');
  const out: number[] = [...signature]; let p=8; const remove=new Set(['tEXt','zTXt','iTXt','eXIf','caBX']); const view=new DataView(src.buffer,src.byteOffset,src.byteLength);
  while (p+12<=src.length) { const len=view.getUint32(p,false); const type=String.fromCharCode(...src.subarray(p+4,p+8)); if (p+12+len>src.length) throw new Error('Malformed PNG chunk.'); if(!remove.has(type)) out.push(...src.subarray(p,p+12+len)); p+=12+len; if(type==='IEND') break; }
  return new Uint8Array(out);
}
function webpClean(input: ArrayBuffer): Uint8Array {
  const src=new Uint8Array(input); if(src.length<20||String.fromCharCode(...src.subarray(0,4))!=='RIFF'||String.fromCharCode(...src.subarray(8,12))!=='WEBP') throw new Error('Invalid WebP file.');
  const out:number[]=[...src.subarray(0,12)]; let p=12; const view=new DataView(src.buffer,src.byteOffset,src.byteLength);
  while(p+8<=src.length){const type=String.fromCharCode(...src.subarray(p,p+4));const size=view.getUint32(p+4,true);const total=8+size+(size%2);if(p+total>src.length)throw new Error('Malformed WebP chunk.');if(type!=='EXIF'&&type!=='XMP '&&type!=='C2PA')out.push(...src.subarray(p,p+total));p+=total;}
  return new Uint8Array(out);
}
async function heicToJpeg(file: File): Promise<Blob> {
  const module = await import('heic2any');
  const converter = (module as any).default ?? module;
  const result = await converter({ blob: file, toType: 'image/jpeg', quality: 0.94 });
  return Array.isArray(result) ? result[0] : result;
}

export async function cleanImage(file: File, mode: CleaningMode): Promise<Blob> {
  void mode;
  const type = file.type.toLowerCase();
  if (type === 'image/heic' || type === 'image/heif' || /\.hei[cf]$/i.test(file.name)) {
    const converted = await heicToJpeg(file);
    const bytes = jpegClean(await converted.arrayBuffer());
    const blobBytes = new Uint8Array(bytes.byteLength);
    blobBytes.set(bytes);
    return new Blob([blobBytes.buffer], { type: 'image/jpeg' });
  }
  const buffer = await file.arrayBuffer(); let bytes: Uint8Array;
  if (type === 'image/jpeg' || type === 'image/jpg') bytes=jpegClean(buffer);
  else if (type === 'image/png') bytes=pngClean(buffer);
  else if (type === 'image/webp') bytes=webpClean(buffer);
  else throw new Error('Unsupported image format.');
  const blobBytes=new Uint8Array(bytes.byteLength); blobBytes.set(bytes); return new Blob([blobBytes.buffer],{type:file.type||'application/octet-stream'});
}

export async function verifyCleanedImage(blob: Blob): Promise<{verified:boolean;remainingMetadata:number}> {
  const {scanImage}=await import('./scanner'); const file=new File([blob],'nometa-cleaned',{type:blob.type}); const result=await scanImage(file);
  const remaining = result.entries.filter(entry => entry.sensitive || entry.category === 'software' || entry.category === 'provenance').length;
  return {verified:remaining===0,remainingMetadata:remaining};
}