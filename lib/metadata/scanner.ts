import ExifReader from 'exifreader';
import type { MetadataCategory, MetadataEntry, MetadataResult, RiskLevel } from '../../types/metadata';

const CATEGORY_WEIGHTS: Record<MetadataCategory, number> = { location: 40, device: 20, time: 15, identity: 15, software: 6, technical: 2, provenance: 5, other: 2 };

function emptyCounts(): Record<MetadataCategory, number> { return { location: 0, device: 0, time: 0, identity: 0, software: 0, technical: 0, provenance: 0, other: 0 }; }
function riskFor(category: MetadataCategory): RiskLevel { if (category === 'location') return 'high'; if (category === 'device' || category === 'time' || category === 'identity') return 'medium'; if (category === 'software' || category === 'provenance') return 'low'; return 'info'; }
function explain(category: MetadataCategory): string {
  return ({
    location: 'Your photo contains location information that can reveal where it was taken.',
    device: 'Camera or device information is embedded in the file.',
    time: 'The original capture or edit time is present.',
    identity: 'The file contains an author, creator or ownership identifier.',
    software: 'The file identifies software or an editing workflow.',
    technical: 'Technical image settings are embedded. These are usually less privacy-sensitive.',
    provenance: 'The file contains information about how it was created, exported or handled.',
    other: 'Additional embedded information was found.',
  } satisfies Record<MetadataCategory, string>)[category];
}
function categorize(key: string): MetadataCategory {
  const k = key.toLowerCase();
  if (/gps|latitude|longitude|altitude|location|position|city|country|postal|street|region/.test(k)) return 'location';
  if (/make|model|lens|camera|body|serial|ownername|device|maker/.test(k)) return 'device';
  if (/date|time|timestamp|created|modified|original|digitized/.test(k)) return 'time';
  if (/artist|author|creator|owner|copyright|byline|person/.test(k)) return 'identity';
  if (/software|application|processing|editor|hostcomputer|history/.test(k)) return 'software';
  if (/c2pa|jumbf|provenance|contentcredentials|content_credential/.test(k)) return 'provenance';
  if (/width|height|orientation|resolution|dpi|exposure|fnumber|iso|focal|flash|whitebalance|compression|bits|color|profile/.test(k)) return 'technical';
  return 'other';
}
function prettyLabel(key: string) { return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_:-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }
function valueText(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  try { return JSON.stringify(value).slice(0, 500); } catch { return ''; }
}
function add(entries: MetadataEntry[], key: string, value: unknown, description?: string) {
  const text = (description || valueText(value)).replace(/\s+/g, ' ').trim().slice(0, 500);
  if (!text || text === 'undefined' || text === 'null' || key === 'metadataRange' || key === 'Thumbnail') return;
  const category = key === 'gps' ? 'location' : categorize(key);
  entries.push({ id: `${key}-${entries.length}`, category, label: key === 'gps' ? 'GPS location' : prettyLabel(key), value: text, risk: riskFor(category), sensitive: ['location', 'device', 'time', 'identity'].includes(category), explanation: explain(category), rawKey: key });
}

function inferFormat(type: string, buffer: ArrayBuffer): 'jpeg' | 'png' | 'webp' | 'heic' | 'heif' {
  const t = type.toLowerCase();
  if (t === 'image/jpeg' || t === 'image/jpg') return 'jpeg';
  if (t === 'image/png') return 'png';
  if (t === 'image/webp') return 'webp';
  if (t === 'image/heic' || t === 'image/heic-sequence') return 'heic';
  if (t === 'image/heif' || t === 'image/heif-sequence') return 'heif';
  const d = new Uint8Array(buffer);
  if (d[0] === 0xff && d[1] === 0xd8) return 'jpeg';
  if (d[0] === 0x89 && d[1] === 0x50 && d[2] === 0x4e && d[3] === 0x47) return 'png';
  if (d[0] === 0x52 && d[1] === 0x49 && d[2] === 0x46 && d[3] === 0x46 && d[8] === 0x57 && d[9] === 0x45 && d[10] === 0x42 && d[11] === 0x50) return 'webp';
  const brand = new TextDecoder('latin1').decode(d.slice(4, 12));
  if (/heic|heix|hevc|hevx/i.test(brand)) return 'heic';
  if (/heif|mif1/i.test(brand)) return 'heif';
  throw new Error('This file is not a supported JPG, PNG, WebP, HEIC or HEIF image.');
}

function hasC2paBytes(buffer: ArrayBuffer) {
  const sample = new TextDecoder('latin1').decode(new Uint8Array(buffer.slice(0, Math.min(buffer.byteLength, 1024 * 1024))));
  return /c2pa|contentcredentials|jumbf/i.test(sample);
}

export async function scanImage(file: File): Promise<MetadataResult> {
  if (!file || file.size <= 0) throw new Error('The selected image is empty.');
  const buffer = await file.arrayBuffer();
  const format = inferFormat(file.type, buffer);
  const entries: MetadataEntry[] = [];
  const warnings: string[] = [];
  try {
    const tags = ExifReader.load(file, { expanded: true }) as Record<string, any>;
    for (const [key, tag] of Object.entries(tags)) {
      if (key === 'gps' && tag && typeof tag === 'object') {
        const gps = tag as Record<string, any>;
        const summary = [gps.Latitude, gps.Longitude, gps.Altitude].filter(v => v !== undefined).map(valueText).join(', ');
        if (summary) add(entries, 'gps', summary, 'GPS coordinates are embedded in this photo.');
        continue;
      }
      if (tag && typeof tag === 'object' && ('description' in tag || 'value' in tag)) add(entries, key, (tag as any).value, (tag as any).description);
    }
  } catch {
    if (format === 'heic' || format === 'heif') warnings.push('HEIC/HEIF was detected, but some embedded fields could not be read safely.');
  }
  if (hasC2paBytes(buffer) && !entries.some(e => e.category === 'provenance')) add(entries, 'C2PA Provenance', 'Content Credentials or provenance data appears to be embedded.');

  const counts = emptyCounts();
  for (const entry of entries) counts[entry.category] += 1;
  const weighted = Object.entries(counts).reduce((sum, [category, count]) => sum + Math.min(count, 2) * CATEGORY_WEIGHTS[category as MetadataCategory], 0);
  const privacyScore = Math.min(100, weighted);
  const riskLevel: RiskLevel = counts.location > 0 ? 'high' : privacyScore >= 45 ? 'medium' : privacyScore > 0 ? 'low' : 'info';
  return { fileName: file.name, mimeType: file.type, size: file.size, format, entries, counts, privacyScore, riskLevel, scannedAt: Date.now(), warnings };
}
