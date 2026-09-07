import { isAllowedOrigin } from '@/lib/security';

export const MAX_API_BODY_BYTES = 8_000;

export function assertSameOrigin(request: Request): Response | null {
  if (!isAllowedOrigin(request)) {
    return new Response(null, { status: 403 });
  }
  return null;
}

export async function readBoundedText(request: Request, maxBytes = MAX_API_BODY_BYTES): Promise<string> {
  const declared = Number(request.headers.get('content-length') || 0);
  if (Number.isFinite(declared) && declared > maxBytes) throw new Error('REQUEST_TOO_LARGE');

  const body = await request.arrayBuffer();
  if (body.byteLength > maxBytes) throw new Error('REQUEST_TOO_LARGE');
  return new TextDecoder().decode(body);
}
