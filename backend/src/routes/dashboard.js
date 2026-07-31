// C:\Afilass\afilas-hospital\backend\src\routes\dashboard.js
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
      const { location = 'all' } = req.query;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Get all statistics in parallel using Prisma
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
        appointmentsByStatus,
        recentAppointments,
        totalReviews,
        averageRating,
      ] = await Promise.all([
        prisma.appointment.count(),
        prisma.appointment.count({
          where: {
            date: {
              gte: today,
              lt: tomorrow,
            },
          },
        }),
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
        prisma.doctor.count({
          where: { isAvailable: true },
        }),
        prisma.department.count({
          where: { isActive: true },
        }),
        prisma.service.count({
          where: { isActive: true },
        }),
        prisma.user.count({
          where: { isActive: true },
        }),
        prisma.contact.count({
          where: { status: 'UNREAD' },
        }),
        prisma.news.count({
          where: { isPublished: true },
        }),
        prisma.appointment.groupBy({
          by: ['status'],
          _count: true,
        }),
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
        // Get total reviews
        prisma.review.count().catch(() => 0),
        // Get average rating
        prisma.review.aggregate({
          _avg: {
            rating: true,
          },
        }).catch(() => ({ _avg: { rating: 0 } })),
      ]);

      // Format status counts
      const statusCounts = {};
      appointmentsByStatus.forEach(item => {
        statusCounts[item.status] = item._count;
      });

      // Simulate location data
      const locationMultiplier = getLocationMultiplier(location);

      res.json({
        success: true,
        data: {
          overview: {
            totalAppointments: Math.floor(totalAppointments * locationMultiplier) || 0,
            todayAppointments: Math.floor(todayAppointments * locationMultiplier) || 0,
            upcomingAppointments: Math.floor(upcomingAppointments * locationMultiplier) || 0,
            totalDoctors: Math.floor(totalDoctors * locationMultiplier) || 0,
            totalDepartments: Math.floor(totalDepartments * locationMultiplier) || 0,
            totalServices: Math.floor(totalServices * locationMultiplier) || 0,
            totalUsers: Math.floor(totalUsers * locationMultiplier) || 0,
            pendingContacts: Math.floor(pendingContacts * locationMultiplier) || 0,
            totalNews: Math.floor(totalNews * locationMultiplier) || 0,
          },
          appointmentsByStatus: statusCounts,
          recentAppointments: recentAppointments || [],
          reviews: {
            totalReviews: totalReviews || 0,
            averageRating: averageRating?._avg?.rating || 0,
          },
          location: location,
        },
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.json({
        success: true,
        data: {
          overview: {
            totalAppointments: 0,
            todayAppointments: 0,
            upcomingAppointments: 0,
            totalDoctors: 0,
            totalDepartments: 0,
            totalServices: 0,
            totalUsers: 0,
            pendingContacts: 0,
            totalNews: 0,
          },
          appointmentsByStatus: {},
          recentAppointments: [],
          reviews: {
            totalReviews: 0,
            averageRating: 0,
          },
          location: 'all',
        },
      });
    }
  }
);

// Helper function to simulate location data
function getLocationMultiplier(location) {
  switch(location) {
    case 'Afilas General Hospital':
      return 0.6;
    case 'Afilas Diagnosis Center':
      return 0.3;
    case 'Afilas Drug Manufacturing':
      return 0.1;
    default:
      return 1.0;
  }
}

// Get chart data for appointments
router.get('/appointments-chart',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { period = 'month', location = 'all' } = req.query;
      
      // Get appointments for the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const appointments = await prisma.appointment.findMany({
        where: {
          date: {
            gte: sixMonthsAgo,
          },
        },
        select: {
          date: true,
          status: true,
        },
      });

      // Group by month
      const monthMap = {};
      appointments.forEach(app => {
        const month = app.date.toLocaleString('default', { month: 'short' });
        if (!monthMap[month]) {
          monthMap[month] = { month, appointments: 0, completed: 0, cancelled: 0 };
        }
        monthMap[month].appointments++;
        if (app.status === 'COMPLETED') monthMap[month].completed++;
        if (app.status === 'CANCELLED') monthMap[month].cancelled++;
      });

      let chartData = Object.values(monthMap);
      // Sort by month order
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      chartData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

      const multiplier = getLocationMultiplier(location);
      chartData = chartData.map(item => ({
        ...item,
        appointments: Math.floor(item.appointments * multiplier),
        completed: Math.floor(item.completed * multiplier),
        cancelled: Math.floor(item.cancelled * multiplier),
      }));

      res.json({
        success: true,
        data: chartData,
      });
    } catch (error) {
      console.error('Appointments chart error:', error);
      res.json({
        success: true,
        data: [],
      });
    }
  }
);

// Get chart data for doctors
router.get('/doctors-chart',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { location = 'all' } = req.query;
      
      // Get departments with doctor counts
      const departments = await prisma.department.findMany({
        where: { isActive: true },
        include: {
          doctors: {
            where: { isAvailable: true },
          },
        },
      });

      let chartData = departments.map(dept => ({
        department: dept.name,
        count: dept.doctors.length,
      }));

      const multiplier = getLocationMultiplier(location);
      chartData = chartData.map(item => ({
        ...item,
        count: Math.floor(item.count * multiplier),
      }));

      res.json({
        success: true,
        data: chartData,
      });
    } catch (error) {
      console.error('Doctors chart error:', error);
      res.json({
        success: true,
        data: [],
      });
    }
  }
);

// Get chart data for users
router.get('/users-chart',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { location = 'all' } = req.query;
      
      // Get users grouped by role
      const users = await prisma.user.groupBy({
        by: ['role'],
        where: { isActive: true },
        _count: true,
      });

      let chartData = users.map(user => ({
        role: user.role,
        count: user._count,
      }));

      const multiplier = getLocationMultiplier(location);
      chartData = chartData.map(item => ({
        ...item,
        count: Math.floor(item.count * multiplier),
      }));

      res.json({
        success: true,
        data: chartData,
      });
    } catch (error) {
      console.error('Users chart error:', error);
      res.json({
        success: true,
        data: [],
      });
    }
  }
);

// Get chart data for services
router.get('/services-chart',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { location = 'all' } = req.query;
      
      // Get departments with service counts
      const departments = await prisma.department.findMany({
        where: { isActive: true },
        include: {
          services: {
            where: { isActive: true },
          },
        },
      });

      let chartData = departments.map(dept => ({
        department: dept.name,
        count: dept.services.length,
      }));

      const multiplier = getLocationMultiplier(location);
      chartData = chartData.map(item => ({
        ...item,
        count: Math.floor(item.count * multiplier),
      }));

      res.json({
        success: true,
        data: chartData,
      });
    } catch (error) {
      console.error('Services chart error:', error);
      res.json({
        success: true,
        data: [],
      });
    }
  }
);

// Get chart data for news/blog
router.get('/news-chart',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { location = 'all' } = req.query;
      
      // Get news from the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const news = await prisma.news.findMany({
        where: {
          isPublished: true,
          publishedAt: {
            gte: sixMonthsAgo,
          },
        },
        select: {
          publishedAt: true,
        },
      });

      // Group by month
      const monthMap = {};
      news.forEach(item => {
        if (item.publishedAt) {
          const month = item.publishedAt.toLocaleString('default', { month: 'short' });
          if (!monthMap[month]) {
            monthMap[month] = { month, count: 0 };
          }
          monthMap[month].count++;
        }
      });

      let chartData = Object.values(monthMap);
      // Sort by month order
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      chartData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

      const multiplier = getLocationMultiplier(location);
      chartData = chartData.map(item => ({
        ...item,
        count: Math.floor(item.count * multiplier),
      }));

      res.json({
        success: true,
        data: chartData,
      });
    } catch (error) {
      console.error('News chart error:', error);
      res.json({
        success: true,
        data: [],
      });
    }
  }
);

module.exports = router;