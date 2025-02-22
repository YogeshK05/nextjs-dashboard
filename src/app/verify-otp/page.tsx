'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import OtpForm from '@/components/OtpForm';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (!emailParam) {
      router.push('/login');
      return;
    }
    setEmail(emailParam);
  }, [router, searchParams]);

  if (!email) return null;

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Verify OTP</h1>
        <p className="text-gray-900 mb-6">
          Please enter the 6-digit code sent to your email address {email}
        </p>
        <OtpForm email={email} />
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyOtpContent />
    </Suspense>
  );
}