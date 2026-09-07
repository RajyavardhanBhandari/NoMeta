import { cookies } from "next/headers";

export const SESSION_COOKIE = "nometa_session";

/**
 * Phase 6 session boundary. Production persistence is intentionally delegated
 * to the configured auth provider. No image data is ever part of a session.
 */
export async function getSessionToken() {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}
