const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Define locations
const LOCATIONS = [
  'Afilas General Hospital',
  'Afilas Diagnosis Center', 
  'Afilas Drug Manufacturing'
];

async function main() {
  console.log(' Seeding database...');

  // Clear existing data
  await prisma.$transaction([
    prisma.appointment.deleteMany(),
    prisma.workingHour.deleteMany(),
    prisma.doctor.deleteMany(),
    prisma.service.deleteMany(),
    prisma.department.deleteMany(),
    prisma.user.deleteMany(),
    prisma.gallery.deleteMany(),
    prisma.news.deleteMany(),
    prisma.contact.deleteMany(),
  ]);

  console.log('🧹 Cleaned database');

  // Create Super Admin for each location
  const hashedPassword = await bcrypt.hash('Admin@123456', 10);
  
  const admins = [];
  for (const location of LOCATIONS) {
    const admin = await prisma.user.create({
      data: {
        email: `admin@${location.toLowerCase().replace(/ /g, '')}.com`,
        password: hashedPassword,
        name: `Admin - ${location}`,
        role: 'SUPER_ADMIN',
        phone: '+1234567890',
        isActive: true,
        location: location,
      },
    });
    admins.push(admin);
    console.log(`✅ Created admin for ${location}`);
  }

  // Create Departments for each location
  const departmentsData = [
    {
      name: 'Cardiology',
      description: 'Comprehensive heart care services including diagnosis, treatment, and rehabilitation for cardiovascular diseases.',
      icon: 'heart-pulse',
      order: 1,
    },
    
    {
      name: 'Neurology',
      description: 'Expert care for nervous system disorders including brain, spinal cord, and nerve conditions.',
      icon: 'brain',
      order: 2,
    },
    {
      name: 'Orthopedics',
      description: 'Specialized treatment for musculoskeletal system including bones, joints, ligaments, and tendons.',
      icon: 'bone',
      order: 3,
    },
    {
      name: 'Pediatrics',
      description: 'Comprehensive healthcare for children from infancy to adolescence with specialized pediatric services.',
      icon: 'baby',
      order: 4,
    },
    {
      name: 'Oncology',
      description: 'Advanced cancer care including prevention, diagnosis, and treatment with compassionate support.',
      icon: 'dna',
      order: 5,
    },
    {
      name: 'Emergency Medicine',
      description: '24/7 emergency care for critical conditions with state-of-the-art facilities and expert team.',
      icon: 'ambulance',
      order: 6,
    },
  ];

  const allDepartments = [];
  for (const location of LOCATIONS) {
    for (const deptData of departmentsData) {
      const department = await prisma.department.create({
        data: {
          name: `${deptData.name} - ${location}`,
          description: `${deptData.description} (${location})`,
          icon: deptData.icon,
          order: deptData.order,
          isActive: true,
          location: location,
        },
      });
      allDepartments.push(department);
    }
    console.log(`✅ Created ${departmentsData.length} departments for ${location}`);
  }

  // Create Services for each location
  const serviceData = [
    { dept: 'Cardiology', services: [
      { name: 'Cardiac Consultation', description: 'Comprehensive cardiac evaluation and consultation', price: 150, duration: 45 },
      { name: 'Echocardiogram', description: 'Ultrasound imaging of the heart', price: 200, duration: 30 },
      { name: 'Stress Test', description: 'Cardiac stress testing for heart condition assessment', price: 180, duration: 60 },
      { name: 'Cardiac Rehabilitation', description: 'Comprehensive cardiac rehabilitation program', price: 250, duration: 90 },
    ]},
    { dept: 'Neurology', services: [
      { name: 'Neurological Consultation', description: 'Expert neurological evaluation and diagnosis', price: 170, duration: 45 },
      { name: 'Brain MRI', description: 'Advanced brain imaging for neurological disorders', price: 300, duration: 45 },
      { name: 'Stroke Rehabilitation', description: 'Specialized rehabilitation for stroke recovery', price: 220, duration: 60 },
    ]},
    { dept: 'Orthopedics', services: [
      { name: 'Orthopedic Consultation', description: 'Comprehensive orthopedic evaluation', price: 140, duration: 40 },
      { name: 'Joint Replacement', description: 'Advanced joint replacement surgery', price: 500, duration: 120 },
      { name: 'Physical Therapy', description: 'Rehabilitation and physical therapy sessions', price: 120, duration: 60 },
      { name: 'Sports Medicine', description: 'Specialized sports injury treatment', price: 160, duration: 50 },
    ]},
    { dept: 'Pediatrics', services: [
      { name: 'Pediatric Checkup', description: 'Regular health checkup for children', price: 120, duration: 30 },
      { name: 'Child Vaccination', description: 'Comprehensive vaccination program', price: 80, duration: 20 },
      { name: 'Child Development Assessment', description: 'Complete child development evaluation', price: 150, duration: 45 },
    ]},
    { dept: 'Oncology', services: [
      { name: 'Oncology Consultation', description: 'Expert cancer care consultation', price: 200, duration: 60 },
      { name: 'Cancer Screening', description: 'Advanced cancer screening services', price: 180, duration: 30 },
      { name: 'Chemotherapy', description: 'Specialized chemotherapy treatment', price: 400, duration: 120 },
    ]},
    { dept: 'Emergency Medicine', services: [
      { name: 'Emergency Consultation', description: 'Immediate emergency medical care', price: 100, duration: 20 },
      { name: 'Critical Care', description: 'Intensive critical care services', price: 300, duration: 60 },
    ]},
  ];

  const allServices = [];
  for (const location of LOCATIONS) {
    for (const deptData of serviceData) {
      const department = allDepartments.find(d => 
        d.name === `${deptData.dept} - ${location}`
      );
      if (department) {
        for (const svc of deptData.services) {
          const service = await prisma.service.create({
            data: {
              name: `${svc.name} - ${location}`,
              description: `${svc.description} (${location})`,
              price: svc.price,
              duration: svc.duration,
              departmentId: department.id,
              isActive: true,
              location: location,
            },
          });
          allServices.push(service);
        }
      }
    }
    console.log(`✅ Created services for ${location}`);
  }

  // Create Doctors for each location
  const doctorData = [
    { name: 'Dr. Sarah Johnson', specialization: 'Cardiology', phone: '+1234567891' },
    { name: 'Dr. Michael Chen', specialization: 'Neurology', phone: '+1234567892' },
    { name: 'Dr. Emily Williams', specialization: 'Pediatrics', phone: '+1234567893' },
    { name: 'Dr. James Smith', specialization: 'Orthopedics', phone: '+1234567894' },
    { name: 'Dr. Maria Garcia', specialization: 'Oncology', phone: '+1234567895' },
    { name: 'Dr. Robert Brown', specialization: 'Emergency Medicine', phone: '+1234567896' },
  ];
     
  const allDoctors = [];
  for (const location of LOCATIONS) {
    for (const doc of doctorData) {
      const department = allDepartments.find(d => 
        d.name === `${doc.specialization} - ${location}`
      );
      if (department) {
        const doctor = await prisma.doctor.create({
          data: {
            name: doc.name,
            email: `${doc.name.toLowerCase().replace(/ /g, '.')}@${location.toLowerCase().replace(/ /g, '')}.com`,
            phone: doc.phone,
            specialization: doc.specialization,
            bio: `Experienced ${doc.specialization} specialist with over 10 years of practice.`,
            education: 'MD, PhD',
            experience: 10,
            rating: 4.5 + Math.random() * 0.5,
            isAvailable: true,
            consultationFee: Math.floor(Math.random() * 300) + 150,
            departmentId: department.id,
            location: location,
          },
        });
        allDoctors.push(doctor);
      }
    }
    console.log(`✅ Created ${doctorData.length} doctors for ${location}`);
  }

  // Create Working Hours for doctors
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

  // Create Appointments for each location
  const statuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
  const patientNames = ['John Doe', 'Jane Smith', 'Robert Wilson', 'Emily Davis', 'Michael Brown', 
                        'Alice Johnson', 'David Lee', 'Sarah Kim', 'James Park', 'Lisa Chen'];

  for (const location of LOCATIONS) {
    const doctors = allDoctors.filter(d => d.location === location);
    const services = allServices.filter(s => s.location === location);
    const admin = admins.find(a => a.location === location);

    if (doctors.length > 0 && services.length > 0 && admin) {
      for (let i = 0; i < 30; i++) {
        const doctor = doctors[Math.floor(Math.random() * doctors.length)];
        const service = services[Math.floor(Math.random() * services.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30) + Math.floor(Math.random() * 10));
        
        await prisma.appointment.create({
          data: {
            patientName: patientNames[Math.floor(Math.random() * patientNames.length)],
            patientEmail: `patient${i}@example.com`,
            patientPhone: `+123456${String(1000 + i).padStart(4, '0')}`,
            patientAge: Math.floor(Math.random() * 60) + 18,
            patientGender: Math.random() > 0.5 ? 'Male' : 'Female',
            date: date,
            time: `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 6) * 10).padStart(2, '0')}`,
            status: status,
            symptoms: ['Chest pain', 'Headache', 'Fever', 'Fatigue', 'Joint pain', 'Shortness of breath'][Math.floor(Math.random() * 6)],
            isEmergency: Math.random() > 0.8,
            location: location,
            doctorId: doctor.id,
            serviceId: service.id,
            userId: admin.id,
          },
        });
      }
      console.log(` Created 30 appointments for ${location}`);
    }
  }

  // Create Gallery Items for each location
  const galleryTitles = ['Hospital Exterior', 'Surgery Center', 'Patient Rooms', 'Medical Team', 'Diagnostic Lab'];
  for (const location of LOCATIONS) {
    for (let i = 0; i < galleryTitles.length; i++) {
      await prisma.gallery.create({
        data: {
          title: `${galleryTitles[i]} - ${location}`,
          description: `${galleryTitles[i]} at ${location}`,
          type: i === 4 ? 'IMAGE' : 'IMAGE',
          url: `/uploads/gallery/${location.toLowerCase().replace(/ /g, '-')}-${i}.jpg`,
          order: i + 1,
          isActive: true,
          location: location,
        },
      });
    }
    console.log(` Created ${galleryTitles.length} gallery items for ${location}`);
  }

  // Create News for each location
  const newsData = [
    { title: 'New Department Opens', slug: 'new-department-opens' },
    { title: 'Excellence Award Received', slug: 'excellence-award-received' },
    { title: 'Community Health Camp', slug: 'community-health-camp' },
  ];

  for (const location of LOCATIONS) {
    for (let i = 0; i < newsData.length; i++) {
      await prisma.news.create({
        data: {
          title: `${newsData[i].title} - ${location}`,
          slug: `${newsData[i].slug}-${location.toLowerCase().replace(/ /g, '-')}`,
          content: `This is the full content for ${newsData[i].title} at ${location}. Detailed information about the news article.`,
          excerpt: `Excerpt for ${newsData[i].title} at ${location}`,
          image: `/uploads/news/${location.toLowerCase().replace(/ /g, '-')}-${i}.jpg`,
          author: `Admin - ${location}`,
          isPublished: true,
          publishedAt: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000),
          tags: ['health', 'medical'],
          views: Math.floor(Math.random() * 1000) + 100,
          location: location,
        },
      });
    }
    console.log(` Created ${newsData.length} news articles for ${location}`);
  }

  // Create Contacts for each location
  for (const location of LOCATIONS) {
    for (let i = 0; i < 3; i++) {
      await prisma.contact.create({
        data: {
          name: `Contact ${i + 1} - ${location}`,
          email: `contact${i + 1}@example.com`,
          phone: `+123456${String(2000 + i).padStart(4, '0')}`,
          subject: `Inquiry about ${location}`,
          message: `This is a test message for ${location}. Please provide more information about your services.`,
          status: ['UNREAD', 'READ', 'REPLIED'][i],
          location: location,
        },
      });
    }
    console.log(` Created 3 contacts for ${location}`);
  }

  console.log(' Seeding completed successfully!');
  console.log(` Summary:`);
  console.log(`   - ${admins.length} admins created`);
  console.log(`   - ${allDepartments.length} departments created`);
  console.log(`   - ${allServices.length} services created`);
  console.log(`   - ${allDoctors.length} doctors created`);
  console.log(`   - Total appointments: 90 (30 per location)`);
  console.log(`   - Gallery items: ${galleryTitles.length * LOCATIONS.length}`);
  console.log(`   - News articles: ${newsData.length * LOCATIONS.length}`);
  console.log(`   - Contacts: ${3 * LOCATIONS.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });