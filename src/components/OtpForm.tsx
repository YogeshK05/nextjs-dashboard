import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { verifyOtp } from '@/lib/api';

const schema = yup.object({
  otp: yup.string()
    .length(6, 'OTP must be 6 digits')
    .matches(/^\d+$/, 'OTP must contain only numbers')
    .required('OTP is required'),
}).required();

type OtpFormData = yup.InferType<typeof schema>;

export default function OtpForm({ email }: { email: string }) {
  const router = useRouter();
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm<OtpFormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: OtpFormData) => {
    try {
      const response = await verifyOtp(email, data.otp);
      localStorage.setItem('token', response.token);
      // Include email when redirecting to thank-you page
      router.push(`/thank-you?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.log(err);
      setError('Invalid or expired OTP');
      router.push('/error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
        <input
          type="text"
          {...register('otp')}
          maxLength={6}
          className="mt-1 pt-2 px-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter 6-digit OTP"
        />
        {errors.otp && (
          <p className="mt-1 pt-2 px-1 text-sm text-red-600">{errors.otp.message}</p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition-colors"
      >
        Verify OTP
      </button>
    </form>
  );
}