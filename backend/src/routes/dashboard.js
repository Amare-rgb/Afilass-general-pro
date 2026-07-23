const express = require('express');
const prisma = require('../lib/prisma');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics (Admin only)
router.get('/stats',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Get all statistics in parallel
      const [
        totalAppointments,
        todayAppointments,
        upcomingAppointments,
        totalDoctors,
        totalDepartments,
        totalServices,
        totalUsers,
        pendingContacts,
        totalNews,
        revenueToday,
        revenueMonth,
        appointmentsByStatus,
        recentAppointments,
      ] = await Promise.all([
        // Total appointments
        prisma.appointment.count(),
        
        // Today's appointments
        prisma.appointment.count({
          where: {
            date: {
              gte: today,
              lt: tomorrow,
            },
          },
        }),
        
        // Upcoming appointments (next 7 days)
        prisma.appointment.count({
          where: {
            date: {
              gte: today,
              lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
            },
            status: {
              in: ['PENDING', 'CONFIRMED'],
            },
          },
        }),
        
        // Total doctors
        prisma.doctor.count({
          where: { isAvailable: true },
        }),
        
        // Total departments
        prisma.department.count({
          where: { isActive: true },
        }),
        
        // Total services
        prisma.service.count({
          where: { isActive: true },
        }),
        
        // Total users
        prisma.user.count({
          where: { isActive: true },
        }),
        
        // Pending contacts
        prisma.contact.count({
          where: { status: 'UNREAD' },
        }),
        
        // Total news
        prisma.news.count({
          where: { isPublished: true },
        }),
        
        // Revenue today
        prisma.appointment.aggregate({
          where: {
            date: {
              gte: today,
              lt: tomorrow,
            },
            status: 'COMPLETED',
          },
          _sum: {
            service: {
              select: {
                price: true,
              },
            },
          },
        }),
        
        // Revenue this month
        prisma.appointment.aggregate({
          where: {
            date: {
              gte: startOfMonth,
            },
            status: 'COMPLETED',
          },
          _sum: {
            service: {
              select: {
                price: true,
              },
            },
          },
        }),
        
        // Appointments by status
        prisma.appointment.groupBy({
          by: ['status'],
          _count: true,
        }),
        
        // Recent appointments
        prisma.appointment.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            doctor: {
              select: {
                name: true,
                specialization: true,
              },
            },
            service: {
              select: {
                name: true,
              },
            },
          },
        }),
      ]);

      // Format status counts
      const statusCounts = {};
      appointmentsByStatus.forEach(item => {
        statusCounts[item.status] = item._count;
      });

      res.json({
        success: true,
        data: {
          overview: {
            totalAppointments,
            todayAppointments,
            upcomingAppointments,
            totalDoctors,
            totalDepartments,
            totalServices,
            totalUsers,
            pendingContacts,
            totalNews,
          },
          revenue: {
            today: revenueToday._sum?.service?.price || 0,
            month: revenueMonth._sum?.service?.price || 0,
          },
          appointmentsByStatus: statusCounts,
          recentAppointments,
        },
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard statistics',
      });
    }
  }
);

// Get appointments chart data (Admin only)
router.get('/chart',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { period = 'week' } = req.query;
      
      let dateRange;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (period === 'week') {
        dateRange = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          return date;
        }).reverse();
      } else if (period === 'month') {
        dateRange = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          return date;
        }).reverse();
      } else {
        dateRange = [today];
      }

      const chartData = await Promise.all(
        dateRange.map(async (date) => {
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() + 1);

          const [appointments, revenue] = await Promise.all([
            prisma.appointment.count({
              where: {
                date: {
                  gte: date,
                  lt: nextDay,
                },
              },
            }),
            prisma.appointment.aggregate({
              where: {
                date: {
                  gte: date,
                  lt: nextDay,
                },
                status: 'COMPLETED',
              },
              _sum: {
                service: {
                  select: {
                    price: true,
                  },
                },
              },
            }),
          ]);

          return {
            date: date.toISOString().split('T')[0],
            appointments,
            revenue: revenue._sum?.service?.price || 0,
          };
        })
      );

      res.json({
        success: true,
        data: chartData,
      });
    } catch (error) {
      console.error('Chart data error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch chart data',
      });
    }
  }
);

module.exports = router;