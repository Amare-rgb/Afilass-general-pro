// app/contact/page.tsx
'use client';

import { useState, FormEvent, useEffect } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Handle hash navigation
  useEffect(() => {
    if (window.location.hash === '#contact') {
      const element = document.getElementById('contact');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus({
        type: 'success',
        message: '✅ Your message has been sent successfully! We\'ll get back to you within 24 hours.',
      });
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: '❌ Something went wrong. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            <i className="fas fa-map-pin text-blue-600 mr-3"></i>
            Contact & Location
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get in touch with us or visit our location
          </p>
        </div>

        {/* Main Grid - Form on Left, Info on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Contact Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 border border-gray-100">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <i className="fas fa-paper-plane text-blue-600"></i>
                  Send us a message
                </h2>
                <p className="text-gray-500 text-sm mt-1">We'll respond within 24 hours</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-1">
                    <i className="fas fa-user text-blue-600 mr-2"></i>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Abebe Kebede"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                    <i className="fas fa-envelope text-blue-600 mr-2"></i>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                    <i className="fas fa-phone text-blue-600 mr-2"></i>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+251 9XX XXX XXX"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-1">
                    <i className="fas fa-tag text-blue-600 mr-2"></i>
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief subject"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
                    <i className="fas fa-comment text-blue-600 mr-2"></i>
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe your inquiry..."
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white resize-y text-sm"
                  ></textarea>
                </div>

                {submitStatus.type && (
                  <div
                    className={`p-2.5 rounded-xl text-sm ${
                      submitStatus.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2.5 px-6 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-3 text-sm ${
                    isSubmitting
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-2">
                  <i className="fas fa-lock text-gray-300 mr-1"></i>
                  Your information is secure
                </p>
              </form>
            </div>
          </div>

          {/* Right Column - Contact Information (Minimized) */}
          <div className="space-y-3">
            <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
              <div className="space-y-4">
                {/* Address */}
                <div>
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                    <i className="fas fa-location-dot text-blue-600"></i>
                    Address
                  </h3>
                  <p className="text-gray-600 text-sm mt-0.5 ml-6">
                    Bahir Dar, Kebele 13
                  </p>
                  <p className="text-gray-600 text-sm ml-6">
                    Around Felege Hiwot Hospital
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5 ml-6">
                    <i className="fas fa-clock mr-1"></i>
                    8:00 – 20:00 (Mon–Sat)
                  </p>
                </div>

                {/* Emergency Line */}
                <div>
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                    <i className="fas fa-phone-volume text-red-500"></i>
                    Emergency Line
                  </h3>
                  <p className="text-2xl font-bold text-red-600 mt-0.5 ml-6">8560</p>
                  <p className="text-gray-500 text-xs ml-6">Emergency Hotline</p>
                </div>

                {/* Phone */}
                <div>
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                    <i className="fas fa-phone text-blue-600"></i>
                    Phone
                  </h3>
                  <p className="text-gray-700 text-sm mt-0.5 ml-6">
                    +251 58 320 4167
                  </p>
                </div>

                {/* Email */}
                <div>
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                    <i className="fas fa-envelope text-purple-600"></i>
                    Email
                  </h3>
                  <p className="text-gray-700 text-sm mt-0.5 ml-6">
                    info@afilaspmms.com
                  </p>
                </div>

                {/* Working Hours */}
                <div className="pt-3 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                    <i className="fas fa-clock text-blue-600"></i>
                    Working Hours
                  </h3>
                  <p className="text-gray-700 text-sm mt-0.5 ml-6">Monday - Saturday</p>
                  <p className="text-gray-700 font-semibold text-sm ml-6">8:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Google Map - Full Width at Bottom */}
        <div className="mt-6">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-3 bg-gray-50 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                <i className="fas fa-map text-blue-600"></i>
                Find Us Here
              </h3>
            </div>
            <div className="h-[350px] md:h-[400px] w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.234567890123!2d37.390123!3d11.601234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDM2JzA0LjQiTiAzN8KwMjMnMjQuMCJF!5e0!3m2!1sen!2set!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Afila SPM Location Map"
              ></iframe>
            </div>
            <div className="p-3 bg-gray-50 border-t border-gray-100">
              <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <i className="fas fa-location-dot text-blue-600"></i>
                  Bahir Dar, Kebele 13
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="fas fa-hospital text-blue-600"></i>
                  Around Felege Hiwot Hospital
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="fas fa-clock text-blue-600"></i>
                  8:00 AM - 8:00 PM (Mon-Sat)
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="fas fa-phone text-blue-600"></i>
                  +251 58 320 4167
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}