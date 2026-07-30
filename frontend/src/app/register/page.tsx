// app/register/page.tsx
import { RegisterForm } from '@/components/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In & Register | Afilas Healthcare',
  description: 'Sign in or create your account at Afilas Healthcare',
};

export default function RegisterPage() {
  return (
    <main className="w-full min-h-screen">
      <RegisterForm />
    </main>
  );
}