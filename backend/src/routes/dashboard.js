// backend/src/routes/dashboard.js
const express = require('express');
const prisma = require('../lib/prisma');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// ============================================================
// FIXED Helper: Get location filter
// ============================================================
function getLocationFilter(location) {
  // If location is 'all', 'undefined', 'null', or empty, return empty filter
  if (!location || location === 'all' || location === 'undefined' || location === 'null') {
    return {}; 
  }
  // Otherwise, filter by exact location string match
  return { location };
}

// ============================================================
// GET Dashboard Statistics - ✅ ADMIN only (removed SUPER_ADMIN)
// ============================================================
router.get('/stats',
  auth,
  authorize('ADMIN'), // ✅ FIXED: Only ADMIN, removed SUPER_ADMIN
  async (req, res) => {
    try {
      const { location = 'all' } = req.query;
      
      console.log(`📊 Dashboard API called. Location param: "${location}"`);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      // Build location filter
      const locationFilter = getLocationFilter(location);

      console.log(`🔍 Prisma filter being applied:`, JSON.stringify(locationFilter));

      // ============================================================
      // 🔥 CRASH-PROOF REVIEW QUERIES
      // ============================================================
      const safeTotalReviews = await (async () => {
        try {
          if (prisma.review && typeof prisma.review.count === 'function') {
            return await prisma.review.count({ where: locationFilter });
          }
          return 0;
        } catch (e) {
          return 0;
        }
      })();

      const safeAverageRating = await (async () => {
        try {
          if (prisma.review && typeof prisma.review.aggregate === 'function') {
            const result = await prisma.review.aggregate({
              where: locationFilter,
              _avg: { rating: true },
            });
            return result;
          }
          return { _avg: { rating: 0 } };
        } catch (e) {
          return { _avg: { rating: 0 } };
        }
      })();

      // Get all other statistics in parallel using Prisma
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
      ] = await Promise.all([
        prisma.appointment.count({ where: locationFilter }),
        prisma.appointment.count({
          where: {
            ...locationFilter,
            date: {
              gte: today,
              lt: tomorrow,
            },
          },
        }),
        prisma.appointment.count({
          where: {
            ...locationFilter,
            date: {
              gte: today,
              lte: nextWeek,
            },
            status: {
              in: ['PENDING', 'CONFIRMED'],
            },
          },
        }),
        prisma.doctor.count({
          where: {
            ...locationFilter,
            isAvailable: true,
          },
        }),
        prisma.department.count({
          where: { isActive: true },
        }),
        prisma.service.count({
          where: { isActive: true },
        }),
        prisma.user.count({
          where: {
            ...locationFilter,
            isActive: true,
          },
        }),
        prisma.contact.count({
          where: { status: 'UNREAD' },
        }),
        prisma.news.count({
          where: { isPublished: true },
        }),
        prisma.appointment.groupBy({
          by: ['status'],
          where: locationFilter,
          _count: true,
        }),
        prisma.appointment.findMany({
          where: locationFilter,
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
      if (appointmentsByStatus && Array.isArray(appointmentsByStatus)) {
        appointmentsByStatus.forEach(item => {
          statusCounts[item.status] = item._count;
        });
      }

      // Map recent appointments for frontend
      const mappedRecentAppointments = recentAppointments && Array.isArray(recentAppointments) 
        ? recentAppointments.map(app => ({
            id: app.id,
            date: app.date,
            status: app.status,
            doctor: app.doctor ? {
              name: app.doctor.name,
              specialization: app.doctor.specialization,
            } : null,
            service: app.service ? {
              name: app.service.name,
            } : null,
          }))
        : [];

      console.log(`✅ Returning Stats: Appointments=${totalAppointments}, Doctors=${totalDoctors}, Users=${totalUsers}`);

      res.json({
        success: true,
        data: {
          overview: {
            totalAppointments: totalAppointments || 0,
            todayAppointments: todayAppointments || 0,
            upcomingAppointments: upcomingAppointments || 0,
            totalDoctors: totalDoctors || 0,
            totalDepartments: totalDepartments || 0,
            totalServices: totalServices || 0,
            totalUsers: totalUsers || 0,
            pendingContacts: pendingContacts || 0,
            totalNews: totalNews || 0,
          },
          appointmentsByStatus: statusCounts,
          recentAppointments: mappedRecentAppointments,
          reviews: {
            totalReviews: safeTotalReviews || 0,
            averageRating: safeAverageRating?._avg?.rating || 0,
          },
          location: location,
        },
      });
    } catch (error) {
      console.error('❌ Dashboard stats error:', error);
      console.error('Error details:', error.message);
      console.error('Stack:', error.stack);
      
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

// ============================================================
// GET Appointments Chart Data - ✅ ADMIN only
// ============================================================
router.get('/appointments-chart',
  auth,
  authorize('ADMIN'), // ✅ FIXED: Only ADMIN
  async (req, res) => {
    try {
      const { period = 'month', location = 'all' } = req.query;
      
      const now = new Date();
      let startDate = new Date();
      
      if (period === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(startDate.getMonth() - 6);
      } else if (period === 'year') {
        startDate.setFullYear(startDate.getFullYear() - 1);
      } else {
        startDate.setMonth(startDate.getMonth() - 6);
      }

      const locationFilter = getLocationFilter(location);

      const appointments = await prisma.appointment.findMany({
        where: {
          ...locationFilter,
          date: {
            gte: startDate,
            lte: now,
          },
        },
        select: {
          date: true,
          status: true,
        },
      });

      const monthMap = {};
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 0; i < 12; i++) {
        const monthName = monthOrder[i];
        monthMap[monthName] = { 
          month: monthName, 
          appointments: 0, 
          completed: 0, 
          cancelled: 0 
        };
      }

      appointments.forEach(app => {
        if (app.date) {
          const month = app.date.toLocaleString('default', { month: 'short' });
          if (monthMap[month]) {
            monthMap[month].appointments++;
            if (app.status === 'COMPLETED') monthMap[month].completed++;
            if (app.status === 'CANCELLED') monthMap[month].cancelled++;
          }
        }
      });

      let chartData = Object.values(monthMap);
      chartData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

      const startMonth = startDate.getMonth();
      const endMonth = now.getMonth();
      let monthDiff = (endMonth - startMonth + 12) % 12;
      if (monthDiff === 0 && startDate.getFullYear() < now.getFullYear()) {
        monthDiff = 12;
      }
      
      chartData = chartData.slice(startMonth, startMonth + monthDiff + 1);

      res.json({
        success: true,
        data: chartData,
      });
    } catch (error) {
      console.error('❌ Appointments chart error:', error);
      res.json({
        success: true,
        data: [],
      });
    }
  }
);

// ============================================================
// GET Users Chart Data - ✅ ADMIN only
// ============================================================
router.get('/users-chart',
  auth,
  authorize('ADMIN'), // ✅ FIXED: Only ADMIN
  async (req, res) => {
    try {
      const { location = 'all' } = req.query;
      
      const locationFilter = getLocationFilter(location);

      const users = await prisma.user.groupBy({
        by: ['role'],
        where: {
          ...locationFilter,
          isActive: true,
        },
        _count: true,
      });

      let chartData = users.map(user => ({
        role: user.role,
        count: user._count,
      }));

      if (chartData.length === 0) {
        chartData = [
          { role: 'SUPER_ADMIN', count: 0 },
          { role: 'ADMIN', count: 0 },
          { role: 'DOCTOR', count: 0 },
          { role: 'USER', count: 0 },
        ];
      }

      res.json({
        success: true,
        data: chartData,
      });
    } catch (error) {
      console.error('❌ Users chart error:', error);
      res.json({
        success: true,
        data: [],
      });
    }
  }
);

// ============================================================
// GET Doctors Chart Data - ✅ ADMIN only
// ============================================================
router.get('/doctors-chart',
  auth,
  authorize('ADMIN'), // ✅ FIXED: Only ADMIN
  async (req, res) => {
    try {
      const { location = 'all' } = req.query;
      
      const locationFilter = getLocationFilter(location);

      const departments = await prisma.department.findMany({
        where: { isActive: true },
        include: {
          doctors: {
            where: {
              ...locationFilter,
              isAvailable: true,
            },
          },
        },
      });

      let chartData = departments.map(dept => ({
        department: dept.name,
        count: dept.doctors.length,
      }));

      if (chartData.length === 0) {
        chartData = [
          { department: 'General', count: 0 },
          { department: 'Cardiology', count: 0 },
          { department: 'Neurology', count: 0 },
          { department: 'Pediatrics', count: 0 },
        ];
      }

      res.json({
        success: true,
        data: chartData,
      });
    } catch (error) {
      console.error('❌ Doctors chart error:', error);
      res.json({
        success: true,
        data: [],
      });
    }
  }
);

// ============================================================
// GET Services Chart Data - ✅ ADMIN only
// ============================================================
router.get('/services-chart',
  auth,
  authorize('ADMIN'), // ✅ FIXED: Only ADMIN
  async (req, res) => {
    try {
      const { location = 'all' } = req.query;
      
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

      if (chartData.length === 0) {
        chartData = [
          { department: 'General', count: 0 },
          { department: 'Cardiology', count: 0 },
          { department: 'Neurology', count: 0 },
          { department: 'Pediatrics', count: 0 },
        ];
      }

      res.json({
        success: true,
        data: chartData,
      });
    } catch (error) {
      console.error('❌ Services chart error:', error);
      res.json({
        success: true,
        data: [],
      });
    }
  }
);

// ============================================================
// GET Revenue Chart Data - ✅ ADMIN only
// ============================================================
router.get('/revenue',
  auth,
  authorize('ADMIN'), // ✅ FIXED: Only ADMIN
  async (req, res) => {
    try {
      const { period = 'month', location = 'all' } = req.query;
      
      const now = new Date();
      let startDate = new Date();
      
      if (period === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(startDate.getMonth() - 6);
      } else if (period === 'year') {
        startDate.setFullYear(startDate.getFullYear() - 1);
      } else {
        startDate.setMonth(startDate.getMonth() - 6);
      }

      const locationFilter = getLocationFilter(location);

      const appointments = await prisma.appointment.findMany({
        where: {
          ...locationFilter,
          date: {
            gte: startDate,
            lte: now,
          },
          status: 'COMPLETED',
        },
        include: {
          service: {
            select: {
              price: true,
            },
          },
        },
      });

      const monthMap = {};
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 0; i < 12; i++) {
        const monthName = monthOrder[i];
        monthMap[monthName] = { 
          month: monthName, 
          revenue: 0 
        };
      }

      appointments.forEach(app => {
        if (app.date && app.service?.price) {
          const month = app.date.toLocaleString('default', { month: 'short' });
          if (monthMap[month]) {
            monthMap[month].revenue += app.service.price;
          }
        }
      });

      let chartData = Object.values(monthMap);
      chartData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

      const startMonth = startDate.getMonth();
      const endMonth = now.getMonth();
      let monthDiff = (endMonth - startMonth + 12) % 12;
      if (monthDiff === 0 && startDate.getFullYear() < now.getFullYear()) {
        monthDiff = 12;
      }
      
      chartData = chartData.slice(startMonth, startMonth + monthDiff + 1);

      res.json({
        success: true,
        data: chartData,
      });
    } catch (error) {
      console.error('❌ Revenue chart error:', error);
      res.json({
        success: true,
        data: [],
      });
    }
  }
);

module.exports = router;