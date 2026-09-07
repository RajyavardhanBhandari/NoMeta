export type MetadataCategory = 'device' | 'location' | 'software' | 'datetime' | 'other';

export interface MetadataEntry {
  key: string;
  value: string;
  category: MetadataCategory;
}

export interface ScanResult {
  format: string;
  entries: MetadataEntry[];
}

export interface CleanResult {
  data: Uint8Array;
  format: string;
  removedCount: number;
}

export interface VerifyResult {
  verified: boolean;
  remainingMetadata: number;
}
