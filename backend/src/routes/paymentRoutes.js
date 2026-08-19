// routes/paymentRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

// ============================================================
// 🔐 CHAPA CONFIGURATION
// ============================================================
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
const CHAPA_API_URL = 'https://api.chapa.co/v1/transaction/initialize';
const CHAPA_VERIFY_URL = 'https://api.chapa.co/v1/transaction/verify/';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// ============================================================
// ✅ ROUTE 1: INITIATE PAYMENT
// POST /api/payment/initiate
// ============================================================
router.post('/initiate', async (req, res) => {
  try {
    const {
      amount,
      email,
      first_name,
      last_name,
      phone,
      appointment_id,
      doctor_name,
      order_id,
      description
    } = req.body;

    // Validate required fields
    if (!amount || !email || !first_name || !last_name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: amount, email, first_name, last_name, phone'
      });
    }

    // Validate amount
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount. Must be a positive number.'
      });
    }

    // Generate unique transaction reference
    const refId = appointment_id || order_id || `USER-${Date.now()}`;
    const tx_ref = `TX-${refId}-${Date.now()}`;

    const payload = {
      amount: amount.toString(),
      currency: 'ETB',
      email: email,
      first_name: first_name,
      last_name: last_name,
      phone_number: phone,
      tx_ref: tx_ref,
      callback_url: `${BASE_URL}/api/payment/verify?tx_ref=${tx_ref}`,
      return_url: `${CLIENT_URL}/payment/status?tx_ref=${tx_ref}`,
      customization: {
        title: 'Afilas Hospital',
        description: description || `Payment for ${doctor_name || 'Healthcare service'}`
      },
      // Optional: Add meta data for your reference
      meta: {
        appointment_id: appointment_id || '',
        order_id: order_id || '',
        doctor_name: doctor_name || ''
      }
    };

    console.log('📤 Initiating payment for:', { email, amount, tx_ref });

    const response = await axios.post(CHAPA_API_URL, payload, {
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;

    if (data.status === 'success' && data.data?.checkout_url) {
      // Save transaction to database (optional)
      // await saveTransaction({ tx_ref, amount, email, status: 'pending' });

      return res.status(200).json({
        success: true,
        checkout_url: data.data.checkout_url,
        tx_ref: tx_ref,
        message: 'Payment initiated successfully',
        data: {
          transaction_id: data.data.transaction_id,
          amount: amount,
          currency: 'ETB'
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment initialization failed',
        error: data.message || 'Unknown error from Chapa'
      });
    }
  } catch (error) {
    console.error('❌ Chapa Init Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    return res.status(500).json({
      success: false,
      message: 'Server error during payment initiation',
      error: error.response?.data?.message || error.message
    });
  }
});

// ============================================================
// ✅ ROUTE 2: VERIFY PAYMENT
// GET /api/payment/verify?tx_ref=TX-XXXX
// ============================================================
router.get('/verify', async (req, res) => {
  try {
    const { tx_ref } = req.query;

    if (!tx_ref) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing transaction reference (tx_ref)' 
      });
    }

    console.log('🔍 Verifying transaction:', tx_ref);

    const response = await axios.get(`${CHAPA_VERIFY_URL}${tx_ref}`, {
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`
      }
    });

    const data = response.data;

    if (data.status === 'success' && data.data?.status === 'success') {
      // Payment successful - update your database here
      console.log('✅ Payment verified successfully:', {
        tx_ref: data.data.tx_ref,
        amount: data.data.amount,
        email: data.data.email,
        payment_date: data.data.updated_at
      });

      // Update transaction status in database
      // await updateTransactionStatus(tx_ref, 'completed', data.data);

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          transaction_id: data.data.id,
          tx_ref: data.data.tx_ref,
          amount: data.data.amount,
          currency: data.data.currency,
          status: data.data.status,
          payment_method: data.data.payment_method,
          customer: {
            email: data.data.email,
            first_name: data.data.first_name,
            last_name: data.data.last_name
          },
          payment_date: data.data.updated_at
        }
      });
    } else {
      // Payment failed or pending
      console.log('⚠️ Payment not successful:', data);
      
      // Update transaction status in database
      // await updateTransactionStatus(tx_ref, 'failed', data.data);

      return res.status(400).json({
        success: false,
        message: data.message || 'Payment verification failed',
        status: data.data?.status || 'unknown',
        data: data.data || data
      });
    }
  } catch (error) {
    console.error('❌ Verify Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found. Please check your transaction reference.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error during verification',
      error: error.response?.data?.message || error.message
    });
  }
});

// ============================================================
// ✅ ROUTE 3: WEBHOOK FOR CHAPA (Real-time payment updates)
// POST /api/payment/webhook
// ============================================================
router.post('/webhook', async (req, res) => {
  try {
    const webhookData = req.body;
    console.log('🔔 Webhook received:', {
      event: webhookData.event,
      tx_ref: webhookData.data?.tx_ref,
      status: webhookData.data?.status
    });

    // Verify webhook signature (if Chapa provides one)
    // const signature = req.headers['x-chapa-signature'];
    // if (!verifySignature(signature, webhookData)) {
    //   return res.status(401).json({ status: 'invalid signature' });
    // }

    // Process webhook data
    if (webhookData.event === 'transaction.success') {
      // Payment successful
      const { tx_ref, amount, email, status } = webhookData.data;
      
      // Update your database
      // await updateTransactionStatus(tx_ref, 'completed', webhookData.data);
      
      // Send confirmation email/sms
      // await sendPaymentConfirmation(email, tx_ref, amount);
      
      console.log('✅ Webhook: Payment successful for', tx_ref);
    } else if (webhookData.event === 'transaction.failed') {
      // Payment failed
      const { tx_ref } = webhookData.data;
      // await updateTransactionStatus(tx_ref, 'failed');
      console.log('❌ Webhook: Payment failed for', tx_ref);
    } else if (webhookData.event === 'transaction.pending') {
      // Payment pending
      console.log('⏳ Webhook: Payment pending for', webhookData.data?.tx_ref);
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ 
      status: 'success', 
      message: 'Webhook received successfully' 
    });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Webhook processing failed' 
    });
  }
});

// ============================================================
// ✅ ROUTE 4: CHECK TRANSACTION STATUS
// GET /api/payment/status/:tx_ref
// ============================================================
router.get('/status/:tx_ref', async (req, res) => {
  try {
    const { tx_ref } = req.params;

    if (!tx_ref) {
      return res.status(400).json({
        success: false,
        message: 'Transaction reference is required'
      });
    }

    const response = await axios.get(`${CHAPA_VERIFY_URL}${tx_ref}`, {
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`
      }
    });

    const data = response.data;

    if (data.status === 'success') {
      return res.status(200).json({
        success: true,
        data: {
          tx_ref: data.data.tx_ref,
          status: data.data.status,
          amount: data.data.amount,
          currency: data.data.currency,
          email: data.data.email,
          payment_method: data.data.payment_method,
          payment_date: data.data.updated_at
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Unable to fetch transaction status',
        data: data
      });
    }
  } catch (error) {
    console.error('❌ Status Check Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while checking status',
      error: error.message
    });
  }
});

module.exports = router;