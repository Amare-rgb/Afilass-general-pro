'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageProvider';

// Types
interface PaymentData {
  transaction_id?: string;
  id?: string;
  tx_ref?: string;
  amount?: number | string;
  status?: string;
  [key: string]: unknown;
}

interface VerificationResponse {
  success: boolean;
  data?: PaymentData;
  message?: string;
}

type StatusType = 'loading' | 'success' | 'failed' | 'error';

// Separate component that uses useSearchParams
function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, t } = useLanguage();
  const tx_ref = searchParams.get('tx_ref');
  const [status, setStatus] = useState<StatusType>('loading');
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tx_ref) {
      setStatus('error');
      setError(t('payment.noReference') || 'No transaction reference found');
      return;
    }

    const verifyPayment = async () => {
      try {
        console.log('🔍 Verifying payment:', tx_ref);
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payment/verify?tx_ref=${tx_ref}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const data: VerificationResponse = await response.json();
        console.log('📦 Verification response:', data);

        if (data.success) {
          setStatus('success');
          setPaymentData(data.data || null);
        } else {
          setStatus('failed');
          setError(data.message || t('payment.verificationFailed') || 'Payment verification failed');
        }
      } catch (err: unknown) {
        console.error('❌ Verification error:', err);
        setStatus('error');
        if (err instanceof Error) {
          setError(err.message || t('payment.verificationFailed') || 'Failed to verify payment');
        } else {
          setError(t('payment.verificationFailed') || 'Failed to verify payment');
        }
      }
    };

    verifyPayment();
  }, [tx_ref, t]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700">
            {t('payment.verifying') || 'Verifying Payment...'}
          </h2>
          <p className="text-gray-500 mt-2">
            {t('payment.pleaseWait') || 'Please wait while we confirm your transaction'}
          </p>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-20 w-20 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-green-600 mb-2">
            {t('payment.success') || 'Payment Successful! 🎉'}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('payment.successMessage') || 'Your payment has been confirmed successfully.'}
          </p>
          
          {paymentData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-500">
                  {t('payment.transactionId') || 'Transaction ID:'}
                </span>
                <span className="font-medium truncate">{paymentData.transaction_id || paymentData.id || 'N/A'}</span>
                
                <span className="text-gray-500">
                  {t('payment.reference') || 'Reference:'}
                </span>
                <span className="font-medium truncate">{paymentData.tx_ref || tx_ref || 'N/A'}</span>
                
                <span className="text-gray-500">
                  {t('payment.amount') || 'Amount:'}
                </span>
                <span className="font-medium">{paymentData.amount ? `${paymentData.amount} ETB` : 'N/A'}</span>
                
                <span className="text-gray-500">
                  {t('payment.status') || 'Status:'}
                </span>
                <span className="font-medium text-green-600">{paymentData.status || 'Completed'}</span>
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('payment.returnHome') || 'Return to Home'}
            </Link>
            <Link
              href="/appointments"
              className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {t('payment.viewAppointments') || 'View My Appointments'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Failed/Error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="h-20 w-20 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-red-600 mb-2">
          {t('payment.failed') || 'Payment Failed ❌'}
        </h2>
        <p className="text-gray-600 mb-6">
          {error || t('payment.failedMessage') || 'We could not verify your payment. Please try again or contact support.'}
        </p>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-red-700">
            <strong>{t('payment.reference') || 'Reference:'}</strong> {tx_ref || 'N/A'}
          </p>
          {paymentData && (
            <p className="text-sm text-red-700 mt-1">
              <strong>{t('payment.status') || 'Status:'}</strong> {paymentData.status || 'Unknown'}
            </p>
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('payment.returnHome') || 'Return to Home'}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('payment.tryAgain') || 'Try Again'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function PaymentStatusPage() {
  const { language, t } = useLanguage();

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700">
            {language === 'am' ? 'በመጫን ላይ...' : 'Loading...'}
          </h2>
          <p className="text-gray-500 mt-2">
            {language === 'am' ? 'እባክዎ ይጠብቁ' : 'Please wait'}
          </p>
        </div>
      </div>
    }>
      <PaymentStatusContent />
    </Suspense>
  );
}