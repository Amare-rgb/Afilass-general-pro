const { Resend } = require('resend');

// ============================================================
// 1. RESEND EMAIL INITIALIZATION
// ============================================================
const resendApiKey = process.env.RESEND_API_KEY;
let resendClient = null;

if (resendApiKey) {
  try {
    resendClient = new Resend(resendApiKey);
    console.log('✅ Resend Email service configured successfully');
  } catch (error) {
    console.warn('⚠️ Resend initialization failed:', error.message);
  }
} else {
  console.warn('⚠️ RESEND_API_KEY not set. Email notifications disabled.');
}

// ============================================================
// 2. AFROMESSAGE SMS INITIALIZATION
// ============================================================
const afroApiKey = process.env.AFROMESSAGE_API_KEY;
const afroSenderId = process.env.AFROMESSAGE_SENDER_ID || 'AfilasApp';
let afroSmsConfigured = false;

if (afroApiKey && afroApiKey.length > 10) {
  afroSmsConfigured = true;
  console.log('✅ AfroMessage SMS service configured successfully');
  console.log(`   📱 Sender ID: ${afroSenderId}`);
} else {
  console.warn('⚠️ AFROMESSAGE_API_KEY not set. SMS notifications disabled.');
}

// ============================================================
// 3. EMAIL SENDER FUNCTION
// ============================================================

async function sendEmail(to, subject, html, text = null) {
  try {
    if (!resendClient) {
      console.warn('⚠️ Resend not configured. Email not sent to:', to);
      return { success: false, error: 'Resend not configured', skipped: true };
    }

    const from = process.env.MAIL_FROM || 'Afilas Hospital <onboarding@resend.dev>';
    
    const data = await resendClient.emails.send({
      from: from,
      to: [to],
      subject: subject,
      html: html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });

    console.log(`✅ Email sent to ${to}:`, data.id || data);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('❌ Email send failed:', error.message || error);
    return { success: false, error: error.message || error };
  }
}

// ============================================================
// 4. SMS SENDER FUNCTION
// ============================================================

/**
 * Send SMS Notification via AfroMessage API
 */
async function sendSms(to, message) {
  try {
    if (!afroSmsConfigured) {
      console.warn('⚠️ AfroMessage not configured. SMS not sent to:', to);
      return { success: false, error: 'AfroMessage not configured', skipped: true };
    }

    // Clean phone number
    let cleanNumber = to.trim();
    cleanNumber = cleanNumber.replace(/\s/g, '');
    cleanNumber = cleanNumber.replace(/[^0-9+]/g, '');
    
    // Format for AfroMessage API (without +)
    let numberForApi = cleanNumber;
    if (numberForApi.startsWith('+')) {
      numberForApi = numberForApi.substring(1);
    }
    if (!numberForApi.startsWith('251')) {
      if (numberForApi.startsWith('0')) {
        numberForApi = '251' + numberForApi.substring(1);
      } else {
        numberForApi = '251' + numberForApi;
      }
    }

    console.log(`📱 Sending SMS to: ${numberForApi}`);
    console.log(`📝 Message length: ${message.length} chars`);

    const API_URL = 'https://api.afromessage.com/api/send';
    
    const requestBody = {
      to: numberForApi,
      message: message,
      sender_id: afroSenderId,
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${afroApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    
    // Check for HTML response
    if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
      console.error('❌ AfroMessage returned HTML');
      return { 
        success: false, 
        error: 'API returned HTML - check your API key',
      };
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Invalid JSON');
      return { success: false, error: 'Invalid JSON response' };
    }

    console.log('📊 AfroMessage Response:', JSON.stringify(data, null, 2));

    // Check for success
    if (response.ok && data.acknowledge === 'success') {
      console.log(`✅ SMS sent successfully!`);
      return { 
        success: true, 
        data: data,
        messageId: data.message_id || data.id
      };
    }

    // Handle errors
    if (data.acknowledge === 'error') {
      const errors = data.response?.errors || [];
      const errorMessage = errors.join(', ');
      
      if (errorMessage.includes('unverified')) {
        console.error('❌ Unverified contact number!');
        console.error(`   Please verify ${numberForApi} in AfroMessage dashboard`);
        return { 
          success: false, 
          error: 'Unverified contact. Please verify the phone number in AfroMessage dashboard.',
          phoneNumber: numberForApi
        };
      }
      
      console.error('❌ SMS failed:', errorMessage);
      return { 
        success: false, 
        error: errorMessage || 'SMS send failed',
        data: data
      };
    }

    return { 
      success: false, 
      error: data.message || 'SMS send failed',
      data: data
    };

  } catch (error) {
    console.error('❌ SMS send failed:', error.message || error);
    return { success: false, error: error.message || error };
  }
}

// ============================================================
// 5. HELPER: Build Email HTML with UTF-8 encoding
// ============================================================

function buildEmailHtml(title, location, content, isApproved = true) {
  const color = isApproved ? '#22c55e' : '#ef4444';
  const statusText = isApproved ? 'APPROVED ✅' : 'REJECTED ❌';
  const statusColor = isApproved ? '#22c55e' : '#ef4444';
  
  return `<!DOCTYPE html>
<html lang="am">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
        }
        .container {
            background: #ffffff;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            border: 1px solid #e5e7eb;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 3px solid ${color};
            margin-bottom: 25px;
        }
        .header h1 {
            color: ${color};
            margin: 0;
            font-size: 28px;
        }
        .header p {
            color: #6b7280;
            margin: 5px 0 0;
            font-size: 16px;
        }
        .content {
            padding: 5px 0;
        }
        .content p {
            font-size: 16px;
            margin: 10px 0;
        }
        .details {
            background: ${isApproved ? '#f0fdf4' : '#fef2f2'};
            padding: 18px 20px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid ${color};
        }
        .details h3 {
            margin: 0 0 12px 0;
            color: ${isApproved ? '#166534' : '#991b1b'};
            font-size: 17px;
        }
        .details p {
            margin: 6px 0;
            font-size: 15px;
        }
        .details .label {
            font-weight: 600;
            color: #4b5563;
        }
        .footer {
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 13px;
            color: #9ca3af;
            margin-top: 20px;
        }
        .status-badge {
            display: inline-block;
            background: ${statusColor};
            color: white;
            padding: 4px 14px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
        }
        .amharic {
            font-family: 'Noto Sans Ethiopic', 'Nyala', 'Abyssinica SIL', 'Visual Geez Unicode', sans-serif;
            font-size: 17px;
            line-height: 1.8;
        }
        .divider {
            border: none;
            border-top: 2px dashed #e5e7eb;
            margin: 25px 0;
        }
        .bilingual-section {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px dashed #e5e7eb;
        }
        .bilingual-section .amharic {
            margin-top: 10px;
        }
        .phone-highlight {
            background: #dbeafe;
            padding: 2px 10px;
            border-radius: 6px;
            font-weight: 700;
            color: #1d4ed8;
        }
        @media only screen and (max-width: 480px) {
            .container { padding: 20px; }
            .header h1 { font-size: 22px; }
            .details p { font-size: 14px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
            <p>${location}</p>
        </div>
        
        <div class="content">
            ${content}
        </div>
        
        <div class="footer">
            <p>${location} &copy; ${new Date().getFullYear()}</p>
            <p style="margin-top: 4px;">Email: info@afilashospital.com | Phone: +251 9XX XXX XXX</p>
        </div>
    </div>
</body>
</html>`;
}

// ============================================================
// 6. APPOINTMENT NOTIFICATIONS
// ============================================================

/**
 * Send Appointment Approved Notification
 * Email: Full HTML with UTF-8 encoding for Amharic
 * SMS: Clean, concise bilingual version (under 200 chars)
 */
async function sendAppointmentApproved(appointment) {
  const location = appointment.location || 'Afilas General Hospital';
  const patientName = appointment.patientName || 'Patient';
  
  // Format date
  const dateStr = new Date(appointment.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  
  // Format time
  const timeStr = appointment.time || new Date(appointment.date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const subject = `✅ Appointment Approved - ${patientName}`;

  // ============================================================
  // EMAIL CONTENT - HTML with proper UTF-8 encoding
  // ============================================================
  const emailContent = `
    <p style="font-size: 16px;">Dear <strong>${patientName}</strong>,</p>
    <p style="font-size: 16px;">Your appointment has been <strong style="color: #22c55e;">APPROVED</strong> and confirmed.</p>
    
    <div class="details">
        <h3>Appointment Details</h3>
        <p><span class="label">Patient:</span> ${patientName}</p>
        <p><span class="label">Date:</span> ${dateStr}</p>
        <p><span class="label">Time:</span> ${timeStr}</p>
        <p><span class="label">Hospital Type:</span> ${location}</p>
        <p><span class="label">Treatment Center:</span> ${appointment.visitType || 'HOSPITAL'}</p>
        ${appointment.doctor ? `<p><span class="label">Doctor:</span> Dr. ${appointment.doctor.name}</p>` : ''}
        <p><span class="label">Status:</span> <span class="status-badge">CONFIRMED</span></p>
    </div>
    
    <p style="font-size: 15px; color: #4b5563;">Please arrive <strong>15 minutes</strong> before your scheduled time to check in.</p>
    <p style="font-size: 15px; color: #4b5563;">If you need to reschedule, please contact us.</p>
    
    <hr class="divider">
    
    <div class="bilingual-section">
        <p style="font-size: 16px; font-weight: 600; color: #1f2937;">በአማርኛ / In Amharic</p>
        <div class="amharic">
            <p>ውድ <strong>${patientName}</strong>፤</p>
            <p>የቀጠሮ ጥያቄዎ <strong style="color: #22c55e;">ጸድቋል</strong> እና ተረጋግጧል።</p>
            
            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 12px 0; border-left: 4px solid #22c55e;">
                <p style="font-weight: 600; margin: 0 0 10px 0; color: #166534;">የቀጠሮ ዝርዝር</p>
                <p><span style="font-weight: 600;">ታካሚ:</span> ${patientName}</p>
                <p><span style="font-weight: 600;">ቀን:</span> ${dateStr}</p>
                <p><span style="font-weight: 600;">ሰዓት:</span> ${timeStr}</p>
                <p><span style="font-weight: 600;">የሆስፒታል አይነት:</span> ${location}</p>
                <p><span style="font-weight: 600;">መታከሚያ ቦታ:</span> ${appointment.visitType || 'HOSPITAL'}</p>
                ${appointment.doctor ? `<p><span style="font-weight: 600;">ሐኪም:</span> ዶ/ር ${appointment.doctor.name}</p>` : ''}
                <p><span style="font-weight: 600;">ሁኔታ:</span> <span style="color: #22c55e; font-weight: 600;">ጸድቋል</span></p>
            </div>
            
            <p>እባክዎ ከተቆረጠልዎት ሰዓት <strong>15 ደቂቃ</strong> ቀደም ብለው በመገኘት ሪፖርት ያድርጉ።</p>
            <p>ቀጠሮውን መቀየር ከፈለጉ እባክዎን ያነጋግሩን።</p>
        </div>
    </div>
  `;

  const html = buildEmailHtml(
    '✅ Appointment Approved!',
    location,
    emailContent,
    true
  );

  // ============================================================
  // EMAIL TEXT (Plain version for fallback)
  // ============================================================
  const text = `
✅ Appointment Approved!
${location}

Dear ${patientName},
Your appointment has been APPROVED and confirmed.

Appointment Details:
Patient: ${patientName}
Date: ${dateStr}
Time: ${timeStr}
Hospital Type: ${location}
Treatment Center: ${appointment.visitType || 'HOSPITAL'}
Status: CONFIRMED

Please arrive 15 minutes before your scheduled time to check in.
If you need to reschedule, please contact us.

--- Amharic ---

ውድ ${patientName}፤
የቀጠሮ ጥያቄዎ ደርሷል እና ተረጋግጧል።

የቀጠሮ ዝርዝር:
ታካሚ: ${patientName}
ቀን: ${dateStr}
ሰዓት: ${timeStr}
የሆስፒታል አይነት: ${location}
መታከሚያ ቦታ: ${appointment.visitType || 'HOSPITAL'}
ሁኔታ: ደርሷል

እባክዎ 15 ደቂቃ ቀደም ብለው ይገኙ።
ቀጠሮውን መቀየር ከፈለጉ ያነጋግሩን።
  `;

  // ============================================================
  // SMS - CLEAN, CONCISE, UNDER 200 CHARACTERS
  // ============================================================
  const smsMessage = 
`✅ Appt Approved ${patientName} ${dateStr} ${timeStr} ${location}. Arrive 15min early.

ቀጠሮ ደርሷል ${patientName} ${dateStr} ${timeStr} ${location}. 15 ደቂቃ ቀድመው ይገኙ.`;

  // Send Email
  const emailResult = await sendEmail(appointment.patientEmail, subject, html, text);
  
  // Send SMS
  let smsResult = null;
  if (appointment.patientPhone && afroSmsConfigured) {
    console.log(`📱 Sending SMS to ${appointment.patientPhone}`);
    console.log(`📝 SMS length: ${smsMessage.length} chars`);
    smsResult = await sendSms(appointment.patientPhone, smsMessage);
  }

  return { email: emailResult, sms: smsResult };
}

/**
 * Send Appointment Rejected Notification
 */
async function sendAppointmentRejected(appointment) {
  const location = appointment.location || 'Afilas General Hospital';
  const patientName = appointment.patientName || 'Patient';
  
  // Format date
  const dateStr = new Date(appointment.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  
  // Format time
  const timeStr = appointment.time || new Date(appointment.date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const subject = `❌ Appointment Rejected - ${patientName}`;

  // ============================================================
  // EMAIL CONTENT - HTML with proper UTF-8 encoding
  // ============================================================
  const emailContent = `
    <p style="font-size: 16px;">Dear <strong>${patientName}</strong>,</p>
    <p style="font-size: 16px;">We regret to inform you that your appointment has been <strong style="color: #ef4444;">REJECTED</strong>.</p>
    
    <div class="details">
        <h3>Appointment Details</h3>
        <p><span class="label">Patient:</span> ${patientName}</p>
        <p><span class="label">Date:</span> ${dateStr}</p>
        <p><span class="label">Time:</span> ${timeStr}</p>
        <p><span class="label">Hospital Type:</span> ${location}</p>
        <p><span class="label">Treatment Center:</span> ${appointment.visitType || 'HOSPITAL'}</p>
        <p><span class="label">Status:</span> <span class="status-badge" style="background: #ef4444;">CANCELLED</span></p>
    </div>
    
    <p style="font-size: 15px; color: #4b5563;">If you have any questions, please contact our support team.</p>
    <p style="font-size: 15px; color: #4b5563;">We apologize for any inconvenience.</p>
    
    <hr class="divider">
    
    <div class="bilingual-section">
        <p style="font-size: 16px; font-weight: 600; color: #1f2937;">በአማርኛ / In Amharic</p>
        <div class="amharic">
            <p>ውድ <strong>${patientName}</strong>፤</p>
            <p>የቀጠሮ ጥያቄዎ <strong style="color: #ef4444;">ውድቅ ተደርጓል</strong>።</p>
            
            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 12px 0; border-left: 4px solid #ef4444;">
                <p style="font-weight: 600; margin: 0 0 10px 0; color: #991b1b;">የቀጠሮ ዝርዝር</p>
                <p><span style="font-weight: 600;">ታካሚ:</span> ${patientName}</p>
                <p><span style="font-weight: 600;">ቀን:</span> ${dateStr}</p>
                <p><span style="font-weight: 600;">ሰዓት:</span> ${timeStr}</p>
                <p><span style="font-weight: 600;">የሆስፒታል አይነት:</span> ${location}</p>
                <p><span style="font-weight: 600;">መታከሚያ ቦታ:</span> ${appointment.visitType || 'HOSPITAL'}</p>
                <p><span style="font-weight: 600;">ሁኔታ:</span> <span style="color: #ef4444; font-weight: 600;">ውድቅ ተደርጓል</span></p>
            </div>
            
            <p>ማንኛውም ጥያቄ ካለዎት እባክዎን ያነጋግሩን።</p>
            <p>ለደረሰው ችግር ይቅርታ እንጠይቃለን።</p>
        </div>
    </div>
  `;

  const html = buildEmailHtml(
    '❌ Appointment Rejected',
    location,
    emailContent,
    false
  );

  // ============================================================
  // EMAIL TEXT (Plain version for fallback)
  // ============================================================
  const text = `
❌ Appointment Rejected
${location}

Dear ${patientName},
We regret to inform you that your appointment has been REJECTED.

Appointment Details:
Patient: ${patientName}
Date: ${dateStr}
Time: ${timeStr}
Hospital Type: ${location}
Treatment Center: ${appointment.visitType || 'HOSPITAL'}
Status: CANCELLED

If you have any questions, please contact our support team.
We apologize for any inconvenience.

--- Amharic ---

ውድ ${patientName}፤
የቀጠሮ ጥያቄዎ ውድቅ ተደርጓል።

የቀጠሮ ዝርዝር:
ታካሚ: ${patientName}
ቀን: ${dateStr}
ሰዓት: ${timeStr}
የሆስፒታል አይነት: ${location}
መታከሚያ ቦታ: ${appointment.visitType || 'HOSPITAL'}
ሁኔታ: ውድቅ ተደርጓል

ማንኛውም ጥያቄ ካለዎት ያነጋግሩን።
ለደረሰው ችግር ይቅርታ እንጠይቃለን።
  `;

  // ============================================================
  // SMS - CLEAN, CONCISE, UNDER 200 CHARACTERS
  // ============================================================
  const smsMessage = 
`❌ Appt Rejected ${patientName} ${dateStr} ${timeStr} ${location}. Contact support.

ቀጠሮ ውድቅ ${patientName} ${dateStr} ${timeStr} ${location}. ያነጋግሩን.`;

  // Send Email
  const emailResult = await sendEmail(appointment.patientEmail, subject, html, text);
  
  // Send SMS
  let smsResult = null;
  if (appointment.patientPhone && afroSmsConfigured) {
    console.log(`📱 Sending SMS to ${appointment.patientPhone}`);
    console.log(`📝 SMS length: ${smsMessage.length} chars`);
    smsResult = await sendSms(appointment.patientPhone, smsMessage);
  }

  return { email: emailResult, sms: smsResult };
}

// ============================================================
// 7. PHARMA ORDER NOTIFICATIONS (CUSTOM BILINGUAL MESSAGE)
// ============================================================

/**
 * Send Pharma Order Approved Notification
 * Custom bilingual message: Amharic + English
 */
async function sendPharmaOrderApproved(order) {
  const PHONE_NUMBER = '+251583204167';
  const customerName = order.customerName || 'Customer';
  
  const subject = `✅ Order Approved - #${order.id.slice(-8)}`;

  // ============================================================
  // SMS - Bilingual (Amharic + English)
  // ============================================================
  const smsMessage = 
`ውድ ደንበኛችን አቶ ${customerName}፣ ያዘዟቸው መድኃኒቶች ዝግጁ ስለሆኑ መጥተው መውሰድ ይችላሉ። ወይም ወደላችሁበት ቦታ እንድንልካላችሁ ከፈለጉ በ ${PHONE_NUMBER} ይደውሉልን።

አፊላስ መድኃኒት ማምረቻና ማሰራጫ

Dear Customer Mr. ${customerName}, your ordered medications are ready for pickup. If you want us to deliver them to your location, please call us at ${PHONE_NUMBER}.

Afilas Drug Manufacturing`;

  // ============================================================
  // EMAIL HTML - Bilingual (Amharic + English)
  // ============================================================
  const html = `
  <!DOCTYPE html>
  <html lang="am">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>${subject}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background: #f9fafb;
        line-height: 1.6;
      }
      .container {
        background: #ffffff;
        border-radius: 12px;
        padding: 30px;
        border: 1px solid #e5e7eb;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
        border-bottom: 3px solid #22c55e;
        margin-bottom: 25px;
      }
      .header h1 {
        color: #22c55e;
        margin: 0;
        font-size: 28px;
      }
      .header p {
        color: #6b7280;
        margin: 5px 0 0;
        font-size: 16px;
      }
      .details {
        background: #f0fdf4;
        padding: 18px 20px;
        border-radius: 8px;
        margin: 15px 0;
        border-left: 4px solid #22c55e;
      }
      .details .label {
        font-weight: 600;
        color: #4b5563;
      }
      .footer {
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
        text-align: center;
        font-size: 12px;
        color: #9ca3af;
        margin-top: 20px;
      }
      .amharic {
        font-family: 'Noto Sans Ethiopic', 'Nyala', 'Abyssinica SIL', 'Visual Geez Unicode', sans-serif;
        font-size: 17px;
        line-height: 1.8;
        background: #f8fafc;
        padding: 20px;
        border-radius: 8px;
        margin: 15px 0;
      }
      .english {
        font-size: 16px;
        line-height: 1.8;
        background: #f8fafc;
        padding: 20px;
        border-radius: 8px;
        margin: 15px 0;
      }
      .divider {
        border: none;
        border-top: 2px dashed #e5e7eb;
        margin: 25px 0;
      }
      .phone-highlight {
        background: #dbeafe;
        padding: 2px 10px;
        border-radius: 6px;
        font-weight: 700;
        color: #1d4ed8;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>✅ Order Approved!</h1>
        <p>Afilas Drug Manufacturing</p>
        <p style="font-size: 14px; color: #6b7280;">Order #${order.id.slice(-8)}</p>
      </div>

      <!-- Order Details -->
      <div class="details">
        <h3 style="margin: 0 0 10px 0; color: #166534;">Order Details</h3>
        <p><span class="label">Customer:</span> ${order.customerName}</p>
        <p><span class="label">Email:</span> ${order.customerEmail}</p>
        <p><span class="label">Phone:</span> ${order.customerPhone}</p>
        <p><span class="label">Drug:</span> ${order.drugName}</p>
        <p><span class="label">Quantity:</span> ${order.quantity}</p>
        <p><span class="label">Status:</span> <span style="color: #22c55e; font-weight: bold;">✅ COMPLETED</span></p>
      </div>

      <hr class="divider">

      <!-- Amharic Message -->
      <div class="amharic">
        <p style="font-size: 18px; font-weight: 700; color: #1f2937;">📝 በአማርኛ</p>
        <p style="font-size: 17px;">
          ውድ ደንበኛችን <strong>አቶ ${customerName}</strong>፣
        </p>
        <p style="font-size: 17px;">
          ያዘዟቸው መድኃኒቶች ዝግጁ ስለሆኑ መጥተው መውሰድ ይችላሉ። 
          ወይም ወደላችሁበት ቦታ እንድንልካላችሁ ከፈለጉ በ 
          <span class="phone-highlight">${PHONE_NUMBER}</span> 
          ይደውሉልን።
        </p>
        <p style="font-size: 17px; margin-top: 10px; font-weight: 600; color: #1e40af;">
          አፊላስ መድኃኒት ማምረቻና ማሰራጫ
        </p>
        <p style="font-size: 14px; color: #6b7280; margin-top: 5px;">
          ለበለጠ መረጃ በ ${PHONE_NUMBER} ይደውሉልን
        </p>
      </div>

      <hr class="divider">

      <!-- English Message -->
      <div class="english">
        <p style="font-size: 18px; font-weight: 700; color: #1f2937;">📝 In English</p>
        <p style="font-size: 16px;">
          Dear Customer <strong>Mr. ${customerName}</strong>,
        </p>
        <p style="font-size: 16px;">
          Your ordered medications are <strong style="color: #22c55e;">ready for pickup</strong>. 
          If you want us to <strong>deliver them to your location</strong>, 
          please call us at <span class="phone-highlight">${PHONE_NUMBER}</span>.
        </p>
        <p style="font-size: 16px; margin-top: 10px; font-weight: 600; color: #1e40af;">
          Afilas Drug Manufacturing
        </p>
        <p style="font-size: 14px; color: #6b7280; margin-top: 5px;">
          For more information, call us at ${PHONE_NUMBER}
        </p>
      </div>

      <div class="footer">
        <p>Afilas Drug Manufacturing &copy; ${new Date().getFullYear()}</p>
        <p style="margin-top: 4px;">Email: info@afilashospital.com | Phone: ${PHONE_NUMBER}</p>
        <p style="margin-top: 4px; font-size: 11px; color: #d1d5db;">Order #${order.id}</p>
      </div>
    </div>
  </body>
  </html>`;

  // ============================================================
  // EMAIL TEXT (Plain version for fallback)
  // ============================================================
  const text = `
✅ Order Approved - #${order.id.slice(-8)}
Afilas Drug Manufacturing

--- Amharic ---
ውድ ደንበኛችን አቶ ${customerName}፣
ያዘዟቸው መድኃኒቶች ዝግጁ ስለሆኑ መጥተው መውሰድ ይችላሉ። 
ወይም ወደላችሁበት ቦታ እንድንልካላችሁ ከፈለጉ በ ${PHONE_NUMBER} ይደውሉልን።

አፊላስ መድኃኒት ማምረቻና ማሰራጫ

--- English ---
Dear Customer Mr. ${customerName},
Your ordered medications are ready for pickup. 
If you want us to deliver them to your location, please call us at ${PHONE_NUMBER}.

Afilas Drug Manufacturing

Order Details:
- Customer: ${order.customerName}
- Drug: ${order.drugName}
- Quantity: ${order.quantity}
- Status: COMPLETED

Thank you for choosing Afilas Drug Manufacturing.
  `;

  // ============================================================
  // SEND NOTIFICATIONS
  // ============================================================
  const emailResult = await sendEmail(order.customerEmail, subject, html, text);
  
  let smsResult = null;
  if (order.customerPhone && afroSmsConfigured) {
    console.log(`📱 Sending pharma approval SMS to ${order.customerPhone}`);
    // Truncate SMS if too long (max 1600 chars for AfroMessage)
    const smsToSend = smsMessage.length > 1600 ? smsMessage.substring(0, 1597) + '...' : smsMessage;
    smsResult = await sendSms(order.customerPhone, smsToSend);
  }

  return { email: emailResult, sms: smsResult };
}

/**
 * Send Pharma Order Rejected Notification
 */
async function sendPharmaOrderRejected(order) {
  const PHONE_NUMBER = '+251583204167';
  const customerName = order.customerName || 'Customer';
  
  const subject = `❌ Order Rejected - #${order.id.slice(-8)}`;
  
  // ============================================================
  // SMS - Bilingual (Amharic + English)
  // ============================================================
  const smsMessage = 
`ውድ ደንበኛችን አቶ ${customerName}፣ ያዘዟቸው መድኃኒቶች ውድቅ ተደርጓል። ለበለጠ መረጃ በ ${PHONE_NUMBER} ይደውሉልን።

አፊላስ መድኃኒት ማምረቻና ማሰራጫ

Dear Customer Mr. ${customerName}, your order has been REJECTED. For more information, please call us at ${PHONE_NUMBER}.

Afilas Drug Manufacturing`;

  // ============================================================
  // EMAIL HTML - Bilingual (Amharic + English)
  // ============================================================
  const html = `
  <!DOCTYPE html>
  <html lang="am">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>${subject}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background: #f9fafb;
        line-height: 1.6;
      }
      .container {
        background: #ffffff;
        border-radius: 12px;
        padding: 30px;
        border: 1px solid #e5e7eb;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
        border-bottom: 3px solid #ef4444;
        margin-bottom: 25px;
      }
      .header h1 {
        color: #ef4444;
        margin: 0;
        font-size: 28px;
      }
      .header p {
        color: #6b7280;
        margin: 5px 0 0;
        font-size: 16px;
      }
      .details {
        background: #fef2f2;
        padding: 18px 20px;
        border-radius: 8px;
        margin: 15px 0;
        border-left: 4px solid #ef4444;
      }
      .details .label {
        font-weight: 600;
        color: #4b5563;
      }
      .footer {
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
        text-align: center;
        font-size: 12px;
        color: #9ca3af;
        margin-top: 20px;
      }
      .amharic {
        font-family: 'Noto Sans Ethiopic', 'Nyala', 'Abyssinica SIL', 'Visual Geez Unicode', sans-serif;
        font-size: 17px;
        line-height: 1.8;
        background: #f8fafc;
        padding: 20px;
        border-radius: 8px;
        margin: 15px 0;
      }
      .english {
        font-size: 16px;
        line-height: 1.8;
        background: #f8fafc;
        padding: 20px;
        border-radius: 8px;
        margin: 15px 0;
      }
      .divider {
        border: none;
        border-top: 2px dashed #e5e7eb;
        margin: 25px 0;
      }
      .phone-highlight {
        background: #dbeafe;
        padding: 2px 10px;
        border-radius: 6px;
        font-weight: 700;
        color: #1d4ed8;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>❌ Order Rejected</h1>
        <p>Afilas Drug Manufacturing</p>
        <p style="font-size: 14px; color: #6b7280;">Order #${order.id.slice(-8)}</p>
      </div>

      <div class="details">
        <h3 style="margin: 0 0 10px 0; color: #991b1b;">Order Details</h3>
        <p><span class="label">Customer:</span> ${order.customerName}</p>
        <p><span class="label">Drug:</span> ${order.drugName}</p>
        <p><span class="label">Quantity:</span> ${order.quantity}</p>
        <p><span class="label">Status:</span> <span style="color: #ef4444; font-weight: bold;">❌ CANCELLED</span></p>
      </div>

      <hr class="divider">

      <div class="amharic">
        <p style="font-size: 18px; font-weight: 700; color: #1f2937;">📝 በአማርኛ</p>
        <p style="font-size: 17px;">
          ውድ ደንበኛችን <strong>አቶ ${customerName}</strong>፣
        </p>
        <p style="font-size: 17px;">
          ያዘዟቸው መድኃኒቶች <strong style="color: #ef4444;">ውድቅ ተደርጓል</strong>። 
          ለበለጠ መረጃ በ <span class="phone-highlight">${PHONE_NUMBER}</span> ይደውሉልን።
        </p>
        <p style="font-size: 17px; margin-top: 10px; font-weight: 600; color: #1e40af;">
          አፊላስ መድኃኒት ማምረቻና ማሰራጫ
        </p>
      </div>

      <hr class="divider">

      <div class="english">
        <p style="font-size: 18px; font-weight: 700; color: #1f2937;">📝 In English</p>
        <p style="font-size: 16px;">
          Dear Customer <strong>Mr. ${customerName}</strong>,
        </p>
        <p style="font-size: 16px;">
          Your order has been <strong style="color: #ef4444;">REJECTED</strong>. 
          For more information, please call us at <span class="phone-highlight">${PHONE_NUMBER}</span>.
        </p>
        <p style="font-size: 16px; margin-top: 10px; font-weight: 600; color: #1e40af;">
          Afilas Drug Manufacturing
        </p>
      </div>

      <div class="footer">
        <p>Afilas Drug Manufacturing &copy; ${new Date().getFullYear()}</p>
        <p style="margin-top: 4px;">Email: info@afilashospital.com | Phone: ${PHONE_NUMBER}</p>
      </div>
    </div>
  </body>
  </html>`;

  // ============================================================
  // EMAIL TEXT (Plain version for fallback)
  // ============================================================
  const text = `
❌ Order Rejected - #${order.id.slice(-8)}
Afilas Drug Manufacturing

--- Amharic ---
ውድ ደንበኛችን አቶ ${customerName}፣
ያዘዟቸው መድኃኒቶች ውድቅ ተደርጓል። 
ለበለጠ መረጃ በ ${PHONE_NUMBER} ይደውሉልን።

አፊላስ መድኃኒት ማምረቻና ማሰራጫ

--- English ---
Dear Customer Mr. ${customerName},
Your order has been REJECTED. 
For more information, please call us at ${PHONE_NUMBER}.

Afilas Drug Manufacturing
  `;

  // ============================================================
  // SEND NOTIFICATIONS
  // ============================================================
  const emailResult = await sendEmail(order.customerEmail, subject, html, text);
  
  let smsResult = null;
  if (order.customerPhone && afroSmsConfigured) {
    console.log(`📱 Sending pharma rejection SMS to ${order.customerPhone}`);
    const smsToSend = smsMessage.length > 1600 ? smsMessage.substring(0, 1597) + '...' : smsMessage;
    smsResult = await sendSms(order.customerPhone, smsToSend);
  }

  return { email: emailResult, sms: smsResult };
}

// ============================================================
// 8. EXPORT MODULE
// ============================================================

module.exports = {
  sendEmail,
  sendSms,
  sendAppointmentApproved,
  sendAppointmentRejected,
  sendPharmaOrderApproved,
  sendPharmaOrderRejected,
};