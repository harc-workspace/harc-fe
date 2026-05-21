import { Link } from '@tanstack/react-router';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-black mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 underline">
          Go back to dashboard
        </Link>
      </div>
    </div>
  );
}
