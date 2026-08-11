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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderData, setOrderData] = useState<PharmaOrder | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<PharmaOrderFormData>({
    resolver: zodResolver(pharmaOrderSchema),
    defaultValues: defaultValues,
  });

  // ✅ ACTUALLY SEND TO API
  const onSubmit = async (data: PharmaOrderFormData) => {
    setIsSubmitting(true);
    try {
      console.log('📡 Sending order to API:', data);
      
      // 🔥 USE PHARMA SERVICE TO CREATE ORDER
      const order = await pharmaService.createOrder({
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        drugName: data.drugName,
        quantity: data.quantity,
      });
      
      console.log('✅ Order created:', order);
      
      setOrderData(order);
      setShowConfirmation(true);
      toast.success('Order placed successfully! 🎉');
    } catch (error: any) {
      console.error('❌ Failed to place order:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmation Screen
  if (showConfirmation && orderData) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 pt-32">
          <div className="max-w-sm w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Confirmed! ✅</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Your pharmaceutical order has been placed.</p>
              
              <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-left space-y-0.5 max-h-48 overflow-y-auto">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Customer:</span> {orderData.customerName}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Email:</span> {orderData.customerEmail}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Phone:</span> {orderData.customerPhone}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Drug:</span> {orderData.drugName}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Quantity:</span> {orderData.quantity}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-600 pt-1 mt-1">
                  <span className="font-medium">Order ID:</span>{' '}
                  <span className="font-mono text-blue-600 dark:text-blue-400 text-[10px]">
                    #{orderData.id}
                  </span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Status:</span>{' '}
                  {/* 🔥 Changed from PENDING to PROCESSING */}
                  <span className="text-blue-600 font-medium">
                    PROCESSING
                  </span>
                </p>
              </div>

              <div className="mt-3 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={() => router.push('/')}
                  className="px-3 py-1.5 bg-black text-white text-xs rounded-lg hover:bg-gray-800 transition"
                >
                  Home
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Form
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-2 px-4 flex items-center justify-center pt-32">
        <div className="w-full max-w-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-[#73787E]">
              <h1 className="text-sm font-bold text-white text-center flex items-center justify-center gap-2">
                <Pill className="w-4 h-4" />
                Drug Manufacturing
              </h1>
              <p className="text-[11px] text-gray-200 text-center">
                Order medications & supplies
              </p>
            </div>

            <div className="p-2.5">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                {/* Customer Information */}
                <div className="space-y-1.5">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-0.5">
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      Customer Information
                    </h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                      Please provide your personal details
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                          {...register('customerName')}
                          type="text"
                          placeholder="Enter your full name"
                          className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white transition"
                        />
                      </div>
                      {errors.customerName && (
                        <p className="mt-0.5 text-[10px] text-red-600">{errors.customerName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                          {...register('customerEmail')}
                          type="email"
                          placeholder="your@email.com"
                          className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white transition"
                        />
                      </div>
                      {errors.customerEmail && (
                        <p className="mt-0.5 text-[10px] text-red-600">{errors.customerEmail.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                          {...register('customerPhone')}
                          type="tel"
                          placeholder="+251 9XX XXX XXX"
                          className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white transition"
                        />
                      </div>
                      {errors.customerPhone && (
                        <p className="mt-0.5 text-[10px] text-red-600">{errors.customerPhone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-1.5">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-0.5">
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                      <Pill className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      Order Details
                    </h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                      Tell us what you need
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                        Drug / Medicine Name *
                      </label>
                      <div className="relative">
                        <Pill className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                          {...register('drugName')}
                          type="text"
                          placeholder="e.g., Paracetamol 500mg"
                          className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white transition"
                        />
                      </div>
                      {errors.drugName && (
                        <p className="mt-0.5 text-[10px] text-red-600">{errors.drugName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                        Quantity *
                      </label>
                      <div className="relative">
                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                          {...register('quantity', { valueAsNumber: true })}
                          type="number"
                          min="1"
                          placeholder="Enter quantity"
                          className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white transition"
                        />
                      </div>
                      {errors.quantity && (
                        <p className="mt-0.5 text-[10px] text-red-600">{errors.quantity.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-all text-xs mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Place Order
                    </>
                  )}
                </button>

                <p className="text-center text-[9px] text-gray-400 dark:text-gray-500">
                  By placing an order, you agree to our terms and conditions
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}