// app/diagnostics/page.tsx
"use client";

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HealthPackages } from '@/components/HealthPackages';
// Make sure this import matches the export in DiagnosticsHero.tsx
import { DiagnosticsHero } from '@/components/DiagnosticsHero';
import { DiagnosticsBlogSection } from '@/components/DiagnosticsBlogSection';
import { Microscope, Zap, Beaker, Activity, Waves, FileText } from 'lucide-react';

export default function DiagnosticsPage() {
  const services = [
    {
      name: 'Blood Testing',
      description: 'Comprehensive blood work and analysis',
      icon: Beaker,
    },
    {
      name: 'Imaging Services',
      description: 'X-ray, CT scan, MRI, and ultrasound',
      icon: Waves,
    },
    {
      name: 'Cardiac Testing',
      description: 'ECG, echocardiogram, and stress tests',
      icon: Activity,
    },
    {
      name: 'Pathology',
      description: 'Tissue and specimen analysis',
      icon: Microscope,
    },
    {
      name: 'Microbiology',
      description: 'Culture and sensitivity testing',
      icon: Zap,
    },
    {
      name: 'DNA Testing',
      description: 'Genetic screening and analysis',
      icon: FileText,
    },
  ];

  const equipment = [
    {
      name: 'CT Scanner',
      specs: '128-slice multi-detector',
    },
    {
      name: 'MRI Machine',
      specs: '3.0 Tesla high-field',
    },
    {
      name: 'Ultrasound Systems',
      specs: '4D color doppler',
    },
    {
      name: 'Digital X-ray',
      specs: 'Automated radiography',
    },
    {
      name: 'Laboratory Analyzer',
      specs: 'Automated hematology & chemistry',
    },
    {
      name: 'ECG Machine',
      specs: '12-lead digital electrocardiograph',
    },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <div className="relative">
          <DiagnosticsHero />
        </div>

        {/* Services Section */}
        <section id="services" className="bg-background max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-lg text-foreground/70">
              Comprehensive diagnostic services to support accurate diagnosis
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all group"
                >
                  <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                    <Icon className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{service.name}</h3>
                  <p className="text-foreground/70">{service.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Equipment Section */}
        <section className="bg-card py-24 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Advanced Equipment</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                State-of-the-art diagnostic equipment for accurate results
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {equipment.map((equip, idx) => (
                <div key={idx} className="bg-background border border-border rounded-2xl p-6 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                    <Microscope className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{equip.name}</h3>
                  <p className="text-sm text-foreground/70">{equip.specs}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Why Choose Us</h2>
              <ul className="space-y-4">
                {[
                  'Fast and accurate results',
                  'Expert pathologists and technicians',
                  'Latest diagnostic technology',
                  'Competitive pricing',
                  'Multiple test packages',
                  'Same-day results available',
                ].map((reason, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                    <span className="text-foreground/80">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-2xl p-8 border border-secondary/20">
              <h3 className="text-2xl font-bold text-foreground mb-6">Sample Collection</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-foreground mb-2">Home Collection</p>
                  <p className="text-foreground/70 text-sm">
                    Free home sample collection for blood tests and other samples
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Operating Hours</p>
                  <p className="text-foreground/70 text-sm">
                    Monday - Sunday: 7:00 AM - 7:00 PM
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Report Delivery</p>
                  <p className="text-foreground/70 text-sm">
                    Digital reports, SMS updates, or physical delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Diagnostics Blog Section */}
        <DiagnosticsBlogSection />

        {/* Health Packages */}
        <HealthPackages />
      </main>
      <Footer />
    </>
  );
}