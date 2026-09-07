import { NextResponse } from 'next/server';
import { ANALYTICS_EVENTS, sanitizeAnalyticsProperties, type AnalyticsEventName } from '../../../lib/analytics/events';

const MAX_BODY_BYTES = 8_000;
const MAX_PATH_LENGTH = 200;

function isEventName(value: unknown): value is AnalyticsEventName {
  return typeof value === 'string' && (ANALYTICS_EVENTS as readonly string[]).includes(value);
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) return NextResponse.json({ ok: false }, { status: 413 });

  try {
    const body = await request.json();
    if (!isEventName(body?.name)) return NextResponse.json({ ok: false }, { status: 400 });

    const path = typeof body.path === 'string' ? body.path.slice(0, MAX_PATH_LENGTH) : undefined;
    const properties = sanitizeAnalyticsProperties(body.properties);

    // Phase 12 foundation: intentionally do not persist or log raw request data here.
    // Production persistence should write only this allowlisted event envelope to a
    // privacy-safe analytics store. Never add image, EXIF, GPS, identity or IP fields.
    void { name: body.name, path, properties };

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
