declare module 'heic2any' {
  type Options = {
    blob: Blob;
    toType?: 'image/jpeg' | 'image/png' | 'image/gif';
    quality?: number;
    multiple?: boolean;
    gifInterval?: number;
  };
  const heic2any: (options: Options) => Promise<Blob | Blob[]>;
  export default heic2any;
}
