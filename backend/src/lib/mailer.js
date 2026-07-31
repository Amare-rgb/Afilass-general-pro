const nodemailer = require('nodemailer');

class Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail({ to, subject, html, text }) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to,
        subject,
        html,
        text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('📧 Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw error;
    }
  }

  async sendAppointmentConfirmation(appointment, doctor, service) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Appointment Confirmation</h2>
        <p>Dear ${appointment.patientName},</p>
        <p>Your appointment has been confirmed with the following details:</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Doctor:</strong> ${doctor.name}</p>
          <p><strong>Specialization:</strong> ${doctor.specialization}</p>
          <p><strong>Service:</strong> ${service.name}</p>
          <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Time:</strong> ${appointment.time}</p>
          <p><strong>Location:</strong> Afilas Hospital</p>
        </div>
        
        <p><strong>Important:</strong> Please arrive 15 minutes before your appointment time.</p>
        <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
        
        <div style="margin: 30px 0; padding: 20px; background: #fef3c7; border-radius: 8px;">
          <p style="margin: 0;"><strong>Contact Information:</strong></p>
          <p style="margin: 5px 0;">📞 Phone: +1 (555) 123-4567</p>
          <p style="margin: 5px 0;">✉️ Email: appointments@afilashospital.com</p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Thank you for choosing Afilas Hospital. We look forward to providing you with excellent care.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: appointment.patientEmail,
      subject: 'Appointment Confirmation - Afilas Hospital',
      html,
    });
  }

  async sendAppointmentReminder(appointment, doctor) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Appointment Reminder</h2>
        <p>Dear ${appointment.patientName},</p>
        <p>This is a reminder for your upcoming appointment at Afilas Hospital:</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Doctor:</strong> ${doctor.name}</p>
          <p><strong>Specialization:</strong> ${doctor.specialization}</p>
          <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Time:</strong> ${appointment.time}</p>
          <p><strong>Location:</strong> Afilas Hospital</p>
        </div>
        
        <p>Please bring your ID and any relevant medical records.</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          If you need to reschedule, please contact us at least 24 hours in advance.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: appointment.patientEmail,
      subject: 'Appointment Reminder - Afilas Hospital',
      html,
    });
  }

  async sendContactConfirmation(contact) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Thank You for Contacting Us</h2>
        <p>Dear ${contact.name},</p>
        <p>We have received your message and appreciate you reaching out to Afilas Hospital.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Subject:</strong> ${contact.subject}</p>
          <p><strong>Message:</strong> ${contact.message}</p>
        </div>
        
        <p>Our team will review your inquiry and get back to you within 24-48 business hours.</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          For urgent matters, please call us at +1 (555) 123-4567.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: contact.email,
      subject: 'We Received Your Message - Afilas Hospital',
      html,
    });
  }
}

module.exports = new Mailer();