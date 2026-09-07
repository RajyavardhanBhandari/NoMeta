export type MetadataCategory = 'location' | 'device' | 'time' | 'identity' | 'software' | 'technical' | 'provenance' | 'other';
export type RiskLevel = 'high' | 'medium' | 'low' | 'info';

export interface MetadataEntry {
  id: string;
  category: MetadataCategory;
  label: string;
  value: string;
  risk: RiskLevel;
  sensitive: boolean;
  explanation: string;
  rawKey?: string;
}

export interface MetadataResult {
  fileName: string;
  mimeType: string;
  size: number;
  format: 'jpeg' | 'png' | 'webp';
  entries: MetadataEntry[];
  counts: Record<MetadataCategory, number>;
  privacyScore: number;
  riskLevel: RiskLevel;
  scannedAt: number;
  warnings: string[];
}
