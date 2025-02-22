'use client';

import Link from 'next/link';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <LoginForm />
        <p className="mt-4 text-center">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-800">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}