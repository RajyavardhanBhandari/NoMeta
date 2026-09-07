import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
export default function SignUpPage() { return <main className="auth-page"><AuthCard mode="sign-up" /><p className="auth-links"><Link href="/auth/sign-in">Already have an account?</Link></p></main>; }
