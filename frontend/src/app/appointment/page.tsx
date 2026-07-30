// app/appointment/page.tsx
import { AppointmentForm } from '@/components/AppointmentForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Appointment | Afilas Healthcare',
  description: 'Schedule your appointment at Afilas General Hospital. Our team will contact you to confirm your visit.',
};

export default function AppointmentPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <AppointmentForm />
    </main>
  );
}
