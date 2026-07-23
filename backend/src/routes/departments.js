// routes/departments.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Helper function to generate slug (for frontend only)
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Get all departments
router.get('/', async (req, res) => {
  try {
    const { includeInactive } = req.query;

    const where = {};
    if (includeInactive !== 'true') {
      where.isActive = true;
    }

    const departments = await prisma.department.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        doctors: {
          where: { isAvailable: true },
          select: {
            id: true,
            name: true,
            specialization: true,
            image: true,
            rating: true,
          },
        },
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
          },
        },
      },
    });

    // Map for frontend compatibility - generate slug on the fly
    const mappedDepartments = departments.map(dept => ({
      id: dept.id,
      name: dept.name,
      slug: generateSlug(dept.name),
      summary: dept.description,
      details: dept.description,
      icon: dept.icon || null,
      order: dept.order || 0,
      isActive: dept.isActive,
      doctors: dept.doctors,
      services: dept.services,
      createdAt: dept.createdAt,
      updatedAt: dept.updatedAt,
    }));

    res.json({
      success: true,
      data: mappedDepartments,
    });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch departments',
    });
  }
});

// CLEAR ALL DEPARTMENTS
router.delete('/clear-all', auth, authorize('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
    const doctors = await prisma.doctor.count();
    const services = await prisma.service.count();

    if (doctors > 0 || services > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot clear departments with existing data. Please delete all doctors (${doctors}) and services (${services}) first.`,
        doctorsCount: doctors,
        servicesCount: services,
      });
    }

    const result = await prisma.department.deleteMany({});

    res.json({
      success: true,
      message: 'All departments cleared successfully',
      count: result.count,
    });
  } catch (error) {
    console.error('Clear all departments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear departments',
    });
  }
});

// Get single department
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        doctors: {
          where: { isAvailable: true },
          include: {
            workingHours: true,
          },
        },
        services: {
          where: { isActive: true },
        },
      },
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Department not found',
      });
    }

    const mappedDepartment = {
      id: department.id,
      name: department.name,
      slug: generateSlug(department.name),
      summary: department.description,
      details: department.description,
      icon: department.icon || null,
      order: department.order || 0,
      isActive: department.isActive,
      doctors: department.doctors,
      services: department.services,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
    };

    res.json({
      success: true,
      data: mappedDepartment,
    });
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch department',
    });
  }
});

// Create department (Admin only)
router.post('/', auth, authorize('SUPER_ADMIN', 'ADMIN'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      name,
      nameAmharic,
      description,
      slug,
      icon,
      order
    } = req.body;

    // Check if department already exists
    const existing = await prisma.department.findUnique({
      where: { name },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Department with this name already exists',
      });
    }

    // Create department
    const department = await prisma.department.create({
      data: {
        name,
        description: description || '',
        icon: icon || null,
        order: order || 0,
        isActive: true,
      },
    });

    // Map for frontend - generate slug on the fly
    const mappedDepartment = {
      id: department.id,
      name: department.name,
      nameAmharic: nameAmharic || '',
      slug: generateSlug(department.name),
      summary: department.description,
      description: department.description,
      icon: department.icon || null,
      order: department.order || 0,
      isActive: department.isActive,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
    };

    res.status(201).json({
      success: true,
      data: mappedDepartment,
    });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create department',
    });
  }
});

// Update department (Admin only)
router.put('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      nameAmharic,
      description,
      slug,
      icon,
      order,
      isActive
    } = req.body;

    const department = await prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Department not found',
      });
    }

    // Check if name already exists (if changing)
    if (name && name !== department.name) {
      const existing = await prisma.department.findUnique({
        where: { name },
      });
      if (existing && existing.id !== id) {
        return res.status(400).json({
          success: false,
          error: 'Department with this name already exists',
        });
      }
    }

    // Update department
    const updated = await prisma.department.update({
      where: { id },
      data: {
        name: name || department.name,
        description: description !== undefined ? description : department.description,
        icon: icon !== undefined ? icon : department.icon,
        order: order !== undefined ? order : department.order,
        isActive: isActive !== undefined ? isActive : department.isActive,
      },
    });

    // Map for frontend - generate slug on the fly
    const mappedDepartment = {
      id: updated.id,
      name: updated.name,
      nameAmharic: nameAmharic || '',
      slug: generateSlug(updated.name),
      summary: updated.description,
      description: updated.description,
      icon: updated.icon || null,
      order: updated.order || 0,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };

    res.json({
      success: true,
      data: mappedDepartment,
    });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update department',
    });
  }
});

// DELETE DEPARTMENT - WITH FORCE OPTION
router.delete('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { force } = req.query; // Check for force flag

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        doctors: {
          select: { id: true, name: true },
        },
        services: {
          select: { id: true, name: true },
        },
      },
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Department not found',
      });
    }

    const hasDoctors = department.doctors && department.doctors.length > 0;
    const hasServices = department.services && department.services.length > 0;

    // If force delete is requested, delete everything
    if (force === 'true') {
      // Use a transaction to delete everything
      await prisma.$transaction(async (tx) => {
        // Delete all appointments for doctors in this department
        const doctorIds = department.doctors.map(d => d.id);
        if (doctorIds.length > 0) {
          await tx.appointment.deleteMany({
            where: {
              doctorId: { in: doctorIds },
            },
          });
        }

        // Delete all working hours for doctors in this department
        if (doctorIds.length > 0) {
          await tx.workingHour.deleteMany({
            where: {
              doctorId: { in: doctorIds },
            },
          });
        }

        // Delete all doctors in this department
        if (doctorIds.length > 0) {
          await tx.doctor.deleteMany({
            where: {
              departmentId: id,
            },
          });
        }

        // Delete all services in this department
        if (department.services.length > 0) {
          await tx.service.deleteMany({
            where: {
              departmentId: id,
            },
          });
        }

        // Finally, delete the department
        await tx.department.delete({
          where: { id },
        });
      });

      return res.json({
        success: true,
        message: `Department "${department.name}" and all associated data deleted successfully`,
        deleted: {
          doctors: department.doctors.length,
          services: department.services.length,
        },
      });
    }

    // If not force delete, check for relationships
    if (hasDoctors || hasServices) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete department with existing relationships`,
        hasDoctors,
        hasServices,
        doctorCount: department.doctors.length,
        serviceCount: department.services.length,
        doctors: department.doctors.map(d => d.name),
        services: department.services.map(s => s.name),
        message: `Department has ${department.doctors.length} doctor(s) and ${department.services.length} service(s) assigned. Use force=true to delete all.`,
      });
    }

    // No relationships, safe to delete
    await prisma.department.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Department deleted successfully',
    });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete department',
    });
  }
});

module.exports = router;