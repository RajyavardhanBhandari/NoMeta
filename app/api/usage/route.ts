import { NextResponse } from "next/server";
import { getSessionToken } from "../../../lib/auth/session";

/**
 * Phase 7 API boundary. A real auth/session adapter must resolve the session
 * to a user before usage can be read or mutated. This route intentionally
 * fails closed instead of trusting a client-supplied user ID.
 */
export async function GET() {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return NextResponse.json({ ok: false, code: "AUTH_REQUIRED" }, { status: 401 });
  }

  return NextResponse.json(
    {
      ok: false,
      code: "USAGE_PROVIDER_NOT_CONFIGURED",
      message: "Connect the production auth/database adapter before reading usage.",
    },
    { status: 503 },
  );
}
