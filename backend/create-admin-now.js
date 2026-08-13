// backend/create-admin-now.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminNow() {
  try {
    console.log('🔧 Creating admin user...');

    // Check if admin exists
    const existing = await prisma.user.findUnique({
      where: { email: 'admin@afilashospital.com' }
    });

    if (existing) {
      console.log('✅ Admin already exists:', existing.email);
      console.log('📋 Role:', existing.role);
      console.log('📋 Active:', existing.isActive);
      
      // Update if needed
      if (existing.role !== 'ADMIN' || !existing.isActive) {
        const updated = await prisma.user.update({
          where: { email: 'admin@afilashospital.com' },
          data: {
            role: 'ADMIN',
            isActive: true
          }
        });
        console.log('✅ Updated admin to active and ADMIN role');
      }
    } else {
      console.log('❌ Admin not found. Creating...');
      
      const hashedPassword = await bcrypt.hash('Admin@123456', 10);
      const admin = await prisma.user.create({
        data: {
          email: 'admin@afilashospital.com',
          password: hashedPassword,
          name: 'Hospital System Admin',
          role: 'ADMIN',
          phone: '+1234567890',
          isActive: true,
          location: 'Afilas General Hospital',
        }
      });
      
      console.log('✅ Admin created successfully!');
      console.log('📧 Email:', admin.email);
      console.log('🆔 ID:', admin.id);
      console.log('👤 Role:', admin.role);
      console.log('✅ Active:', admin.isActive);
    }

    // Verify
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@afilashospital.com' }
    });

    console.log('\n📋 Final Admin Details:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Active: ${admin.isActive}`);
    console.log(`   ID: ${admin.id}`);

    // Test password
    const testPassword = await bcrypt.compare('Admin@123456', admin.password);
    console.log(`\n🔐 Password test: ${testPassword ? '✅ WORKS' : '❌ FAILED'}`);

    console.log('\n🔑 Login with:');
    console.log('   Email: admin@afilashospital.com');
    console.log('   Password: Admin@123456');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminNow();