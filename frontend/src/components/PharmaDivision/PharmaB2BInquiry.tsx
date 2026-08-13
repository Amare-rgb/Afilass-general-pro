'use client'

import { useLanguage } from '@/contexts/LanguageProvider'
import { useEffect, useRef, useState } from 'react'
import {
  Building2,
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  FileText,
  ChevronDown,
  CheckCircle2,
  Loader2,
} from 'lucide-react'

type InquiryType = 'bulk_order' | 'contract_manufacturing' | 'distribution' | 'custom'

interface FormData {
  companyName: string
  contactPerson: string
  email: string
  phone: string
  companyType: string
  inquiryType: InquiryType | ''
  productInterest: string
  estimatedVolume: string
  message: string
}

const initialFormData: FormData = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  companyType: '',
  inquiryType: '',
  productInterest: '',
  estimatedVolume: '',
  message: '',
}

export function PharmaB2BInquiry() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData(initialFormData)
    }, 4000)
  }

  const inputClasses =
    'w-full px-4 py-3.5 bg-background border border-border rounded-xl text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200'
  const labelClasses = 'block text-sm font-semibold text-foreground/80 mb-2'
  const selectClasses =
    'w-full px-4 py-3.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 appearance-none cursor-pointer'

  return (
    <section
      id="b2b-inquiry"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden bg-card border-y border-border"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/3 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-accent/5 blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary tracking-wide uppercase">
              {t('pharma.b2b.badge')}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {t('pharma.b2b.title')}
          </h2>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            {t('pharma.b2b.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left: Contact Info (2 cols) */}
          <div
            className={`lg:col-span-2 space-y-8 transition-all duration-1000 ease-out delay-200 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            {/* Contact Cards */}
            <div className="space-y-4">
              {/* Phone */}
              <div className="group flex items-start gap-4 p-5 bg-background border border-border rounded-2xl hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {t('pharma.b2b.phone_label')}
                  </p>
                  <p className="text-foreground/70 text-sm">+251 (0) 911 234 567</p>
                  <p className="text-foreground/70 text-sm">+251 (0) 918 765 432</p>
                </div>
              </div>

              {/* Email */}
              <div className="group flex items-start gap-4 p-5 bg-background border border-border rounded-2xl hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {t('pharma.b2b.email_label')}
                  </p>
                  <p className="text-foreground/70 text-sm">b2b@afilaspharma.com</p>
                  <p className="text-foreground/70 text-sm">commercial@afilaspharma.com</p>
                </div>
              </div>

              {/* Location */}
              <div className="group flex items-start gap-4 p-5 bg-background border border-border rounded-2xl hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {t('pharma.b2b.location_label')}
                  </p>
                  <p className="text-foreground/70 text-sm">{t('pharma.b2b.location_value')}</p>
                </div>
              </div>

              {/* Hours */}
              <div className="group flex items-start gap-4 p-5 bg-background border border-border rounded-2xl hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {t('pharma.b2b.hours_label')}
                  </p>
                  <p className="text-foreground/70 text-sm">{t('pharma.b2b.hours_value')}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-5 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl">
                <p className="text-3xl font-bold text-primary mb-1">50+</p>
                <p className="text-xs text-foreground/60 font-medium">{t('pharma.b2b.stat1')}</p>
              </div>
              <div className="text-center p-5 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl">
                <p className="text-3xl font-bold text-primary mb-1">24h</p>
                <p className="text-xs text-foreground/60 font-medium">{t('pharma.b2b.stat2')}</p>
              </div>
            </div>
          </div>

          {/* Right: Dynamic Inquiry Form (3 cols) */}
          <div
            className={`lg:col-span-3 transition-all duration-1000 ease-out delay-400 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="bg-background border border-border rounded-3xl p-8 lg:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {t('pharma.b2b.form_title')}
                  </h3>
                  <p className="text-sm text-foreground/60">
                    {t('pharma.b2b.form_subtitle')}
                  </p>
                </div>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center pharma-success-enter">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-foreground mb-2">
                    {t('pharma.b2b.success_title')}
                  </h4>
                  <p className="text-foreground/60 max-w-sm">
                    {t('pharma.b2b.success_desc')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Row 1: Company + Contact */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClasses}>
                        {t('pharma.b2b.field_company')} *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                        placeholder={t('pharma.b2b.field_company_ph')}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>
                        {t('pharma.b2b.field_contact')} *
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                        placeholder={t('pharma.b2b.field_contact_ph')}
                      />
                    </div>
                  </div>

                  {/* Row 2: Email + Phone */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClasses}>
                        {t('pharma.b2b.field_email')} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                        placeholder={t('pharma.b2b.field_email_ph')}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>
                        {t('pharma.b2b.field_phone')}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder={t('pharma.b2b.field_phone_ph')}
                      />
                    </div>
                  </div>

                  {/* Row 3: Company Type + Inquiry Type */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="relative">
                      <label className={labelClasses}>
                        {t('pharma.b2b.field_company_type')} *
                      </label>
                      <select
                        name="companyType"
                        value={formData.companyType}
                        onChange={handleChange}
                        required
                        className={selectClasses}
                      >
                        <option value="">{t('pharma.b2b.select_placeholder')}</option>
                        <option value="hospital">{t('pharma.b2b.type_hospital')}</option>
                        <option value="pharmacy">{t('pharma.b2b.type_pharmacy')}</option>
                        <option value="distributor">{t('pharma.b2b.type_distributor')}</option>
                        <option value="clinic">{t('pharma.b2b.type_clinic')}</option>
                        <option value="government">{t('pharma.b2b.type_government')}</option>
                        <option value="other">{t('pharma.b2b.type_other')}</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-[42px] w-4 h-4 text-foreground/40 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <label className={labelClasses}>
                        {t('pharma.b2b.field_inquiry_type')} *
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        required
                        className={selectClasses}
                      >
                        <option value="">{t('pharma.b2b.select_placeholder')}</option>
                        <option value="bulk_order">{t('pharma.b2b.inquiry_bulk')}</option>
                        <option value="contract_manufacturing">{t('pharma.b2b.inquiry_contract')}</option>
                        <option value="distribution">{t('pharma.b2b.inquiry_distribution')}</option>
                        <option value="custom">{t('pharma.b2b.inquiry_custom')}</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-[42px] w-4 h-4 text-foreground/40 pointer-events-none" />
                    </div>
                  </div>

                  {/* Row 4: Product Interest + Volume */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClasses}>
                        {t('pharma.b2b.field_product')}
                      </label>
                      <input
                        type="text"
                        name="productInterest"
                        value={formData.productInterest}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder={t('pharma.b2b.field_product_ph')}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>
                        {t('pharma.b2b.field_volume')}
                      </label>
                      <input
                        type="text"
                        name="estimatedVolume"
                        value={formData.estimatedVolume}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder={t('pharma.b2b.field_volume_ph')}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className={labelClasses}>
                      {t('pharma.b2b.field_message')}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className={`${inputClasses} resize-none`}
                      placeholder={t('pharma.b2b.field_message_ph')}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t('pharma.b2b.submitting')}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t('pharma.b2b.submit')}
                      </>
                    )}
                  </button>

                  <p className="text-xs text-foreground/40 text-center">
                    {t('pharma.b2b.disclaimer')}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}