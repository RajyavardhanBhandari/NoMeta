import { NextResponse } from 'next/server';
import { ANALYTICS_EVENTS, sanitizeAnalyticsProperties, type AnalyticsEventName } from '../../../lib/analytics/events';
import { isAllowedOrigin, jsonSecurityHeaders } from '../../../lib/security';

const MAX_BODY_BYTES = 8_000;
const MAX_PATH_LENGTH = 200;
function isEventName(value: unknown): value is AnalyticsEventName { return typeof value === 'string' && (ANALYTICS_EVENTS as readonly string[]).includes(value); }

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return new NextResponse(null, { status: 403, headers: jsonSecurityHeaders() });
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) return NextResponse.json({ ok: false }, { status: 413, headers: jsonSecurityHeaders() });
  try {
    const body = await request.json();
    if (!isEventName(body?.name)) return NextResponse.json({ ok: false }, { status: 400, headers: jsonSecurityHeaders() });
    const path = typeof body.path === 'string' ? body.path.slice(0, MAX_PATH_LENGTH) : undefined;
    const properties = sanitizeAnalyticsProperties(body.properties);
    void { name: body.name, path, properties };
    return NextResponse.json({ ok: true }, { headers: jsonSecurityHeaders() });
  } catch { return NextResponse.json({ ok: false }, { status: 400, headers: jsonSecurityHeaders() }); }
}
