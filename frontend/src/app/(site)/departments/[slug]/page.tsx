import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { Department } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function getDepartment(slug: string) {
  try {
    return await api.get<Department>(`/departments/${slug}`);
  } catch {
    return null;
  }
}

export default async function DepartmentDetailPage({ params }: { params: { slug: string } }) {
  const department = await getDepartment(params.slug);
  if (!department) notFound();

  return (
    <section className="max-w-4xl mx-auto px-5 py-16">
      <Link href="/departments" className="text-sm text-clinical-600 hover:underline">
        &larr; All departments
      </Link>

      <h1 className="font-display text-4xl text-clinical-900 mt-6 mb-2">{department.name}</h1>
      {department.nameAmharic && <p className="text-clinical-500 mb-6">{department.nameAmharic}</p>}
      <p className="text-lg text-clinical-800/90 mb-8 leading-relaxed">{department.summary}</p>

      <div className="prose-clinical border-t border-clinical-200 pt-8 mb-12">
        <h2 className="font-display text-2xl text-clinical-900 mb-4">Services</h2>
        <p className="text-clinical-700/90 leading-relaxed whitespace-pre-line">{department.details}</p>
      </div>

      {department.doctors && department.doctors.length > 0 && (
        <div>
          <h2 className="font-display text-2xl text-clinical-900 mb-6">Doctors in this department</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {department.doctors.map((doc) => (
              <div key={doc.id} className="border border-clinical-200 rounded-sm p-5 bg-white">
                <p className="font-semibold text-clinical-900">{doc.name}</p>
                <p className="text-sm text-clay-600">{doc.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12">
        <Link
          href="/appointment"
          className="focus-ring inline-block rounded-sm bg-clay-500 hover:bg-clay-600 text-parchment font-semibold px-7 py-3.5 transition-colors"
        >
          Book an appointment in {department.name}
        </Link>
      </div>
    </section>
  );
}
