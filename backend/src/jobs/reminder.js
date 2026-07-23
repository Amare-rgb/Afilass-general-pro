const cron = require('node-cron');
const prisma = require('../lib/prisma');
const mailer = require('../lib/mailer');

class ReminderJob {
  async sendAppointmentReminders() {
    try {
      console.log('📅 Running appointment reminder job...');
      
      // Get appointments for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(tomorrow);
      nextDay.setDate(nextDay.getDate() + 1);

      const appointments = await prisma.appointment.findMany({
        where: {
          date: {
            gte: tomorrow,
            lt: nextDay,
          },
          status: {
            in: ['PENDING', 'CONFIRMED'],
          },
        },
        include: {
          doctor: true,
          service: true,
        },
      });

      console.log(`📧 Sending reminders for ${appointments.length} appointments`);

      for (const appointment of appointments) {
        try {
          await mailer.sendAppointmentReminder(appointment, appointment.doctor);
          console.log(`✅ Reminder sent for appointment ${appointment.id}`);
          
          // Add small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`❌ Failed to send reminder for appointment ${appointment.id}:`, error);
        }
      }

      console.log('✅ Reminder job completed');
    } catch (error) {
      console.error('❌ Reminder job failed:', error);
    }
  }

  start() {
    // Run every day at 9:00 AM
    cron.schedule('0 9 * * *', () => {
      this.sendAppointmentReminders();
    });

    console.log('⏰ Reminder job scheduled (runs daily at 9:00 AM)');
  }
}

module.exports = new ReminderJob();