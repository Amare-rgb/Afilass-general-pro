// app/about/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Dropdown component for About section
export function AboutDropdown() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const menuItems = [
    { id: 'what-is-afilas', key: 'about.what' },
    { id: 'vision-mission', key: 'about.vision' },
    { id: 'core-values', key: 'about.values' },
    { id: 'specialist-doctors', key: 'about.specialists' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-clinical-700 hover:text-clinical-900 transition-colors font-medium"
      >
        {t('nav.about')}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-clinical-100 py-2 z-50">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setIsOpen(false);
                document.getElementById('about-content')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-clinical-700 hover:bg-clinical-50 hover:text-clinical-900 transition-colors flex items-center gap-2"
            >
              <ChevronRight className="w-3 h-3 text-clinical-400" />
              {t(item.key)}
            </button>
          ))}
        </div>
      )}

      {activeSection && (
        <div id="about-content" className="mt-8 pt-8 border-t border-clinical-200">
          <h2 className="font-display text-3xl md:text-4xl text-clinical-900 mb-6">
            {t(activeSection === 'what-is-afilas' ? 'about.what_title' : 
               activeSection === 'vision-mission' ? 'about.vision' :
               activeSection === 'core-values' ? 'about.values' :
               'about.specialists')}
          </h2>
          {activeSection === 'what-is-afilas' && (
            <div className="space-y-4 text-clinical-800/90 leading-relaxed">
              <p>{t('about.what_desc1')}</p>
              <p>{t('about.what_desc2')}</p>
            </div>
          )}
          {activeSection === 'vision-mission' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="group bg-white border-2 border-clinical-200 rounded-2xl p-8 hover:border-[#C5A059] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-gradient-to-br hover:from-white hover:to-[#C5A059]/5 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-[#C5A059]/20 font-display text-6xl font-bold group-hover:text-[#C5A059]/30 transition-all duration-500">01</div>
                <div className="relative z-10">
                  <h2 className="font-display text-2xl text-clinical-900 mb-4 group-hover:text-[#C5A059] transition-colors duration-300">{t('about.vision_title')}</h2>
                  <p className="text-clinical-700/90 leading-relaxed group-hover:text-clinical-600 transition-colors duration-300">
                    {t('about.vision_desc')}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-[#C5A059] opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-2">
                    <span className="text-sm font-medium">{t('button.learn')}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="group bg-white border-2 border-clinical-200 rounded-2xl p-8 hover:border-[#C5A059] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-gradient-to-br hover:from-white hover:to-[#C5A059]/5 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-[#C5A059]/20 font-display text-6xl font-bold group-hover:text-[#C5A059]/30 transition-all duration-500">02</div>
                <div className="relative z-10">
                  <h2 className="font-display text-2xl text-clinical-900 mb-4 group-hover:text-[#C5A059] transition-colors duration-300">{t('about.mission_title')}</h2>
                  <ul className="text-clinical-700/90 leading-relaxed space-y-2 group-hover:text-clinical-600 transition-colors duration-300">
                    <li className="flex items-start gap-2">
                      <span className="text-[#C5A059] mt-1">✓</span>
                      {t('about.mission_desc1')}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C5A059] mt-1">✓</span>
                      {t('about.mission_desc2')}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C5A059] mt-1">✓</span>
                      {t('about.mission_desc3')}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C5A059] mt-1">✓</span>
                      {t('about.mission_desc4')}
                    </li>
                  </ul>
                  <div className="mt-4 flex items-center gap-2 text-[#C5A059] opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-2">
                    <span className="text-sm font-medium">{t('button.learn')}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeSection === 'core-values' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { key: 'value.patient_care', title: 'Compassion', body: 'Provide the best care and treat patients and family members with sensitivity and empathy.' },
                { key: 'value.integrity', title: 'Integrity', body: 'Adhere to the highest standards of professionalism, ethics and personal responsibility, worthy of the trust our patients place in us.' },
                { key: 'value.quality', title: 'Quality of care', body: 'Deliver the best outcomes and highest quality service through the dedicated effort of every team member.' },
                { key: 'value.teamwork', title: 'Teamwork', body: 'Value the contributions of all, blending the skills of individual staff members in unsurpassed collaboration.' },
                { key: 'value.safety', title: 'Patient & staff safety', body: 'Safety shall never be compromised and nothing is more important to Afilas than the safety of our patients and our staff.' },
                { key: 'value.community', title: 'Community', body: 'We value meeting the vital responsibilities in the community we serve, and take a leadership role in enhancing the quality of life and health.' }
              ].map((v) => (
                <div key={v.key} className="border-l-2 border-clay-500 pl-5">
                  <h3 className="font-semibold text-clinical-900 mb-2">{t(v.key)}</h3>
                  <p className="text-sm text-clinical-700/80 leading-relaxed">{t(v.key + '_desc')}</p>
                </div>
              ))}
            </div>
          )}
          {activeSection === 'specialist-doctors' && (
            <div>
              <h3 className="font-display text-2xl text-clinical-900 mb-6">{t('about.specialists')}</h3>
              <div className="relative overflow-x-auto pb-6">
                <div className="flex gap-8 w-max animate-scroll-doctors">
                  {[
                    { name: 'Dr. Birhanu Yirga', specialty: 'General Surgeon', image: '/brhanu.jpg' },
                    { name: 'Dr. Fisha Gebeyehu', specialty: 'Neurosurgeon', image: '/Dr._Fsha-213x420.jpg' },
                    { name: 'Dr. Abrham Wanaw', specialty: 'Ophthalmologist', image: '/Dr_Abrham-213x420.jpg' },
                    { name: 'Dr. Dawit Muche', specialty: 'MD, Internist', image: '/dr_dawit-213x420.jpg' },
                    { name: 'Dr. Leul', specialty: 'Specialist', image: '/Dr.Leul_-213x420.jpg' }
                  ].map((doc) => (
                    <div key={doc.name} className="w-56 flex-shrink-0 text-center group">
                      <div className="relative w-48 h-48 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-clinical-200 to-clinical-400 group-hover:from-[#C5A059] group-hover:to-[#B8963A] transition-all duration-500 scale-105"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300 overflow-hidden">
                          <Image
                            src={doc.image}
                            alt={doc.name}
                            fill
                            className="object-contain rounded-full group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 192px) 100vw, 192px"
                          />
                        </div>
                        <div className="absolute inset-0 rounded-full border-4 border-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110"></div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-md group-hover:shadow-xl transition-all duration-300 border-2 border-transparent group-hover:border-[#C5A059]">
                        <h3 className="font-semibold text-clinical-900 text-lg group-hover:text-[#C5A059] transition-colors">
                          {doc.name}
                        </h3>
                        <p className="text-sm text-clinical-700/80">{doc.specialty}</p>
                      </div>
                    </div>
                  ))}
                  {/* Duplicate for seamless loop */}
                  {[
                    { name: 'Dr. Birhanu Yirga', specialty: 'General Surgeon', image: '/brhanu.jpg' },
                    { name: 'Dr. Fisha Gebeyehu', specialty: 'Neurosurgeon', image: '/Dr._Fsha-213x420.jpg' },
                    { name: 'Dr. Abrham Wanaw', specialty: 'Ophthalmologist', image: '/Dr_Abrham-213x420.jpg' },
                    { name: 'Dr. Dawit Muche', specialty: 'MD, Internist', image: '/dr_dawit-213x420.jpg' },
                    { name: 'Dr. Leul', specialty: 'Specialist', image: '/Dr.Leul_-213x420.jpg' }
                  ].map((doc, index) => (
                    <div key={`duplicate-${index}`} className="w-56 flex-shrink-0 text-center group">
                      <div className="relative w-48 h-48 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-clinical-200 to-clinical-400 group-hover:from-[#C5A059] group-hover:to-[#B8963A] transition-all duration-500 scale-105"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300 overflow-hidden">
                          <Image
                            src={doc.image}
                            alt={doc.name}
                            fill
                            className="object-contain rounded-full group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 192px) 100vw, 192px"
                          />
                        </div>
                        <div className="absolute inset-0 rounded-full border-4 border-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110"></div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-md group-hover:shadow-xl transition-all duration-300 border-2 border-transparent group-hover:border-[#C5A059]">
                        <h3 className="font-semibold text-clinical-900 text-lg group-hover:text-[#C5A059] transition-colors">
                          {doc.name}
                        </h3>
                        <p className="text-sm text-clinical-700/80">{doc.specialty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Standalone About Page with Split Layout (Text Left | Image Right)
export default function AboutPage() {
  const { t } = useLanguage();

  // Core values with translation keys
  const coreValues = [
    { key: 'value.compassion', title: 'Compassion', body: 'Provide the best care and treat patients and family members with sensitivity and empathy.' },
    { key: 'value.integrity', title: 'Integrity', body: 'Adhere to the highest standards of professionalism, ethics and personal responsibility, worthy of the trust our patients place in us.' },
    { key: 'value.quality', title: 'Quality of care', body: 'Deliver the best outcomes and highest quality service through the dedicated effort of every team member.' },
    { key: 'value.teamwork', title: 'Teamwork', body: 'Value the contributions of all, blending the skills of individual staff members in unsurpassed collaboration.' },
    { key: 'value.safety', title: 'Patient & staff safety', body: 'Safety shall never be compromised and nothing is more important to Afilas than the safety of our patients and our staff.' },
    { key: 'value.community', title: 'Community', body: 'We value meeting the vital responsibilities in the community we serve, and take a leadership role in enhancing the quality of life and health.' }
  ];

  const specialistDoctors = [
    { name: 'Dr. Birhanu Yirga', specialty: 'General Surgeon', image: '/brhanu.jpg' },
    { name: 'Dr. Fisha Gebeyehu', specialty: 'Neurosurgeon', image: '/Dr._Fsha-213x420.jpg' },
    { name: 'Dr. Abrham Wanaw', specialty: 'Ophthalmologist', image: '/Dr_Abrham-213x420.jpg' },
    { name: 'Dr. Dawit Muche', specialty: 'MD, Internist', image: '/dr_dawit-213x420.jpg' },
    { name: 'Dr. Leul', specialty: 'Specialist', image: '/Dr.Leul_-213x420.jpg' }
  ];

  return (
    <>
      {/* Split Hero Section - Text Left, Image Right */}
      <section className="bg-white py-12 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <p className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-semibold mb-4">
                {t('about.title')}
              </p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-clinical-900 mb-6 leading-tight">
                {t('about.subtitle')}
              </h1>
              <p className="text-clinical-700/80 text-base md:text-lg leading-relaxed mb-8">
                {t('about.desc')}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#what-is-afilas"
                  className="bg-[#C5A059] hover:bg-[#B8963A] text-white font-semibold px-6 py-3 rounded-full transition-colors duration-300 inline-flex items-center gap-2"
                >
                  {t('button.learn')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
                  </svg>
                </a>
                <a
                  href="/contact"
                  className="border-2 border-[#C5A059] text-[#8B6B3A] hover:bg-[#C5A059] hover:text-white font-semibold px-6 py-3 rounded-full transition-colors duration-300 inline-flex items-center gap-2"
                >
                  {t('button.contact')}
                </a>
              </div>
            </div>

            <div className="order-1 md:order-2 relative h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/banner-1.jpg"
                alt="Afilas General Hospital - About Us"
                fill
                className="object-cover object-center"
                priority
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 py-8 space-y-16">
        {/* What is Afilas? */}
        <section id="what-is-afilas" className="scroll-mt-20">
          <h2 className="font-display text-3xl text-clinical-900 mb-6">{t('about.what_title')}</h2>
          <div className="max-w-3xl space-y-4 text-clinical-800/90 leading-relaxed">
            <p>{t('about.what_desc1')}</p>
            <p>{t('about.what_desc2')}</p>
          </div>
        </section>

        {/* Vision/Mission with Cards */}
        <section id="vision-mission" className="scroll-mt-20">
          <h2 className="font-display text-3xl text-clinical-900 mb-6">{t('about.vision')}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group bg-white border-2 border-clinical-200 rounded-2xl p-8 hover:border-[#C5A059] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-gradient-to-br hover:from-white hover:to-[#C5A059]/5 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-[#C5A059]/20 font-display text-6xl font-bold group-hover:text-[#C5A059]/30 transition-all duration-500">01</div>
              <div className="relative z-10">
                <h2 className="font-display text-2xl text-clinical-900 mb-4 group-hover:text-[#C5A059] transition-colors duration-300">{t('about.vision_title')}</h2>
                <p className="text-clinical-700/90 leading-relaxed group-hover:text-clinical-600 transition-colors duration-300">
                  {t('about.vision_desc')}
                </p>
                <div className="mt-4 flex items-center gap-2 text-[#C5A059] opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-2">
                  <span className="text-sm font-medium">{t('button.learn')}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group bg-white border-2 border-clinical-200 rounded-2xl p-8 hover:border-[#C5A059] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-gradient-to-br hover:from-white hover:to-[#C5A059]/5 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-[#C5A059]/20 font-display text-6xl font-bold group-hover:text-[#C5A059]/30 transition-all duration-500">02</div>
              <div className="relative z-10">
                <h2 className="font-display text-2xl text-clinical-900 mb-4 group-hover:text-[#C5A059] transition-colors duration-300">{t('about.mission_title')}</h2>
                <ul className="text-clinical-700/90 leading-relaxed space-y-2 group-hover:text-clinical-600 transition-colors duration-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[#C5A059] mt-1">✓</span>
                    {t('about.mission_desc1')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C5A059] mt-1">✓</span>
                    {t('about.mission_desc2')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C5A059] mt-1">✓</span>
                    {t('about.mission_desc3')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C5A059] mt-1">✓</span>
                    {t('about.mission_desc4')}
                  </li>
                </ul>
                <div className="mt-4 flex items-center gap-2 text-[#C5A059] opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-2">
                  <span className="text-sm font-medium">{t('button.learn')}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section id="core-values" className="scroll-mt-20">
          <h2 className="font-display text-3xl text-clinical-900 mb-6">{t('about.values')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((v) => (
              <div key={v.key} className="border-l-2 border-clay-500 pl-5">
                <h3 className="font-semibold text-clinical-900 mb-2">{t(v.key)}</h3>
                <p className="text-sm text-clinical-700/80 leading-relaxed">{t(v.key + '_desc')}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Specialist Doctors */}
        <section id="specialist-doctors" className="scroll-mt-20">
          <h2 className="font-display text-3xl text-clinical-900 mb-6">{t('about.specialists')}</h2>
          <div className="relative overflow-x-auto pb-6">
            <div className="flex gap-8 w-max animate-scroll-doctors">
              {specialistDoctors.map((doc) => (
                <div key={doc.name} className="w-56 flex-shrink-0 text-center group">
                  <div className="relative w-48 h-48 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-clinical-200 to-clinical-400 group-hover:from-[#C5A059] group-hover:to-[#B8963A] transition-all duration-500 scale-105"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300 overflow-hidden">
                      <Image
                        src={doc.image}
                        alt={doc.name}
                        fill
                        className="object-contain rounded-full group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 192px) 100vw, 192px"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110"></div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md group-hover:shadow-xl transition-all duration-300 border-2 border-transparent group-hover:border-[#C5A059]">
                    <h3 className="font-semibold text-clinical-900 text-lg group-hover:text-[#C5A059] transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-sm text-clinical-700/80">{doc.specialty}</p>
                  </div>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {specialistDoctors.map((doc, index) => (
                <div key={`duplicate-${index}`} className="w-56 flex-shrink-0 text-center group">
                  <div className="relative w-48 h-48 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-clinical-200 to-clinical-400 group-hover:from-[#C5A059] group-hover:to-[#B8963A] transition-all duration-500 scale-105"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300 overflow-hidden">
                      <Image
                        src={doc.image}
                        alt={doc.name}
                        fill
                        className="object-contain rounded-full group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 192px) 100vw, 192px"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110"></div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md group-hover:shadow-xl transition-all duration-300 border-2 border-transparent group-hover:border-[#C5A059]">
                    <h3 className="font-semibold text-clinical-900 text-lg group-hover:text-[#C5A059] transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-sm text-clinical-700/80">{doc.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes scroll-doctors {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-doctors {
          animation: scroll-doctors 20s linear infinite;
        }
        .animate-scroll-doctors:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}