'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tx_ref = searchParams.get('tx_ref');
  const [status, setStatus] = useState('loading');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tx_ref) {
      setStatus('error');
      setError('No transaction reference found');
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

        const data = await response.json();
        console.log('📦 Verification response:', data);

        if (data.success) {
          setStatus('success');
          setPaymentData(data.data);
        } else {
          setStatus('failed');
          setError(data.message || 'Payment verification failed');
        }
      } catch (err) {
        console.error('❌ Verification error:', err);
        setStatus('error');
        setError(err.message || 'Failed to verify payment');
      }
    };

    verifyPayment();
  }, [tx_ref]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700">Verifying Payment...</h2>
          <p className="text-gray-500 mt-2">Please wait while we confirm your transaction</p>
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
          <h2 className="text-3xl font-bold text-green-600 mb-2">Payment Successful! 🎉</h2>
          <p className="text-gray-600 mb-6">Your payment has been confirmed successfully.</p>
          
          {paymentData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-medium truncate">{paymentData.transaction_id || paymentData.id}</span>
                
                <span className="text-gray-500">Reference:</span>
                <span className="font-medium truncate">{paymentData.tx_ref || tx_ref}</span>
                
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium">{paymentData.amount} ETB</span>
                
                <span className="text-gray-500">Status:</span>
                <span className="font-medium text-green-600">{paymentData.status}</span>
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Home
            </Link>
            <Link
              href="/appointments"
              className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              View My Appointments
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
        <h2 className="text-3xl font-bold text-red-600 mb-2">Payment Failed ❌</h2>
        <p className="text-gray-600 mb-6">
          {error || 'We could not verify your payment. Please try again or contact support.'}
        </p>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-red-700">
            <strong>Reference:</strong> {tx_ref || 'N/A'}
          </p>
          {paymentData && (
            <p className="text-sm text-red-700 mt-1">
              <strong>Status:</strong> {paymentData.status || 'Unknown'}
            </p>
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}