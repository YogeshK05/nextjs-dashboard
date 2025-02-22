import Link from 'next/link';
import RegisterForm from '@/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Create Account</h1>
        <RegisterForm />
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-800">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}