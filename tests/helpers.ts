export function fileFromBytes(bytes: number[], type: string, name = 'fixture') {
  return new File([new Uint8Array(bytes)], name, { type });
}

export function jpegWithExif(): File {
  const exif = [
    0x45,0x78,0x69,0x66,0x00,0x00,
    0x49,0x49,0x2a,0x00,0x08,0x00,0x00,0x00,
    0x01,0x00,
    0x0f,0x01,0x02,0x00,0x06,0x00,0x00,0x00,0x1a,0x00,0x00,0x00,
    0x00,0x00,0x00,0x00,
    0x43,0x61,0x6e,0x6f,0x6e,0x00,
  ];
  const len = exif.length + 2;
  const bytes = [0xff,0xd8,0xff,0xe1,(len >> 8) & 255,len & 255,...exif,0xff,0xda,0x00,0x02,0xff,0xd9];
  return fileFromBytes(bytes, 'image/jpeg', 'photo.jpg');
}

export function jpegWithC2pa(): File {
  const payload = Array.from(new TextEncoder().encode('C2PA JUMBF c2pa manifest'));
  const len = payload.length + 2;
  const bytes = [0xff,0xd8,0xff,0xeb,(len >> 8) & 255,len & 255,...payload,0xff,0xda,0x00,0x02,0xff,0xd9];
  return fileFromBytes(bytes, 'image/jpeg', 'c2pa.jpg');
}

export function pngWithText(): File {
  const text = new TextEncoder().encode('Comment\0Taken at home');
  const type = new TextEncoder().encode('tEXt');
  const bytes = new Uint8Array(8 + 4 + 4 + text.length + 4 + 12);
  bytes.set([137,80,78,71,13,10,26,10], 0);
  const view = new DataView(bytes.buffer);
  let p = 8;
  view.setUint32(p, text.length, false); p += 4;
  bytes.set(type, p); p += 4;
  bytes.set(text, p); p += text.length;
  p += 4;
  view.setUint32(p, 0, false); p += 4;
  bytes.set(new TextEncoder().encode('IEND'), p); p += 4;
  view.setUint32(p, 0, false);
  return new File([bytes], 'photo.png', { type: 'image/png' });
}

export function pngWithC2pa(): File {
  const payload = new TextEncoder().encode('c2pa JUMBF manifest');
  const type = new TextEncoder().encode('caBX');
  const bytes = new Uint8Array(8 + 4 + 4 + payload.length + 4 + 12);
  bytes.set([137,80,78,71,13,10,26,10], 0);
  const view = new DataView(bytes.buffer);
  let p = 8;
  view.setUint32(p, payload.length, false); p += 4;
  bytes.set(type, p); p += 4;
  bytes.set(payload, p); p += payload.length;
  p += 4;
  view.setUint32(p, 0, false); p += 4;
  bytes.set(new TextEncoder().encode('IEND'), p); p += 4;
  view.setUint32(p, 0, false);
  return new File([bytes], 'c2pa.png', { type: 'image/png' });
}

export function webpWithExif(): File {
  const payload = new Uint8Array([1,2,3,4]);
  const bytes = new Uint8Array(12 + 8 + payload.length);
  bytes.set(new TextEncoder().encode('RIFF'), 0);
  new DataView(bytes.buffer).setUint32(4, 12, true);
  bytes.set(new TextEncoder().encode('WEBP'), 8);
  bytes.set(new TextEncoder().encode('EXIF'), 12);
  new DataView(bytes.buffer).setUint32(16, payload.length, true);
  bytes.set(payload, 20);
  return new File([bytes], 'photo.webp', { type: 'image/webp' });
}

export function webpWithC2pa(): File {
  const payload = new TextEncoder().encode('c2pa JUMBF manifest');
  const padded = payload.length % 2 ? payload.length + 1 : payload.length;
  const bytes = new Uint8Array(12 + 8 + padded);
  bytes.set(new TextEncoder().encode('RIFF'), 0);
  new DataView(bytes.buffer).setUint32(4, 8 + padded, true);
  bytes.set(new TextEncoder().encode('WEBP'), 8);
  bytes.set(new TextEncoder().encode('C2PA'), 12);
  new DataView(bytes.buffer).setUint32(16, payload.length, true);
  bytes.set(payload, 20);
  return new File([bytes], 'c2pa.webp', { type: 'image/webp' });
}
