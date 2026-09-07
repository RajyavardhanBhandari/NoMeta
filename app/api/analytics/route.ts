import { NextResponse } from 'next/server';
import { ANALYTICS_EVENTS, sanitizeAnalyticsProperties, type AnalyticsEventName } from '@/lib/analytics/events';
import { isAllowedOrigin, jsonSecurityHeaders } from '@/lib/security';
import { readBoundedText, MAX_API_BODY_BYTES } from '@/lib/security/request';

const MAX_PATH_LENGTH = 200;
function isEventName(value: unknown): value is AnalyticsEventName {
  return typeof value === 'string' && (ANALYTICS_EVENTS as readonly string[]).includes(value);
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return new NextResponse(null, { status: 403, headers: jsonSecurityHeaders() });
  try {
    const raw = await readBoundedText(request, MAX_API_BODY_BYTES);
    const body = JSON.parse(raw);
    if (!isEventName(body?.name)) return NextResponse.json({ ok: false }, { status: 400, headers: jsonSecurityHeaders() });
    const path = typeof body.path === 'string' ? body.path.slice(0, MAX_PATH_LENGTH) : undefined;
    const properties = sanitizeAnalyticsProperties(body.properties);
    void { name: body.name, path, properties };
    return NextResponse.json({ ok: true }, { headers: jsonSecurityHeaders() });
  } catch (error) {
    const status = error instanceof Error && error.message === 'REQUEST_TOO_LARGE' ? 413 : 400;
    return NextResponse.json({ ok: false }, { status, headers: jsonSecurityHeaders() });
  }
}
