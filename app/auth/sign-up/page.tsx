import Link from 'next/link';
import { Suspense } from 'react';
import { AuthCard } from '@/components/auth/AuthCard';

export default function SignUpPage() {
  return (
    <main className="auth-page">
      <Suspense>
        <AuthCard mode="sign-up" />
      </Suspense>
      <p className="auth-links">
        <Link href="/auth/sign-in">Already have an account?</Link>
      </p>
    </main>
  );
}
