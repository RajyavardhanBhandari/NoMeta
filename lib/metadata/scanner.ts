import type { MetadataCategory, MetadataEntry, MetadataResult, RiskLevel } from '../../types/metadata';

const textDecoder = new TextDecoder('utf-8', { fatal: false });

const categoryDefaults: Record<MetadataCategory, number> = {
  location: 35, device: 18, time: 14, identity: 18, software: 6, technical: 2, provenance: 5, other: 3,
};

function emptyCounts(): Record<MetadataCategory, number> {
  return { location: 0, device: 0, time: 0, identity: 0, software: 0, technical: 0, provenance: 0, other: 0 };
}

function riskFor(category: MetadataCategory): RiskLevel {
  if (category === 'location') return 'high';
  if (category === 'device' || category === 'time' || category === 'identity') return 'medium';
  if (category === 'software' || category === 'provenance') return 'low';
  return 'info';
}

function explain(category: MetadataCategory, label: string): string {
  const map: Record<MetadataCategory, string> = {
    location: 'This can reveal where a photo was taken, sometimes down to a precise location.',
    device: 'This can identify the camera, phone or lens used to create the image.',
    time: 'This can reveal when the image was captured or edited.',
    identity: 'This can contain a person, organization or copyright identifier.',
    software: 'This can reveal the software or workflow used to create or edit the file.',
    technical: 'This describes image or capture settings and is usually less privacy-sensitive.',
    provenance: 'This can reveal information about how the image was created, exported or handled.',
    other: `This is additional embedded information (${label}).`,
  };
  return map[category];
}

function categorize(key: string, value: string): MetadataCategory {
  const k = key.toLowerCase();
  if (/gps|latitude|longitude|altitude|location|position|city|country/.test(k)) return 'location';
  if (/make|model|lens|camera|body|serial|ownername|device/.test(k)) return 'device';
  if (/date|time|timestamp|created|modified|original/.test(k)) return 'time';
  if (/artist|author|creator|owner|copyright|byline|person/.test(k)) return 'identity';
  if (/software|application|processing|editor|hostcomputer/.test(k)) return 'software';
  if (/xmp|iptc|history|documentid|instanceid|derived|source/.test(k)) return 'provenance';
  if (/width|height|orientation|resolution|dpi|exposure|fnumber|iso|focal|flash|whitebalance|compression|bits|color/.test(k)) return 'technical';
  return 'other';
}

function add(entries: MetadataEntry[], key: string, value: string) {
  if (!value || value === 'undefined' || value === 'null') return;
  const category = categorize(key, value);
  entries.push({
    id: `${key}-${entries.length}`,
    category,
    label: prettyLabel(key),
    value: cleanValue(value),
    risk: riskFor(category),
    sensitive: ['location', 'device', 'time', 'identity'].includes(category),
    explanation: explain(category, key),
    rawKey: key,
  });
}

function prettyLabel(key: string) {
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_:-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
function cleanValue(v: string) { return v.replace(/\s+/g, ' ').trim().slice(0, 500); }

function u16(d: DataView, o: number, le: boolean) { return d.getUint16(o, le); }
function u32(d: DataView, o: number, le: boolean) { return d.getUint32(o, le); }
function rational(d: DataView, o: number, le: boolean) { const n = u32(d, o, le), den = u32(d, o + 4, le); return den ? n / den : 0; }

const EXIF_NAMES: Record<number, string> = {
  0x010f: 'Make', 0x0110: 'Model', 0x0112: 'Orientation', 0x011a: 'XResolution', 0x011b: 'YResolution',
  0x0131: 'Software', 0x0132: 'DateTime', 0x013b: 'Artist', 0x8298: 'Copyright', 0x8769: 'ExifIFD', 0x8825: 'GPSIFD',
  0x9003: 'DateTimeOriginal', 0x9004: 'DateTimeDigitized', 0x9291: 'SubSecTimeOriginal', 0xA002: 'PixelXDimension',
  0xA003: 'PixelYDimension', 0xA431: 'BodySerialNumber', 0xA434: 'LensModel', 0xA435: 'LensSerialNumber',
  0x829a: 'ExposureTime', 0x829d: 'FNumber', 0x8827: 'ISOSpeedRatings', 0x920a: 'FocalLength',
};
const GPS_NAMES: Record<number, string> = { 0x0001:'GPSLatitudeRef',0x0002:'GPSLatitude',0x0003:'GPSLongitudeRef',0x0004:'GPSLongitude',0x0005:'GPSAltitudeRef',0x0006:'GPSAltitude',0x001e:'GPSMapDatum',0x001f:'GPSProcessingMethod',0x001d:'GPSDateStamp' };

function readAscii(d: DataView, offset: number, count: number) { return new Uint8Array(d.buffer, d.byteOffset + offset, Math.max(0, Math.min(count, d.byteLength - offset))).reduce((s,b)=>s+(b ? String.fromCharCode(b):''),''); }
function readTag(d: DataView, tiff: number, ifd: number, tag: number, le: boolean, gps = false): [string, string] {
  const count = u32(d, ifd + 4, le);
  const type = u16(d, ifd + 2, le);
  const base = ifd + 8;
  const bytes = [1,1,2,4,8,1,1,2,4,8,4,8,2,4,8,1][type] || 1;
  const len = count * bytes;
  const ptr = len <= 4 ? base : tiff + u32(d, base, le);
  const name = (gps ? GPS_NAMES[tag] : EXIF_NAMES[tag]) || `Tag 0x${tag.toString(16)}`;
  try {
    if (type === 2) return [name, readAscii(d, ptr, count).replace(/\0+$/, '')];
    if (type === 1 || type === 7) return [name, Array.from(new Uint8Array(d.buffer, d.byteOffset + ptr, Math.min(count, d.byteLength - ptr))).join(', ')];
    if (type === 3) return [name, count === 1 ? String(u16(d, ptr, le)) : Array.from({length:Math.min(count,16)},(_,i)=>u16(d,ptr+i*2,le)).join(', ')];
    if (type === 4) return [name, count === 1 ? String(u32(d, ptr, le)) : Array.from({length:Math.min(count,16)},(_,i)=>u32(d,ptr+i*4,le)).join(', ')];
    if (type === 5) return [name, count === 1 ? String(rational(d, ptr, le)) : Array.from({length:Math.min(count,8)},(_,i)=>String(rational(d,ptr+i*8,le))).join(', ')];
    if (type === 9) return [name, String(d.getInt32(ptr, le))];
    if (type === 10) return [name, String((d.getInt32(ptr, le) / (d.getInt32(ptr+4, le) || 1)))];
  } catch { return [name, 'Unreadable value']; }
  return [name, 'Present'];
}

function parseIFD(d: DataView, tiff: number, offset: number, le: boolean, gps = false, seen = new Set<number>()) {
  const entries: [string,string][] = [];
  if (offset <= 0 || offset + 2 > d.byteLength || seen.has(offset)) return entries;
  seen.add(offset);
  const absolute = tiff + offset;
  if (absolute + 2 > d.byteLength) return entries;
  const count = u16(d, absolute, le);
  for (let i=0;i<Math.min(count, 128);i++) {
    const p = absolute + 2 + i*12;
    if (p+12 > d.byteLength) break;
    const tag = u16(d,p,le);
    const val = readTag(d,tiff,p,tag,le,gps);
    if (val) entries.push(val);
    if (!gps && (tag === 0x8769 || tag === 0x8825)) {
      const sub = u32(d,p+8,le);
      entries.push(...parseIFD(d,tiff,sub,le,tag===0x8825,seen));
    }
  }
  return entries;
}

function parseExif(buffer: ArrayBuffer): [string,string][] {
  const d = new DataView(buffer);
  if (d.byteLength < 14 || d.getUint16(0,false)!==0xffd8) return [];
  let p=2;
  while (p+4 <= d.byteLength) {
    if (d.getUint8(p)!==0xff) { p++; continue; }
    const marker=d.getUint8(p+1); p+=2;
    if (marker===0xda || marker===0xd9) break;
    if (p+2>d.byteLength) break;
    const len=d.getUint16(p,false);
    if (marker===0xe1 && len>=8 && readAscii(d,p+2,6)==='Exif\0') {
      const tiff=p+8;
      if (tiff+8>d.byteLength) return [];
      const endian=d.getUint16(tiff,false); const le=endian===0x4949;
      if ((le ? d.getUint16(tiff,false) : d.getUint16(tiff,false)) !== 0x4949 && endian!==0x4d4d) return [];
      const magic=u16(d,tiff+2,le); if (magic!==42) return [];
      return parseIFD(d,tiff,u32(d,tiff+4,le),le);
    }
    p += len;
  }
  return [];
}

function parseJpeg(buffer: ArrayBuffer) {
  const out = parseExif(buffer);
  const d = new DataView(buffer); let p=2;
  while(p+4<d.byteLength){
    if(d.getUint8(p)!==0xff){p++;continue;} const marker=d.getUint8(p+1); p+=2;
    if(marker===0xda||marker===0xd9)break; if(p+2>d.byteLength)break; const len=d.getUint16(p,false);
    if((marker===0xe1||marker===0xed||marker===0xe2) && len>2){
      const bytes=new Uint8Array(buffer,p+2,Math.min(len-2,d.byteLength-p-2)); const text=textDecoder.decode(bytes);
      if(/xmp|iptc|photoshop|http:\/\/ns\.adobe\.com/i.test(text)) out.push([marker===0xed?'IPTC/Photoshop':'XMP', text.replace(/[\0\x01-\x08\x0b\x0c\x0e-\x1f]/g,' ').slice(0,1000)]);
    }
    p+=len;
  }
  return out;
}

function parsePng(buffer: ArrayBuffer) {
  const out:[string,string][]=[]; const d=new DataView(buffer); let p=8;
  while(p+12<=d.byteLength){ const len=d.getUint32(p,false); const type=textDecoder.decode(new Uint8Array(buffer,p+4,4)); if(p+12+len>d.byteLength)break;
    if(['tEXt','zTXt','iTXt'].includes(type)){ const text=textDecoder.decode(new Uint8Array(buffer,p+8,len)); out.push([`PNG ${type}`,text.slice(0,1000)]); }
    p+=12+len; if(type==='IEND')break;
  } return out;
}

function parseWebp(buffer: ArrayBuffer) {
  const out:[string,string][]=[]; const d=new DataView(buffer); let p=12;
  while(p+8<=d.byteLength){ const type=textDecoder.decode(new Uint8Array(buffer,p,4)); const size=d.getUint32(p+4,true); const start=p+8; const end=Math.min(d.byteLength,start+size);
    if(type==='EXIF' && end>start) out.push(...parseExif(buffer.slice(start,end)));
    if(type==='XMP ' && end>start) out.push(['XMP',textDecoder.decode(new Uint8Array(buffer,start,end-start)).slice(0,1000)]);
    p=start+size+(size%2);
  } return out;
}

function inferFormat(type: string, buffer: ArrayBuffer): 'jpeg'|'png'|'webp' {
  if(type==='image/jpeg') return 'jpeg'; if(type==='image/png') return 'png'; if(type==='image/webp') return 'webp';
  const d=new Uint8Array(buffer); if(d[0]===0xff&&d[1]===0xd8) return 'jpeg'; if(d[0]===0x89&&d[1]===0x50) return 'png'; return 'webp';
}

export async function scanImage(file: File): Promise<MetadataResult> {
  const buffer = await file.arrayBuffer();
  const format=inferFormat(file.type,buffer);
  const raw = format==='jpeg' ? parseJpeg(buffer) : format==='png' ? parsePng(buffer) : parseWebp(buffer);
  const entries: MetadataEntry[]=[];
  for(const [key,value] of raw) add(entries,key,value);
  const counts=emptyCounts(); for(const e of entries) counts[e.category]++;
  let exposure=0; for(const e of entries) exposure += categoryDefaults[e.category];
  const privacyScore=Math.max(0,Math.min(100,100-exposure));
  const riskLevel: RiskLevel=privacyScore<55?'high':privacyScore<80?'medium':privacyScore<96?'low':'info';
  const warnings:string[]=[];
  if(counts.location) warnings.push('Location metadata was found. It may reveal where the photo was taken.');
  if(counts.device) warnings.push('Device information was found.');
  if(counts.time) warnings.push('Capture or editing time information was found.');
  if(entries.length===0) warnings.push('No supported metadata fields were detected in this file.');
  return {fileName:file.name,mimeType:file.type,size:file.size,format,entries,counts,privacyScore,riskLevel,scannedAt:Date.now(),warnings};
}
