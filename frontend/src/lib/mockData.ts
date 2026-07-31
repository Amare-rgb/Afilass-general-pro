export interface Doctor {
  id: string
  name: string
  specialty: string
  image: string
  bio: string
}

export interface HealthPackage {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  image: string
}

export interface PharmacalProduct {
  id: string
  name: string
  category: string
  description: string
  price: number
  image: string
}

export const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Abebe Kebede',
    specialty: 'Cardiology',
    image: '/doctors/doctor1.png',
    bio: 'Experienced cardiologist with 15+ years in practice',
  },
  {
    id: '2',
    name: 'Dr. Meaza Tekle',
    specialty: 'Pediatrics',
    image: '/doctors/doctor2.png',
    bio: 'Specialized in child health and development',
  },
  {
    id: '3',
    name: 'Dr. Tadesse Assefa',
    specialty: 'Neurology',
    image: '/doctors/doctor3.png',
    bio: 'Expert in neurological disorders and treatment',
  },
  {
    id: '4',
    name: 'Dr. Almaz Girma',
    specialty: 'Orthopedics',
    image: '/doctors/doctor4.png',
    bio: 'Specialized in bone and joint health',
  },
]

export const healthPackages: HealthPackage[] = [
  {
    id: '1',
    name: 'Basic Health Check',
    description: 'Essential health screening package',
    price: 1500,
    features: ['Blood work', 'Physical exam', 'BMI assessment', 'Health consultation'],
    image: '/packages/basic.png',
  },
  {
    id: '2',
    name: 'Comprehensive Health Package',
    description: 'Complete health assessment and screening',
    price: 3500,
    features: [
      'Full blood work',
      'Physical exam',
      'ECG',
      'Ultrasound',
      'Specialist consultation',
      'Health report',
    ],
    image: '/packages/comprehensive.png',
  },
  {
    id: '3',
    name: 'Premium Wellness',
    description: 'Comprehensive wellness and preventive care',
    price: 6000,
    features: [
      'All comprehensive tests',
      'Genetic screening',
      'Stress test',
      'Personal health plan',
      'Priority appointments',
      'Annual follow-up',
    ],
    image: '/packages/premium.png',
  },
]

export const pharmacalProducts: PharmacalProduct[] = [
  {
    id: '1',
    name: 'Vitamin C Plus',
    category: 'Supplements',
    description: 'Immune system booster supplement',
    price: 250,
    image: '/pharma/vitamin-c.png',
  },
  {
    id: '2',
    name: 'Multi-Mineral Complex',
    category: 'Supplements',
    description: 'Essential minerals for daily health',
    price: 450,
    image: '/pharma/minerals.png',
  },
  {
    id: '3',
    name: 'Omega-3 Supplement',
    category: 'Heart Health',
    description: 'Heart and brain health support',
    price: 550,
    image: '/pharma/omega3.png',
  },
  {
    id: '4',
    name: 'Joint Care Formula',
    category: 'Mobility',
    description: 'Support for bone and joint health',
    price: 650,
    image: '/pharma/joint-care.png',
  },
  {
    id: '5',
    name: 'Digestive Enzyme',
    category: 'Digestive Health',
    description: 'Natural digestive support',
    price: 350,
    image: '/pharma/digestive.png',
  },
  {
    id: '6',
    name: 'Sleep Well Formula',
    category: 'Sleep Support',
    description: 'Natural sleep aid and relaxation',
    price: 400,
    image: '/pharma/sleep.png',
  },
]
