export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  videoUrl: string;
  author: string;
  authorId: string;
  category: string;
  location: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  content?: string;
}

export const MOCK_BLOGS: Blog[] = [
  {
    id: "cms4o8gv90008bvvryrrr1db5",
    title: "Advancements in Cardiovascular Drug Formulation & Clinical Trials",
    slug: "advancements-cardiovascular-drug-formulation",
    excerpt: "Exploring next-generation pharmaceutical synthesis and targeted delivery mechanisms designed to maximize efficacy and lower patient recovery times.",
    image: "",
    videoUrl: "https://www.youtube.com/watch?v=XuJrFjyMDFg",
    author: "Dr. Admin",
    authorId: "admin-id-1",
    category: "Drug Research",
    location: "Afilas Drug Manufacturing",
    tags: ["Pharmacology", "Drug Manufacturing", "Clinical Research"],
    isPublished: true,
    publishedAt: "2026-07-28T13:08:06.117Z",
    views: 420,
    likes: 38,
    comments: 12,
    createdAt: "2026-07-28T13:08:06.117Z",
    updatedAt: "2026-07-28T13:08:06.117Z",
    content: `
Cardiovascular disease remains one of the leading causes of mortality globally. At Afilas Drug Manufacturing, our research team has pioneered new formulation techniques using biocompatible lipid nanocarriers for antihypertensive and lipid-lowering compounds.

### Key Breakthroughs
1. **Enhanced Bioavailability**: Micro-emulsification allows for faster GI absorption, reducing required dosages by up to 30%.
2. **Quality Control & GMP Standardization**: Every batch undergoes multi-stage HPLC testing to ensure 99.8% compound purity.
3. **Local Production Resilience**: Scaling up production in our ISO/GMP certified facilities ensures steady access to vital heart medicines across the region.

Our ongoing Phase II clinical trials show promising outcomes with lower incidence of side effects and improved long-term compliance among patients.
`
  },
  {
    id: "cms4o4qp00006bvvr1ov97krk",
    title: "Innovations in Automated Laboratory Diagnostics & Imaging",
    slug: "innovations-in-automated-laboratory-diagnostics",
    excerpt: "How modern high-resolution CT imaging combined with fully automated blood biochemistry panels accelerates early diagnostic precision.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "",
    author: "Dr. Admin",
    authorId: "admin-id-2",
    category: "Research",
    location: "Afilas General Hospital",
    tags: ["Diagnostics", "Radiology", "Lab Automation"],
    isPublished: true,
    publishedAt: "2026-07-28T13:05:12.228Z",
    views: 890,
    likes: 74,
    comments: 19,
    createdAt: "2026-07-28T13:05:12.228Z",
    updatedAt: "2026-07-28T13:05:12.228Z",
    content: `
Early and precise diagnosis is the cornerstone of effective healthcare. Afilas Diagnosis Center and Afilas General Hospital have deployed state-of-the-art robotic chemistry analyzers and 128-slice CT scanners.

### Diagnostic Benchmarks
- **Rapid Turnaround**: Standard blood chemistry panels processed in under 30 minutes.
- **AI-Assisted Radiology**: Deep learning algorithms assist radiologists in identifying early-stage pulmonary and coronary anomalies.
- **Digital Patient Portal**: Secure digital delivery of diagnostic reports directly to clinicians and patient devices.

By streamlining the pipeline from specimen collection to clinical interpretation, we empower physicians to initiate targeted therapies sooner.
`
  },
  {
    id: "cms4p1xk00009bvvr3kk891aa",
    title: "Maternal Health & Pediatric Specialty Care Expansion",
    slug: "maternal-health-pediatric-care-expansion",
    excerpt: "Afilas General Hospital announces new specialized pediatric ICU suites and comprehensive maternal wellness programs.",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "",
    author: "Dr. Sarah Chen",
    authorId: "admin-id-3",
    category: "Clinical Care",
    location: "Afilas General Hospital",
    tags: ["Pediatric", "Maternal Care", "Emergency Care"],
    isPublished: true,
    publishedAt: "2026-07-27T10:15:00.000Z",
    views: 610,
    likes: 52,
    comments: 8,
    createdAt: "2026-07-27T10:15:00.000Z",
    updatedAt: "2026-07-27T10:15:00.000Z",
    content: `
Ensuring the highest standards for maternal and child health care is fundamental to our hospital's mission. Our newly launched Maternal & Child Health Unit integrates 24/7 neonatal intensive care with specialized prenatal monitoring.

### Key Amenities & Services
- **Neonatal ICU (NICU)** equipped with advanced incubators and respiratory support systems.
- **Family-Centered Birthing Suites** providing a safe, comfortable, and hygienic environment.
- **Subspecialized Pediatric Surgeons & Gynecologists** available around the clock.
`
  },
  {
    id: "cms4q9aa00010bvvr5mm112bb",
    title: "Strengthening Essential Medicine Supply Chains in East Africa",
    slug: "strengthening-essential-medicine-supply-chains",
    excerpt: "Insights into how localized GMP pharmaceutical manufacturing reduces dependency on foreign medicine imports.",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/watch?v=XuJrFjyMDFg",
    author: "Pharm. Michael Bekele",
    authorId: "admin-id-4",
    category: "Drug Research",
    location: "Afilas Drug Manufacturing",
    tags: ["Supply Chain", "Pharma", "GMP Standard"],
    isPublished: true,
    publishedAt: "2026-07-26T16:40:00.000Z",
    views: 1120,
    likes: 95,
    comments: 24,
    createdAt: "2026-07-26T16:40:00.000Z",
    updatedAt: "2026-07-26T16:40:00.000Z",
    content: `
Global supply disruptions highlight the importance of self-sufficient pharmaceutical production. Afilas Drug Manufacturing is committed to manufacturing high-demand oral solids, liquid suspensions, and sterile formulations locally.

### Industrial Capabilities
- Fully automated bottling and blister packaging lines.
- Stringent environmental monitoring adhering to WHO-GMP and ISO certifications.
- Partnerships with regional hospitals, clinics, and government health institutions.
`
  },
  {
    id: "cms4r3zz00011bvvr8pp334cc",
    title: "Molecular Diagnostics: Early Detection of Genetic Markers",
    slug: "molecular-diagnostics-early-detection",
    excerpt: "Understanding the role of PCR testing and genetic sequencing in personalized treatment plans at Afilas Diagnosis Center.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "",
    author: "Dr. Solomon Tadesse",
    authorId: "admin-id-5",
    category: "Diagnostics",
    location: "Afilas Diagnosis Center",
    tags: ["Molecular Diagnostics", "PCR", "Genomics"],
    isPublished: true,
    publishedAt: "2026-07-25T09:20:00.000Z",
    views: 540,
    likes: 41,
    comments: 6,
    createdAt: "2026-07-25T09:20:00.000Z",
    updatedAt: "2026-07-25T09:20:00.000Z",
    content: `
Molecular diagnostics allow us to look at disease on a cellular level. By detecting genetic markers and viral loads with ultra-sensitive quantitative PCR equipment, clinicians can tailor oncology and infectious disease treatments specifically to the patient.
`
  }
];
