// app/(site)/departments/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Department } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// Department colors with unique gradients for each department
const DEPARTMENT_COLORS: Record<string, any> = {
  'anesthesia': { 
    gradient: 'from-blue-500 to-blue-600', 
    bgColor: 'bg-blue-50', 
    borderColor: 'hover:border-blue-400', 
    hoverBg: 'hover:bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  'dermatology-and-venereal-disease': { 
    gradient: 'from-pink-500 to-rose-600', 
    bgColor: 'bg-pink-50', 
    borderColor: 'hover:border-pink-400', 
    hoverBg: 'hover:bg-pink-50',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600'
  },
  'ent': { 
    gradient: 'from-purple-500 to-purple-600', 
    bgColor: 'bg-purple-50', 
    borderColor: 'hover:border-purple-400', 
    hoverBg: 'hover:bg-purple-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  'internal-medicine': { 
    gradient: 'from-green-500 to-emerald-600', 
    bgColor: 'bg-green-50', 
    borderColor: 'hover:border-green-400', 
    hoverBg: 'hover:bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  'medical-laboratory-sciences': { 
    gradient: 'from-indigo-500 to-indigo-600', 
    bgColor: 'bg-indigo-50', 
    borderColor: 'hover:border-indigo-400', 
    hoverBg: 'hover:bg-indigo-50',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  },
  'neurology': { 
    gradient: 'from-cyan-500 to-cyan-600', 
    bgColor: 'bg-cyan-50', 
    borderColor: 'hover:border-cyan-400', 
    hoverBg: 'hover:bg-cyan-50',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600'
  },
  'neurosurgery': { 
    gradient: 'from-violet-500 to-violet-600', 
    bgColor: 'bg-violet-50', 
    borderColor: 'hover:border-violet-400', 
    hoverBg: 'hover:bg-violet-50',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600'
  },
  'obstetrics-and-gynecology': { 
    gradient: 'from-rose-500 to-pink-600', 
    bgColor: 'bg-rose-50', 
    borderColor: 'hover:border-rose-400', 
    hoverBg: 'hover:bg-rose-50',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600'
  },
  'ophthalmology': { 
    gradient: 'from-sky-500 to-sky-600', 
    bgColor: 'bg-sky-50', 
    borderColor: 'hover:border-sky-400', 
    hoverBg: 'hover:bg-sky-50',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600'
  },
  'oral-and-maxillofacial-surgery': { 
    gradient: 'from-amber-500 to-amber-600', 
    bgColor: 'bg-amber-50', 
    borderColor: 'hover:border-amber-400', 
    hoverBg: 'hover:bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600'
  },
  'orthopedic-surgery': { 
    gradient: 'from-orange-500 to-orange-600', 
    bgColor: 'bg-orange-50', 
    borderColor: 'hover:border-orange-400', 
    hoverBg: 'hover:bg-orange-50',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
  'paediatric-orthopedic-surgery': { 
    gradient: 'from-teal-500 to-teal-600', 
    bgColor: 'bg-teal-50', 
    borderColor: 'hover:border-teal-400', 
    hoverBg: 'hover:bg-teal-50',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600'
  },
  'pathology': { 
    gradient: 'from-gray-600 to-gray-700', 
    bgColor: 'bg-gray-50', 
    borderColor: 'hover:border-gray-400', 
    hoverBg: 'hover:bg-gray-50',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600'
  },
  'pediatrics-and-child-health': { 
    gradient: 'from-emerald-500 to-emerald-600', 
    bgColor: 'bg-emerald-50', 
    borderColor: 'hover:border-emerald-400', 
    hoverBg: 'hover:bg-emerald-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600'
  },
  'pediatrics-surgery': { 
    gradient: 'from-cyan-600 to-cyan-700', 
    bgColor: 'bg-cyan-50', 
    borderColor: 'hover:border-cyan-400', 
    hoverBg: 'hover:bg-cyan-50',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600'
  },
  'pharmacy': { 
    gradient: 'from-lime-500 to-lime-600', 
    bgColor: 'bg-lime-50', 
    borderColor: 'hover:border-lime-400', 
    hoverBg: 'hover:bg-lime-50',
    iconBg: 'bg-lime-100',
    iconColor: 'text-lime-600'
  },
  'physiotherapy': { 
    gradient: 'from-green-500 to-green-600', 
    bgColor: 'bg-green-50', 
    borderColor: 'hover:border-green-400', 
    hoverBg: 'hover:bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  'plastic-reconstructive-and-hand-surgery': { 
    gradient: 'from-fuchsia-500 to-fuchsia-600', 
    bgColor: 'bg-fuchsia-50', 
    borderColor: 'hover:border-fuchsia-400', 
    hoverBg: 'hover:bg-fuchsia-50',
    iconBg: 'bg-fuchsia-100',
    iconColor: 'text-fuchsia-600'
  },
  'psychiatry': { 
    gradient: 'from-indigo-600 to-indigo-700', 
    bgColor: 'bg-indigo-50', 
    borderColor: 'hover:border-indigo-400', 
    hoverBg: 'hover:bg-indigo-50',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  },
  'radiology': { 
    gradient: 'from-sky-500 to-sky-600', 
    bgColor: 'bg-sky-50', 
    borderColor: 'hover:border-sky-400', 
    hoverBg: 'hover:bg-sky-50',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600'
  },
  'surgery': { 
    gradient: 'from-red-500 to-red-600', 
    bgColor: 'bg-red-50', 
    borderColor: 'hover:border-red-400', 
    hoverBg: 'hover:bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600'
  },
  'urology': { 
    gradient: 'from-yellow-500 to-amber-600', 
    bgColor: 'bg-yellow-50', 
    borderColor: 'hover:border-yellow-400', 
    hoverBg: 'hover:bg-yellow-50',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  }
};

// Fallback data with colors
const FALLBACK_DEPARTMENTS = [
  {
    id: 1,
    name: 'Anesthesia',
    nameAmharic: 'አናስቴዢያ',
    summary: 'Epidural Analgesia for labour and delivery service Tap block for post operative pain after abdominal surgery, General anesthesia, Regional anesthesia, Pain management',
    slug: 'anesthesia',
    gradient: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'hover:border-blue-400',
    hoverBg: 'hover:bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    id: 2,
    name: 'Dermatology and Venereal Disease',
    nameAmharic: 'የቆዳ እና የወሲብ በሽታዎች',
    summary: 'Evaluation, diagnosis and management of Melasma, Sunburn, Acne, Allergic and contact dermatitis, Psoriasis, Leprosy, Sexual transmitted diseases, Post kalazar skin conditions',
    slug: 'dermatology-and-venereal-disease',
    gradient: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50',
    borderColor: 'hover:border-pink-400',
    hoverBg: 'hover:bg-pink-50',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600'
  },
  {
    id: 3,
    name: 'Ear, Nose and Throat (ENT)',
    nameAmharic: 'ጆሮ፣ አፍንጫ እና ጉሮሮ',
    summary: 'Acute and chronic otitis media, Hearing aid use, Chronic rhino sinusitis, Allergic rhinitis, Recurrent epistaxis, Tonsillectomy, Adenoidectomy',
    slug: 'ent',
    gradient: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'hover:border-purple-400',
    hoverBg: 'hover:bg-purple-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    id: 4,
    name: 'Internal Medicine',
    nameAmharic: 'የውስጥ ሕክምና',
    summary: 'Emergency department Treatment of Diabetic Ketoacidosis(DKA)~hypoglycemia Evaluation and treatment of acute exacerbation(Bronchial asthma,Chronic Obstructive Pulmonary disease), Hypertension management, Diabetes care',
    slug: 'internal-medicine',
    gradient: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'hover:border-green-400',
    hoverBg: 'hover:bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 5,
    name: 'Medical Laboratory Sciences',
    nameAmharic: 'የላብራቶሪ ሳይንስ',
    summary: 'Bacteriology, Gram stain, Acid Fast stain, Culture and sensitivity, Parasitology like Blood film, Stool examination, Hematology, Clinical chemistry, Immunology',
    slug: 'medical-laboratory-sciences',
    gradient: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'hover:border-indigo-400',
    hoverBg: 'hover:bg-indigo-50',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  },
  {
    id: 6,
    name: 'Neurology',
    nameAmharic: 'የነርቭ ሕክምና',
    summary: 'Epilepsy and other seizure disorders, Parkinson\'s disease and other movement disorders, Different muscular diseases (Myopathy), Multiple sclerosis, Stroke management, Headache disorders',
    slug: 'neurology',
    gradient: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'hover:border-cyan-400',
    hoverBg: 'hover:bg-cyan-50',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600'
  },
  {
    id: 7,
    name: 'Neurosurgery',
    nameAmharic: 'የነርቭ ቀዶ ሕክምና',
    summary: 'OPD services and consultations on Brain mass, Hydrocephalus, Head injury, Minor and major neurosurgery procedures, Spinal surgery, Peripheral nerve surgery',
    slug: 'neurosurgery',
    gradient: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'hover:border-violet-400',
    hoverBg: 'hover:bg-violet-50',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600'
  },
  {
    id: 8,
    name: 'Obstetrics and Gynecology',
    nameAmharic: 'የማህፀን እና የወሊድ ሕክምና',
    summary: 'Emergency department Evaluation and management of survivors of sexual assault Diagnosis and management of acute conditions, Antenatal care, Normal and complicated deliveries, Gynecological surgeries',
    slug: 'obstetrics-and-gynecology',
    gradient: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
    borderColor: 'hover:border-rose-400',
    hoverBg: 'hover:bg-rose-50',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600'
  },
  {
    id: 9,
    name: 'Ophthalmology',
    nameAmharic: 'የዓይን ሕክምና',
    summary: 'Emergency and outpatient service of Ophthalmic injury, Blepharitis, Cataract and Glaucoma, Diabetic and hypertension related eye care, Refractive error correction, Retinal diseases',
    slug: 'ophthalmology',
    gradient: 'from-sky-500 to-sky-600',
    bgColor: 'bg-sky-50',
    borderColor: 'hover:border-sky-400',
    hoverBg: 'hover:bg-sky-50',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600'
  },
  {
    id: 10,
    name: 'Oral and Maxillofacial Surgery',
    nameAmharic: 'የአፍ እና የፊት ቀዶ ሕክምና',
    summary: 'Evaluation and treatment of Abscess drainage, Anterior segmental osteotomy, Cleft lip and cleft palate repair, Dental implants, Facial trauma surgery, Orthognathic surgery',
    slug: 'oral-and-maxillofacial-surgery',
    gradient: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'hover:border-amber-400',
    hoverBg: 'hover:bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600'
  },
  {
    id: 11,
    name: 'Orthopedic Surgery',
    nameAmharic: 'የአጥንት ቀዶ ህክምና',
    summary: 'Outpatient Services, Emergency Orthopedics, Trauma services, Major and minor orthopedics procedures, Inpatient clinical care, Rehabilitation, Joint replacement surgery, Arthroscopy',
    slug: 'orthopedic-surgery',
    gradient: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'hover:border-orange-400',
    hoverBg: 'hover:bg-orange-50',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
  {
    id: 12,
    name: 'Paediatric Orthopedic Surgery',
    nameAmharic: 'የልጆች አጥንት ሕክምና',
    summary: 'Emergency pediatric orthopedic care, Outpatient pediatric orthopedic care, Surgical services, Inpatient care, Congenital anomalies treatment, Pediatric fracture management, Growth plate injuries',
    slug: 'paediatric-orthopedic-surgery',
    gradient: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'hover:border-teal-400',
    hoverBg: 'hover:bg-teal-50',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600'
  },
  {
    id: 13,
    name: 'Pathology',
    nameAmharic: 'የፓቶሎጂ',
    summary: 'Tissue biopsy, Fine Needle Aspiration, Bone Marrow and Peripheral morphology evaluation, Fluid cytology (Peritoneal, pleural, CSF), Histopathology, Immunohistochemistry',
    slug: 'pathology',
    gradient: 'from-gray-600 to-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'hover:border-gray-400',
    hoverBg: 'hover:bg-gray-50',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600'
  },
  {
    id: 14,
    name: 'Pediatrics and Child Health',
    nameAmharic: 'የሕፃናት ሕክምና',
    summary: 'Emergency Management of diarrheal illness, shock and Dehydration, Work up and management of febrile child, Newborn care, Childhood infections, Growth and development monitoring, Vaccination services',
    slug: 'pediatrics-and-child-health',
    gradient: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'hover:border-emerald-400',
    hoverBg: 'hover:bg-emerald-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600'
  },
  {
    id: 15,
    name: 'Pediatrics Surgery',
    nameAmharic: 'የሕፃናት ቀዶ ሕክምና',
    summary: 'Congenital anomalies like anorectal malformations, hypospadias, undescended testis, Burns, injuries and accidents, Tumors and growths at childhood, Neonatal surgery, Pediatric urology',
    slug: 'pediatrics-surgery',
    gradient: 'from-cyan-600 to-cyan-700',
    bgColor: 'bg-cyan-50',
    borderColor: 'hover:border-cyan-400',
    hoverBg: 'hover:bg-cyan-50',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600'
  },
  {
    id: 16,
    name: 'Pharmacy',
    nameAmharic: 'የፋርማሲ',
    summary: 'Dispense prescriptions, Communicate with prescribers, Ensure patient safety, Counseling of patients, Medication management, Clinical pharmacy services, Drug information',
    slug: 'pharmacy',
    gradient: 'from-lime-500 to-lime-600',
    bgColor: 'bg-lime-50',
    borderColor: 'hover:border-lime-400',
    hoverBg: 'hover:bg-lime-50',
    iconBg: 'bg-lime-100',
    iconColor: 'text-lime-600'
  },
  {
    id: 17,
    name: 'Physiotherapy',
    nameAmharic: 'የአካል ሕክምና',
    summary: 'Physiotherapy services for Neck and Shoulder pain, Back, hip and pelvic pain, Knee, elbow, wrist and ankle pain, Stroke rehabilitation, Sports injuries, Post-surgical rehabilitation',
    slug: 'physiotherapy',
    gradient: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'hover:border-green-400',
    hoverBg: 'hover:bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 18,
    name: 'Plastic, Reconstructive and Hand Surgery',
    nameAmharic: 'የፕላስቲክ እና እጅ ቀዶ ሕክምና',
    summary: 'Reconstructive surgery, Burn treatment, Hand surgery, Aesthetic Surgery, Cleft lip and palate repair, Breast reconstruction, Skin grafting, Microsurgery',
    slug: 'plastic-reconstructive-and-hand-surgery',
    gradient: 'from-fuchsia-500 to-fuchsia-600',
    bgColor: 'bg-fuchsia-50',
    borderColor: 'hover:border-fuchsia-400',
    hoverBg: 'hover:bg-fuchsia-50',
    iconBg: 'bg-fuchsia-100',
    iconColor: 'text-fuchsia-600'
  },
  {
    id: 19,
    name: 'Psychiatry',
    nameAmharic: 'የስነ ልቦና ሕክምና',
    summary: 'Emergency Suicidal patients, Disaster management, Panic attack management, Patients in need of follow up, Substance dependence treatment, Agitated patients, Depression, Anxiety disorders',
    slug: 'psychiatry',
    gradient: 'from-indigo-600 to-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'hover:border-indigo-400',
    hoverBg: 'hover:bg-indigo-50',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  },
  {
    id: 20,
    name: 'Radiology',
    nameAmharic: 'የራዲዮሎጂ',
    summary: 'X-ray unit, Reading and taking x-ray of all body parts, Ultrasound, Abdominal and pelvic imaging, CT Scan, MRI, Interventional radiology, Mammography',
    slug: 'radiology',
    gradient: 'from-sky-500 to-sky-600',
    bgColor: 'bg-sky-50',
    borderColor: 'hover:border-sky-400',
    hoverBg: 'hover:bg-sky-50',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600'
  },
  {
    id: 21,
    name: 'Surgery',
    nameAmharic: 'አጠቃላይ ቀዶ ሕክምና',
    summary: 'EMERGENCY SERVICE, Treatment and life support for trauma patients, Due to stick, stab, fall down injuries, General surgical procedures, Laparoscopic surgery, Hernia repair, Gallbladder surgery',
    slug: 'surgery',
    gradient: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'hover:border-red-400',
    hoverBg: 'hover:bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600'
  },
  {
    id: 22,
    name: 'Urology',
    nameAmharic: 'የሽንት ሕክምና',
    summary: 'OPD services and consultations, Renal and ureteric stones treatment, Bladder cancer management, Benign disorders of prostate, Urinary tract infections, Male infertility, Urological surgeries',
    slug: 'urology',
    gradient: 'from-yellow-500 to-amber-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'hover:border-yellow-400',
    hoverBg: 'hover:bg-yellow-50',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  }
];

// Default colors for any department not in the map
const DEFAULT_COLORS = {
  gradient: 'from-gray-500 to-gray-600',
  bgColor: 'bg-gray-50',
  borderColor: 'hover:border-gray-400',
  hoverBg: 'hover:bg-gray-50',
  iconBg: 'bg-gray-100',
  iconColor: 'text-gray-600'
};

// Generate a unique color based on department name if not in map
function generateUniqueColors(name: string) {
  const colors = [
    { gradient: 'from-red-500 to-rose-600', bgColor: 'bg-red-50', borderColor: 'hover:border-red-400', hoverBg: 'hover:bg-red-50', iconBg: 'bg-red-100', iconColor: 'text-red-600' },
    { gradient: 'from-orange-500 to-amber-600', bgColor: 'bg-orange-50', borderColor: 'hover:border-orange-400', hoverBg: 'hover:bg-orange-50', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
    { gradient: 'from-yellow-500 to-amber-600', bgColor: 'bg-yellow-50', borderColor: 'hover:border-yellow-400', hoverBg: 'hover:bg-yellow-50', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { gradient: 'from-lime-500 to-lime-600', bgColor: 'bg-lime-50', borderColor: 'hover:border-lime-400', hoverBg: 'hover:bg-lime-50', iconBg: 'bg-lime-100', iconColor: 'text-lime-600' },
    { gradient: 'from-green-500 to-emerald-600', bgColor: 'bg-green-50', borderColor: 'hover:border-green-400', hoverBg: 'hover:bg-green-50', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { gradient: 'from-teal-500 to-teal-600', bgColor: 'bg-teal-50', borderColor: 'hover:border-teal-400', hoverBg: 'hover:bg-teal-50', iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
    { gradient: 'from-cyan-500 to-cyan-600', bgColor: 'bg-cyan-50', borderColor: 'hover:border-cyan-400', hoverBg: 'hover:bg-cyan-50', iconBg: 'bg-cyan-100', iconColor: 'text-cyan-600' },
    { gradient: 'from-sky-500 to-sky-600', bgColor: 'bg-sky-50', borderColor: 'hover:border-sky-400', hoverBg: 'hover:bg-sky-50', iconBg: 'bg-sky-100', iconColor: 'text-sky-600' },
    { gradient: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', borderColor: 'hover:border-blue-400', hoverBg: 'hover:bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { gradient: 'from-indigo-500 to-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'hover:border-indigo-400', hoverBg: 'hover:bg-indigo-50', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
    { gradient: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', borderColor: 'hover:border-purple-400', hoverBg: 'hover:bg-purple-50', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { gradient: 'from-fuchsia-500 to-fuchsia-600', bgColor: 'bg-fuchsia-50', borderColor: 'hover:border-fuchsia-400', hoverBg: 'hover:bg-fuchsia-50', iconBg: 'bg-fuchsia-100', iconColor: 'text-fuchsia-600' },
    { gradient: 'from-pink-500 to-rose-600', bgColor: 'bg-pink-50', borderColor: 'hover:border-pink-400', hoverBg: 'hover:bg-pink-50', iconBg: 'bg-pink-100', iconColor: 'text-pink-600' },
    { gradient: 'from-rose-500 to-pink-600', bgColor: 'bg-rose-50', borderColor: 'hover:border-rose-400', hoverBg: 'hover:bg-rose-50', iconBg: 'bg-rose-100', iconColor: 'text-rose-600' },
  ];
  
  // Use hash of name to pick a color
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export default function DepartmentsPage() {
  const { t } = useLanguage();
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('📡 Fetching departments from API...');
        
        const response = await api.get<any>('/departments');
        console.log('📡 API Response:', response);
        
        let departmentsArray: any[] = [];
        
        if (response) {
          if (response.data && Array.isArray(response.data)) {
            departmentsArray = response.data;
          } else if (Array.isArray(response)) {
            departmentsArray = response;
          } else if (response.success && response.data && Array.isArray(response.data)) {
            departmentsArray = response.data;
          } else if (response.departments && Array.isArray(response.departments)) {
            departmentsArray = response.departments;
          }
        }
        
        console.log(`📊 Found ${departmentsArray.length} departments in response`);
        
        if (departmentsArray.length > 0) {
          const mappedData = departmentsArray.map((dept: any) => {
            const slug = dept.slug || dept.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `dept-${dept.id}`;
            
            // Get colors from predefined map, or generate unique colors
            let colors = DEPARTMENT_COLORS[slug];
            if (!colors) {
              colors = generateUniqueColors(dept.name || slug);
            }
            
            return {
              ...dept,
              slug: slug,
              ...colors,
              name: dept.name || 'Department',
              summary: dept.description || dept.summary || t('dept.default_summary'),
            };
          });
          setDepartments(mappedData);
          console.log(`✅ Mapped ${mappedData.length} departments with unique colors`);
        } else {
          console.warn('⚠️ No departments found, using fallback data');
          setDepartments(FALLBACK_DEPARTMENTS);
        }
      } catch (error) {
        console.error('❌ Error fetching departments:', error);
        setError(t('dept.error_load'));
        setDepartments(FALLBACK_DEPARTMENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [t]);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          element.classList.add('ring-4', 'ring-[#C5A059]', 'ring-offset-4', 'scale-105');
          setTimeout(() => {
            element.classList.remove('ring-4', 'ring-[#C5A059]', 'ring-offset-4', 'scale-105');
          }, 3000);
        }
      }, 500);
    }
  }, [departments]);

  const displayDepartments = departments.length > 0 ? departments : FALLBACK_DEPARTMENTS;

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-clinical-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-clinical-900 to-clinical-800"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-5 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-4">
            {t('dept.comprehensive_care')}
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4 text-white">
            {t('dept.title')}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {t('dept.subtitle')}
          </p>
        </div>
      </section>

      {/* All Departments Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-clinical-900 mb-3">
              {t('dept.specialized')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('dept.description')}
            </p>
            {error && (
              <p className="text-amber-600 text-sm mt-4 bg-amber-50 px-4 py-2 rounded-lg inline-block">
                ⚠️ {error}
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A059]"></div>
            </div>
          ) : displayDepartments.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">{t('dept.no_departments')}</p>
              <p className="text-sm text-gray-400 mt-2">{t('dept.check_back')}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayDepartments.map((dept: any) => {
                const gradient = dept.gradient || 'from-gray-500 to-gray-600';
                const borderColor = dept.borderColor || 'hover:border-gray-400';
                const hoverBg = dept.hoverBg || 'hover:bg-gray-50';
                const bgColor = dept.bgColor || 'bg-gray-50';
                const iconBg = dept.iconBg || 'bg-gray-100';
                const iconColor = dept.iconColor || 'text-gray-600';

                return (
                  <div
                    key={dept.id}
                    id={dept.slug}
                    className={`group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] scroll-mt-24 min-h-[280px] flex flex-col ${hoverBg}`}
                  >
                    {/* Animated Gradient Border on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5A059]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    
                    {/* Card Header with Unique Gradient Background */}
                    <div className={`bg-gradient-to-r ${gradient} p-5 relative overflow-hidden flex-shrink-0`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10 group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="relative">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-base leading-tight group-hover:tracking-wide transition-all duration-300">
                              {dept.name}
                            </h3>
                            {dept.nameAmharic && (
                              <p className="text-white/80 text-xs mt-0.5 font-medium group-hover:text-white transition-colors duration-300">
                                {dept.nameAmharic}
                              </p>
                            )}
                          </div>
                          {/* Decorative Icon with Department Color */}
                          <div className={`w-8 h-8 rounded-full ${iconBg} backdrop-blur-sm flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-all duration-300 ${iconColor}`}>
                            {dept.id}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 flex-1 min-h-[80px] group-hover:text-gray-700 transition-colors duration-300">
                        {dept.summary || dept.description || t('dept.default_summary')}
                      </p>

                      {/* Learn More Link */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between group-hover:border-[#C5A059]/40 transition-all duration-300">
                        <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-wider group-hover:tracking-widest transition-all duration-300 flex items-center gap-2">
                          {t('dept.learn')}
                          <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                        <span className="text-gray-300 group-hover:text-[#C5A059] group-hover:rotate-90 transition-all duration-300 text-sm">
                          ↗
                        </span>
                      </div>
                    </div>

                    {/* Hover Border Effect */}
                    <div className={`absolute inset-0 border-2 border-transparent ${borderColor} rounded-2xl transition-all duration-500 pointer-events-none group-hover:border-opacity-100`}></div>
                    
                    {/* Glow Effect on Hover */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C5A059]/0 via-[#C5A059]/10 to-[#C5A059]/0 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-clinical-900 mb-6">
            {t('dept.cta')}
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            {t('dept.cta_text')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/appointment"
              className="bg-[#C5A059] hover:bg-[#B8963A] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 hover:scale-105"
            >
              {t('dept.book')}
            </Link>
            <Link
              href="/contact"
              className="border-2 border-[#C5A059] text-[#8B6B3A] hover:bg-[#C5A059] hover:text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              {t('dept.contact')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}