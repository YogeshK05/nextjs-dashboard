'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUserData, deleteAccount } from '@/lib/api';

interface UserData {
  name: string;
  email: string;
  company: string;
  age: number;
  dob: string;
  profileImage: string;
}

// ✅ Component wrapped in Suspense for handling useSearchParams
function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = searchParams.get('email');
        if (!email) {
          router.push('/login');
          return;
        }

        const data = await getUserData(email);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    fetchUserData();
  }, [router, searchParams]);

  const handleDeleteAccount = async () => {
    if (!userData?.email) return;

    try {
      await deleteAccount(userData.email);
      localStorage.removeItem('token');
      router.push('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account');
    }
  };

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-red-600">{error}</p>
          <p className="mt-4">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Welcome, {userData.name}!</h1>
        <div className="space-y-4">
          {userData.profileImage && (
            <div className="mb-6">
              <img
                src={userData.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto object-cover"
              />
            </div>
          )}

          <div className="space-y-2">
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Company:</strong> {userData.company}</p>
            <p><strong>Age:</strong> {userData.age}</p>
            <p><strong>Date of Birth:</strong> {new Date(userData.dob).toLocaleDateString()}</p>
          </div>

          <button
            onClick={handleDeleteAccount}
            className="w-full mt-6 bg-red-600 text-white rounded-md py-2 hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ✅ Root component using Suspense
export default function ThankYouPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ThankYouContent />
    </Suspense>
  );
}
