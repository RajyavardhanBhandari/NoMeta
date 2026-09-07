import Link from 'next/link';
import { Suspense } from 'react';
import { AuthCard } from '@/components/auth/AuthCard';

export default function SignInPage() {
  return (
    <main className="auth-page">
      <Suspense>
        <AuthCard mode="sign-in" />
      </Suspense>
      <p className="auth-links">
        <Link href="/auth/forgot-password">Forgot your password?</Link>
        {' · '}
        <Link href="/auth/sign-up">Create an account</Link>
      </p>
    </main>
  );
}
