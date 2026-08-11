// app/login/page.tsx
import { LoginForm } from '@/components/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Afilas Hospital',
  description: 'Login to your Afilas Hospital account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-4 flex items-center justify-center min-h-[calc(100vh-100px)]">
        <LoginForm />
      </div>
    </div>
  );
}