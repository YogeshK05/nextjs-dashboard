import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { login } from '@/lib/api';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
}).required();

type LoginFormData = yup.InferType<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      // Redirect to OTP page with email parameter
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      console.log(err);
      setError('Login failed. Please check your credentials.');
      router.push('/error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register('email')}
          className="mt-1 pt-2 px-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.email && (
          <p className="mt-1 pt-2 px-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          {...register('password')}
          className="mt-1 pt-2 px-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.password && (
          <p className="mt-1 pt-2 px-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  );
}