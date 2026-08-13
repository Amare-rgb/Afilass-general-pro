'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Check,
  Loader2,
  User,
  Mail,
  Phone,
  Pill,
  Package,
  ShoppingCart,
} from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageProvider';
import { pharmaService } from '@/lib/pharma';
import { PharmaOrder } from '@/lib/types';

// ============================================================
// SCHEMA DEFINITION
// ============================================================
const pharmaOrderSchema = z.object({
  customerName: z.string().min(2, 'Full name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(10, 'Valid phone number is required'),
  drugName: z.string().min(2, 'Drug name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

type PharmaOrderFormData = z.infer<typeof pharmaOrderSchema>;

const defaultValues: PharmaOrderFormData = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  drugName: '',
  quantity: 1,
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function PharmaOrderPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isAm = language === 'am';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderData, setOrderData] = useState<PharmaOrder | null>(null);

  const t = (key: string): string => {
    const dict: Record<string, { en: string; am: string }> = {
      title: { en: 'Afilas Drug Manufacturing', am: 'አፊላስ የመድኃኒት ማምረቻ' },
      subtitle: { en: 'Order pharmaceutical products & supplies', am: 'የመድኃኒት ውጤቶችን እና አቅርቦቶችን ይዘዙ' },
      customerName: { en: 'Full Name *', am: 'ሙሉ ስም *' },
      customerNamePlaceholder: { en: 'Enter your full name', am: 'ሙሉ ስምዎን ያስገቡ' },
      customerEmail: { en: 'Email Address *', am: 'ኢሜይል አድራሻ *' },
      customerEmailPlaceholder: { en: 'your@email.com', am: 'እርስዎ@ኢሜይል.ኮም' },
      customerPhone: { en: 'Phone Number *', am: 'ስልክ ቁጥር *' },
      customerPhonePlaceholder: { en: '+251 9XX XXX XXX', am: '+251 9XX XXX XXX' },
      drugName: { en: 'Drug / Medicine Name *', am: 'የመድኃኒት ስም *' },
      drugNamePlaceholder: { en: 'e.g., Amoxicillin 500mg, Paracetamol...', am: 'ምሳሌ፡ ፓራሲታሞል፣ አሞክሳሲሊን...' },
      quantity: { en: 'Quantity *', am: 'ብዛት *' },
      quantityPlaceholder: { en: 'Enter quantity', am: 'ብዛት ያስገቡ' },
      placeOrder: { en: 'Place Order', am: 'ትዕዛዝ ያስገቡ' },
      placingOrder: { en: 'Placing Order...', am: 'ትዕዛዝ በመላክ ላይ...' },
      confirmed: { en: 'Confirmed! ✅', am: 'ተረጋግጧል! ✅' },
      confirmedSubtitle: { en: 'Your pharmaceutical order has been placed.', am: 'የመድኃኒት ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል።' },
      customerLabel: { en: 'Customer:', am: 'ደንበኛ፡' },
      emailLabel: { en: 'Email:', am: 'ኢሜይል፡' },
      phoneLabel: { en: 'Phone:', am: 'ስልክ፡' },
      drugLabel: { en: 'Drug Name:', am: 'የመድኃኒቱ ስም፡' },
      quantityLabel: { en: 'Quantity:', am: 'ብዛት፡' },
      statusLabel: { en: 'Status:', am: 'ሁኔታ፡' },
      processingStatus: { en: 'PROCESSING', am: 'በሂደት ላይ' },
      orderIdLabel: { en: 'Order ID:', am: 'የትዕዛዝ መለያ፡' },
      homeBtn: { en: 'Home', am: 'መነሻ' },
      printBtn: { en: 'Print', am: 'አትም' },
      termsText: { en: 'By placing an order, you agree to our terms and conditions', am: 'ትዕዛዝ በማስገባት በውሎቻችን እና ሁኔታዎቻችን ይስማማሉ' },
    };
    return dict[key]?.[isAm ? 'am' : 'en'] || key;
  };

  const { register, handleSubmit, formState: { errors } } = useForm<PharmaOrderFormData>({
    resolver: zodResolver(pharmaOrderSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: PharmaOrderFormData) => {
    setIsSubmitting(true);
    try {
      const order = await pharmaService.createOrder({
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        drugName: data.drugName,
        quantity: data.quantity,
      });
      
      setOrderData(order);
      setShowConfirmation(true);
      toast.success(isAm ? 'ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል! 🎉' : 'Order placed successfully! 🎉');
    } catch (error: any) {
      console.error('Failed to place order:', error);
      toast.error(error.message || (isAm ? 'ትዕዛዝ ማስገባት አልተቻለም' : 'Failed to place order'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmation Screen
  if (showConfirmation && orderData) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex items-center justify-center p-4 pt-32 pb-12">
          <div className="max-w-md w-full bg-card text-card-foreground rounded-2xl shadow-xl p-6 border border-border">
            <div className="text-center">
              <div className="w-14 h-14 bg-green-500/10 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-xl font-bold text-foreground">{t('confirmed')}</h1>
              <p className="text-xs text-muted-foreground mt-1">{t('confirmedSubtitle')}</p>
              
              <div className="mt-4 p-4 bg-muted/50 rounded-xl text-left space-y-2 max-h-60 overflow-y-auto border border-border">
                <p className="text-xs text-foreground">
                  <span className="font-semibold text-muted-foreground">{t('customerLabel')}</span> {orderData.customerName}
                </p>
                <p className="text-xs text-foreground">
                  <span className="font-semibold text-muted-foreground">{t('emailLabel')}</span> {orderData.customerEmail}
                </p>
                <p className="text-xs text-foreground">
                  <span className="font-semibold text-muted-foreground">{t('phoneLabel')}</span> {orderData.customerPhone}
                </p>
                <p className="text-xs text-foreground">
                  <span className="font-semibold text-muted-foreground">{t('drugLabel')}</span> {orderData.drugName}
                </p>
                <p className="text-xs text-foreground">
                  <span className="font-semibold text-muted-foreground">{t('quantityLabel')}</span> {orderData.quantity}
                </p>
                {orderData.id && (
                  <p className="text-xs text-foreground">
                    <span className="font-semibold text-muted-foreground">{t('orderIdLabel')}</span>{' '}
                    <span className="font-mono text-primary font-bold">
                      {orderData.id.slice(0, 8)}
                    </span>
                  </p>
                )}
                <p className="text-xs text-foreground">
                  <span className="font-semibold text-muted-foreground">{t('statusLabel')}</span>{' '}
                  <span className="text-primary font-semibold">
                    {t('processingStatus')}
                  </span>
                </p>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => router.push('/')}
                  className="px-4 py-2 bg-primary text-primary-foreground font-semibold text-xs rounded-xl hover:bg-primary/90 transition-all shadow-md"
                >
                  {t('homeBtn')}
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold text-xs rounded-xl hover:bg-secondary/80 transition-all"
                >
                  {t('printBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="py-8 px-4 flex items-center justify-center pt-28 sm:pt-32 pb-12">
        <div className="w-full max-w-md">
          <div className="bg-card text-card-foreground rounded-2xl shadow-xl border border-border overflow-hidden">
            {/* Header Banner */}
            <div className="px-5 py-3.5 border-b border-border bg-primary text-primary-foreground">
              <h1 className="text-base font-bold text-center">
                {t('title')}
              </h1>
              <p className="text-xs text-primary-foreground/80 text-center mt-0.5">
                {t('subtitle')}
              </p>
            </div>

            <div className="p-4 sm:p-5">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      {t('customerName')}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        {...register('customerName')}
                        type="text"
                        placeholder={t('customerNamePlaceholder')}
                        dir="ltr"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition outline-none"
                      />
                    </div>
                    {errors.customerName && (
                      <p className="mt-1 text-[10px] text-destructive font-medium">{errors.customerName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      {t('customerEmail')}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        {...register('customerEmail')}
                        type="email"
                        placeholder={t('customerEmailPlaceholder')}
                        dir="ltr"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition outline-none"
                      />
                    </div>
                    {errors.customerEmail && (
                      <p className="mt-1 text-[10px] text-destructive font-medium">{errors.customerEmail.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      {t('customerPhone')}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        {...register('customerPhone')}
                        type="tel"
                        placeholder={t('customerPhonePlaceholder')}
                        dir="ltr"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition outline-none"
                      />
                    </div>
                    {errors.customerPhone && (
                      <p className="mt-1 text-[10px] text-destructive font-medium">{errors.customerPhone.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-foreground/80 mb-1">
                        {t('drugName')}
                      </label>
                      <div className="relative">
                        <Pill className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          {...register('drugName')}
                          type="text"
                          placeholder={t('drugNamePlaceholder')}
                          dir="ltr"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition outline-none"
                        />
                      </div>
                      {errors.drugName && (
                        <p className="mt-1 text-[10px] text-destructive font-medium">{errors.drugName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground/80 mb-1">
                        {t('quantity')}
                      </label>
                      <div className="relative">
                        <Package className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          {...register('quantity', { valueAsNumber: true })}
                          type="number"
                          min="1"
                          placeholder={t('quantityPlaceholder')}
                          dir="ltr"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition outline-none"
                        />
                      </div>
                      {errors.quantity && (
                        <p className="mt-1 text-[10px] text-destructive font-medium">{errors.quantity.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-xs mt-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('placingOrder')}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      {t('placeOrder')}
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-muted-foreground pt-1">
                  {t('termsText')}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}