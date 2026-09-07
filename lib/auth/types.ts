export type AuthUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
};

export type AuthResult =
  | { ok: true; user: AuthUser }
  | { ok: false; code: string; message: string };
