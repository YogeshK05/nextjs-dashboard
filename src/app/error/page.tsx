import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Sorry, we can&apos;t log you in</h1>
        <p className="text-gray-600 mb-6">
          There was an error processing your request. Please try again.
        </p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}