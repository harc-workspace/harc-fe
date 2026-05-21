import { LoginForm } from '@/components/LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-black mb-8">
          Login to HARC
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
