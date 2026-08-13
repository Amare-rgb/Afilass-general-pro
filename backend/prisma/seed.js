const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.$transaction([
    prisma.appointment.deleteMany(),
    prisma.workingHour.deleteMany(),
    prisma.doctor.deleteMany(),
    prisma.service.deleteMany(),
    prisma.user.deleteMany(),
    prisma.gallery.deleteMany(),
    prisma.news.deleteMany(),
    prisma.contact.deleteMany(),
  ]);

  console.log('🧹 Cleaned database');

  const hashedPassword = await bcrypt.hash('Admin@123456', 10);
  const allUsers = [];

  // ============================================================
  // CREATE SINGLE ADMIN USER (Only one admin)
  // ============================================================
  
  // Create the only ADMIN user
  const mainAdmin = await prisma.user.create({
    data: {
      email: 'admin@afilashospital.com',
      password: hashedPassword,
      name: 'Hospital System Admin',
      role: 'ADMIN',
      phone: '+1234567890',
      isActive: true,
      location: 'Afilas General Hospital',
    },
  });
  allUsers.push(mainAdmin);
  console.log('✅ Created ADMIN: admin@afilashospital.com');

  // ============================================================
  // CREATE REGULAR USERS (for testing appointments)
  // ============================================================
  const regularUsers = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
    { name: 'Robert Wilson', email: 'robert@example.com' },
    { name: 'Emily Davis', email: 'emily@example.com' },
    { name: 'Michael Brown', email: 'michael@example.com' },
    { name: 'Alice Johnson', email: 'alice@example.com' },
    { name: 'David Lee', email: 'david@example.com' },
    { name: 'Sarah Kim', email: 'sarah@example.com' },
  ];

  for (const userData of regularUsers) {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: 'USER',
        phone: '+1234567890',
        isActive: true,
        location: 'Afilas General Hospital',
      },
    });
    allUsers.push(user);
    console.log(`✅ Created USER: ${userData.email}`);
  }

  // ============================================================
  // CREATE SERVICES (Optional - Remove if not needed)
  // ============================================================
  const serviceData = [
    { category: 'Cardiology', services: [
      { name: 'Cardiac Consultation', description: 'Comprehensive cardiac evaluation', price: 150, duration: 45 },
      { name: 'Echocardiogram', description: 'Ultrasound imaging of the heart', price: 200, duration: 30 },
    ]},
    { category: 'Neurology', services: [
      { name: 'Neurological Consultation', description: 'Expert neurological evaluation', price: 170, duration: 45 },
    ]},
    { category: 'Orthopedics', services: [
      { name: 'Orthopedic Consultation', description: 'Comprehensive orthopedic evaluation', price: 140, duration: 40 },
    ]},
  ];

  const locations = ['Afilas General Hospital'];
  const allServices = [];
  
  for (const location of locations) {
    for (const categoryData of serviceData) {
      for (const svc of categoryData.services) {
        const service = await prisma.service.create({
          data: {
            name: `${svc.name}`,
            description: `${svc.description} (${location})`,
            price: svc.price,
            duration: svc.duration,
            category: categoryData.category,
            isActive: true,
            location: location,
          },
        });
        allServices.push(service);
      }
    }
    console.log(`✅ Created ${serviceData.reduce((acc, d) => acc + d.services.length, 0)} services for ${location}`);
  }

  // ============================================================
  // CREATE DOCTORS (Optional - Remove if not needed)
  // ============================================================
  const doctorData = [
    { name: 'Dr. Sarah Johnson', specialization: 'Cardiology', phone: '+1234567891', experience: 12 },
    { name: 'Dr. Michael Chen', specialization: 'Neurology', phone: '+1234567892', experience: 10 },
    { name: 'Dr. Emily Williams', specialization: 'Pediatrics', phone: '+1234567893', experience: 8 },
    { name: 'Dr. James Smith', specialization: 'Orthopedics', phone: '+1234567894', experience: 15 },
  ];

  const allDoctors = [];
  for (const location of locations) {
    for (const doc of doctorData) {
      const doctor = await prisma.doctor.create({
        data: {
          name: doc.name,
          email: `${doc.name.toLowerCase().replace(/ /g, '.')}@${location.toLowerCase().replace(/ /g, '')}.com`,
          phone: doc.phone,
          specialization: doc.specialization,
          bio: `Experienced ${doc.specialization} specialist with over ${doc.experience} years.`,
          education: 'MD, PhD',
          experience: doc.experience,
          rating: 4.5 + Math.random() * 0.5,
          isAvailable: true,
          consultationFee: Math.floor(Math.random() * 300) + 150,
          location: location,
        },
      });
      allDoctors.push(doctor);
    }
    console.log(`✅ Created ${doctorData.length} doctors for ${location}`);
  }

  // ============================================================
  // CREATE WORKING HOURS
  // ============================================================
  for (const doctor of allDoctors) {
    for (let day = 1; day <= 5; day++) {
      await prisma.workingHour.create({
        data: {
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: true,
          doctorId: doctor.id,
        },
      });
    }
  }
  console.log('✅ Created working hours for doctors');

  // ============================================================
  // FINAL SUMMARY
  // ============================================================
  console.log('\n✅ Seeding completed successfully!');
  console.log('📊 Summary:');
  console.log(`   👤 Total Users: ${allUsers.length}`);
  console.log(`   👑 Admins: ${allUsers.filter(u => u.role === 'ADMIN').length}`);
  console.log(`   👤 Regular Users: ${allUsers.filter(u => u.role === 'USER').length}`);
  console.log(`   🏥 Services: ${allServices.length}`);
  console.log(`   👨‍⚕️ Doctors: ${allDoctors.length}`);
  
  console.log('\n🔑 Login Credentials:');
  console.log('\n📧 ADMIN (Can manage services):');
  console.log(`   Email: admin@afilashospital.com`);
  console.log(`   Password: Admin@123456`);
  console.log(`   Role: ADMIN`);
  
  console.log('\n📧 REGULAR USERS (Can view and book appointments):');
  for (const user of regularUsers) {
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: Admin@123456`);
    console.log(`   Role: ${user.role}`);
  }
  
  console.log('\n✅ Database seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    console.error('Error details:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });