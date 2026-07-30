// backend/src/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();

// In-memory storage for notifications (will reset on server restart)
let notifications = [];
let notificationIdCounter = 1;

// Helper function to get user ID from request
const getUserId = (req) => {
  // Try to get user ID from different sources
  if (req.user?.id) return req.user.id;
  if (req.user?.userId) return req.user.userId;
  // For development, use a default admin ID
  return 'admin-123';
};

// Helper function to format time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
};

// GET /api/notifications - Get all notifications for the user
router.get('/', (req, res) => {
  try {
    const userId = getUserId(req);
    
    // Filter notifications for this user
    const userNotifications = notifications.filter(n => n.userId === userId);
    
    // Get unread count
    const unreadCount = userNotifications.filter(n => !n.read).length;
    
    // Format notifications for frontend
    const formattedNotifications = userNotifications.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message || '',
      time: getTimeAgo(n.createdAt),
      read: n.read,
      type: n.type || 'general',
      createdAt: n.createdAt,
    }));
    
    res.json({
      notifications: formattedNotifications,
      unreadCount,
      pagination: {
        page: 1,
        limit: 20,
        total: userNotifications.length,
        pages: Math.ceil(userNotifications.length / 20),
      },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// GET /api/notifications/unread/count - Get unread count
router.get('/unread/count', (req, res) => {
  try {
    const userId = getUserId(req);
    const count = notifications.filter(n => n.userId === userId && !n.read).length;
    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// PATCH /api/notifications/:id/read - Mark a notification as read
router.patch('/:id/read', (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    
    const notification = notifications.find(n => n.id === parseInt(id) && n.userId === userId);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    notification.read = true;
    notification.readAt = new Date().toISOString();
    
    res.json({ 
      success: true, 
      notification: {
        id: notification.id,
        title: notification.title,
        read: notification.read,
      }
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// PATCH /api/notifications/read/all - Mark all notifications as read
router.patch('/read/all', (req, res) => {
  try {
    const userId = getUserId(req);
    
    let updatedCount = 0;
    notifications = notifications.map(n => {
      if (n.userId === userId && !n.read) {
        updatedCount++;
        return { ...n, read: true, readAt: new Date().toISOString() };
      }
      return n;
    });
    
    res.json({ success: true, updatedCount });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// DELETE /api/notifications/:id - Delete a notification
router.delete('/:id', (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    
    const index = notifications.findIndex(n => n.id === parseInt(id) && n.userId === userId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    notifications.splice(index, 1);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// POST /api/notifications - Create a new notification
router.post('/', (req, res) => {
  try {
    const userId = getUserId(req);
    const { title, message, type, data } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const newNotification = {
      id: notificationIdCounter++,
      userId,
      title,
      message: message || '',
      type: type || 'general',
      data: data || {},
      read: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    notifications.push(newNotification);
    res.status(201).json({ 
      success: true, 
      notification: {
        id: newNotification.id,
        title: newNotification.title,
        message: newNotification.message,
        read: newNotification.read,
        createdAt: newNotification.createdAt,
      }
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// GET /api/notifications/sample - Create sample notifications
router.get('/sample', (req, res) => {
  try {
    const userId = getUserId(req);
    
    // Remove existing notifications for this user
    notifications = notifications.filter(n => n.userId !== userId);
    
    const now = new Date();
    const sampleNotifications = [
      {
        id: notificationIdCounter++,
        userId,
        title: 'New appointment booked by John Doe',
        message: 'Dr. Smith has a new appointment with patient John Doe at 2:30 PM tomorrow.',
        type: 'appointment',
        data: { appointmentId: '123', patientId: '456' },
        read: false,
        createdAt: new Date(now.getTime() - 5 * 60000).toISOString(),
        updatedAt: new Date(now.getTime() - 5 * 60000).toISOString(),
      },
      {
        id: notificationIdCounter++,
        userId,
        title: 'Patient feedback received from Sarah Smith',
        message: 'Patient Sarah Smith submitted feedback with rating 4.5 stars.',
        type: 'patient',
        data: { feedbackId: '789', rating: 4.5 },
        read: false,
        createdAt: new Date(now.getTime() - 60 * 60000).toISOString(),
        updatedAt: new Date(now.getTime() - 60 * 60000).toISOString(),
      },
      {
        id: notificationIdCounter++,
        userId,
        title: 'Dr. Johnson schedule updated for tomorrow',
        message: 'Dr. Johnson has updated their schedule for tomorrow. 2 new slots available.',
        type: 'doctor',
        data: { doctorId: '101', newSlots: 2 },
        read: true,
        createdAt: new Date(now.getTime() - 3 * 3600000).toISOString(),
        updatedAt: new Date(now.getTime() - 3 * 3600000).toISOString(),
      },
      {
        id: notificationIdCounter++,
        userId,
        title: 'System maintenance scheduled for tonight',
        message: 'System maintenance will occur at 11:00 PM tonight. Expected downtime: 30 minutes.',
        type: 'system',
        data: { maintenanceId: '202', duration: 30 },
        read: true,
        createdAt: new Date(now.getTime() - 24 * 3600000).toISOString(),
        updatedAt: new Date(now.getTime() - 24 * 3600000).toISOString(),
      },
      {
        id: notificationIdCounter++,
        userId,
        title: 'New patient registered: Michael Brown',
        message: 'A new patient, Michael Brown, has registered at Afilas General Hospital.',
        type: 'patient',
        data: { patientId: '303' },
        read: true,
        createdAt: new Date(now.getTime() - 2 * 24 * 3600000).toISOString(),
        updatedAt: new Date(now.getTime() - 2 * 24 * 3600000).toISOString(),
      },
      {
        id: notificationIdCounter++,
        userId,
        title: 'Lab results ready for patient Emily Wilson',
        message: 'Lab results are now available for patient Emily Wilson. Please review.',
        type: 'general',
        data: { labResultId: '404', patientId: '505' },
        read: true,
        createdAt: new Date(now.getTime() - 3 * 24 * 3600000).toISOString(),
        updatedAt: new Date(now.getTime() - 3 * 24 * 3600000).toISOString(),
      },
    ];
    
    notifications = [...notifications, ...sampleNotifications];
    
    res.json({
      success: true,
      message: `Created ${sampleNotifications.length} sample notifications`,
      count: sampleNotifications.length,
      notifications: sampleNotifications.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        read: n.read,
        time: getTimeAgo(n.createdAt),
      })),
    });
  } catch (error) {
    console.error('Error creating sample notifications:', error);
    res.status(500).json({ error: 'Failed to create sample notifications' });
  }
});

// GET /api/notifications/debug - Debug endpoint to see all notifications
router.get('/debug', (req, res) => {
  res.json({
    totalNotifications: notifications.length,
    notifications: notifications.map(n => ({
      id: n.id,
      userId: n.userId,
      title: n.title,
      read: n.read,
      createdAt: n.createdAt,
    })),
  });
});

module.exports = router;