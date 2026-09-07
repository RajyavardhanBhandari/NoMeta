// Tiny dependency-free ZIP writer for local browser downloads.
// Uses the ZIP "store" method (no compression), keeping all image bytes local.

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function u16(v: number) { const a = new Uint8Array(2); new DataView(a.buffer).setUint16(0, v, true); return a; }
function u32(v: number) { const a = new Uint8Array(4); new DataView(a.buffer).setUint32(0, v >>> 0, true); return a; }
function concat(...parts: Uint8Array[]) { const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0)); let o = 0; for (const p of parts) { out.set(p, o); o += p.length; } return out; }

export async function createLocalZip(files: { name: string; blob: Blob }[]): Promise<Blob> {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(file.name);
    const data = new Uint8Array(await file.blob.arrayBuffer());
    const crc = crc32(data);
    const local = concat(
      u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0), u32(crc),
      u32(data.length), u32(data.length), u16(name.length), u16(0), name, data,
    );
    localParts.push(local);
    const central = concat(
      u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0), u32(crc),
      u32(data.length), u32(data.length), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), name,
    );
    centralParts.push(central);
    offset += local.length;
  }

  const centralSize = centralParts.reduce((n, p) => n + p.length, 0);
  const centralOffset = offset;
  const end = concat(u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length), u32(centralSize), u32(centralOffset), u16(0));
  const zipBytes = concat(...localParts, ...centralParts, end);
  // Use a copied ArrayBuffer to satisfy modern BlobPart typings.
  const blobBytes = new Uint8Array(zipBytes.byteLength);
  blobBytes.set(zipBytes);
  return new Blob([blobBytes.buffer], { type: 'application/zip' });
}
