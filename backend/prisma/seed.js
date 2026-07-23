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
    prisma.department.deleteMany(),
    prisma.user.deleteMany(),
    prisma.gallery.deleteMany(),
    prisma.news.deleteMany(),
    prisma.contact.deleteMany(),
  ]);

  console.log('🧹 Cleaned database');

  // Create Super Admin
  const hashedPassword = await bcrypt.hash('Admin@123456', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@afilashospital.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      phone: '+1234567890',
      isActive: true,
    },
  });

  console.log(`✅ Created admin: ${admin.email}`);

  // Create Departments - NO slug, NO nameAmharic
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

  const departments = [];
  for (const deptData of departmentsData) {
    const department = await prisma.department.create({
      data: deptData,
    });
    departments.push(department);
  }

  console.log(`✅ Created ${departments.length} departments`);

  // Create Services
  const services = [];
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

  for (const deptData of serviceData) {
    const department = departments.find(d => d.name === deptData.dept);
    if (department) {
      for (const svc of deptData.services) {
        const service = await prisma.service.create({
          data: {
            name: svc.name,
            description: svc.description,
            price: svc.price,
            duration: svc.duration,
            departmentId: department.id,
            isActive: true,
          },
        });
        services.push(service);
      }
    }
  }

  console.log(`✅ Created ${services.length} services`);

  // Create Gallery Items
  const galleryItems = await Promise.all([
    prisma.gallery.create({
      data: {
        title: 'Our Hospital Exterior',
        description: 'Modern, state-of-the-art hospital facility',
        type: 'IMAGE',
        url: '/uploads/gallery/hospital-exterior.jpg',
        order: 1,
        isActive: true,
      },
    }),
    prisma.gallery.create({
      data: {
        title: 'Surgery Center',
        description: 'Advanced surgical suites with latest technology',
        type: 'IMAGE',
        url: '/uploads/gallery/surgery-center.jpg',
        order: 2,
        isActive: true,
      },
    }),
    prisma.gallery.create({
      data: {
        title: 'Patient Rooms',
        description: 'Comfortable and modern patient rooms',
        type: 'IMAGE',
        url: '/uploads/gallery/patient-rooms.jpg',
        order: 3,
        isActive: true,
      },
    }),
    prisma.gallery.create({
      data: {
        title: 'Medical Team',
        description: 'Our dedicated healthcare professionals',
        type: 'IMAGE',
        url: '/uploads/gallery/medical-team.jpg',
        order: 4,
        isActive: true,
      },
    }),
    prisma.gallery.create({
      data: {
        title: 'Hospital Introduction',
        description: 'Welcome to Afilas Hospital',
        type: 'VIDEO',
        url: '/uploads/gallery/hospital-intro.mp4',
        order: 5,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${galleryItems.length} gallery items`);

  // Create News
  const news = await Promise.all([
    prisma.news.create({
      data: {
        title: 'New Cardiology Department Opens',
        slug: 'new-cardiology-department-opens',
        content: 'We are proud to announce the opening of our new state-of-the-art Cardiology Department. Equipped with the latest diagnostic and treatment technologies, our department offers comprehensive heart care services including preventive cardiology, interventional procedures, and cardiac rehabilitation.',
        excerpt: 'State-of-the-art cardiology department now open',
        image: '/uploads/news/cardiology-dept.jpg',
        author: 'Dr. Michael Anderson',
        isPublished: true,
        publishedAt: new Date(),
        tags: ['cardiology', 'new-facility', 'healthcare'],
        views: 1250,
      },
    }),
    prisma.news.create({
      data: {
        title: 'Stroke Care Excellence Award',
        slug: 'stroke-care-excellence-award',
        content: 'Afilas Hospital has been recognized with the Stroke Care Excellence Award for our outstanding comprehensive stroke care program. Our stroke center provides rapid diagnosis and treatment, significantly improving patient outcomes.',
        excerpt: 'Afilas Hospital receives Stroke Care Excellence Award',
        image: '/uploads/news/stroke-award.jpg',
        author: 'Dr. Sarah Johnson',
        isPublished: true,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        tags: ['stroke', 'award', 'neurology'],
        views: 890,
      },
    }),
    prisma.news.create({
      data: {
        title: 'Free Health Camp in Community',
        slug: 'free-health-camp-community',
        content: 'In our commitment to community health, Afilas Hospital organized a free health camp providing medical check-ups, health education, and preventive screenings to over 500 community members. The camp was a great success with high participation.',
        excerpt: 'Successful community health camp reaches over 500 people',
        image: '/uploads/news/health-camp.jpg',
        author: 'Dr. Emily Williams',
        isPublished: true,
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        tags: ['community', 'health-camp', 'outreach'],
        views: 650,
      },
    }),
  ]);

  console.log(`✅ Created ${news.length} news articles`);

  // Create Sample Contacts
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1234567897',
        subject: 'Appointment Inquiry',
        message: 'I would like to schedule a cardiology consultation. Please let me know the available dates.',
        status: 'UNREAD',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        phone: '+1234567898',
        subject: 'Insurance Coverage',
        message: 'Could you please provide information about the insurance plans accepted at your hospital?',
        status: 'READ',
      },
    }),
  ]);

  console.log(`✅ Created ${contacts.length} sample contacts`);

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });