"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "am";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.hospital": "Hospital",
    "nav.diagnostics": "Diagnostics",
    "nav.pharma": "Pharmacy",
    "nav.about": "About",
    "nav.contact": "Contact",

    "nav.service": "Services",
    "nav.blog": "Blog",
    "nav.group_dropdown_title": "The pillars of Afilas healthcare business",
    "nav.division.hospital_desc":
      "Compassionate, specialized patient care available 24/7.",
    "nav.division.diagnostics_desc":
      "High-precision imaging and automated laboratory testing.",
    "nav.division.pharma_desc":
      "Quality-driven, accessible pharmaceutical production meeting international standards.",
    // ========================================================================
    "nav.group": "Afilas Group",
    "nav.about_us": "About Us",
    "nav.contact_emergency": "Contact & Emergency",
    "nav.select_division": "Select Division",
    "nav.division.group": "Afilas Group",
    "nav.division.hospital": "Afilas General Hospital",
    "nav.division.diagnostics": "Afilas Diagnosis Center",
    "nav.division.pharma": "Afilas Drug Manufacturing",
    "topbar.emergency_available": "Emergency Care Available 24/7",
    "topbar.call": "Call:",
    "cta.emergency_call": "Emergency Call",
    "cta.book_appointment": "Book Appointment",
    "cta.get_lab_results": "Get Lab Results",
    // ========================================================================
    "hero.headline": "Complete Healthcare Solutions Under One Umbrella.",
    "hero.subheadline":
      "From advanced clinical care and precision diagnostics to local pharmaceutical manufacturing, Afilas is dedicated to elevating health standards across the region.",
    "hero.cta_doctor": "Find a Doctor",
    "hero.cta_diagnostic": "Book Diagnostic Test",
    "hero.cta_pharma": "Explore Pharma Division",
    "hero.badge_emergency": "24/7 Emergency Care",
    "hero.badge_iso": "ISO/GMP Compliant",
    "hero.badge_lab": "Advanced Automated Lab",

    "pillars.title": "Integrated Excellence Across Healthcare",
    "pillars.subtitle":
      "Discover how our three dedicated divisions work together to deliver comprehensive care and reliable pharmaceutical solutions.",
    "pillars.hospital_tagline":
      "Compassionate, specialized patient care available 24/7.",
    "pillars.hospital_desc":
      "Delivering patient-centered care with state-of-the-art medical technology and highly qualified specialists.",
    "pillars.hospital_highlights_1": "Inpatient & Outpatient Care",
    "pillars.hospital_highlights_2": "24/7 Emergency & Surgical Suites",
    "pillars.hospital_highlights_3": "Maternal & Child Health Care",
    "pillars.hospital_cta": "Explore Hospital Services",
    "pillars.diagnostics_tagline":
      "High-precision imaging and automated laboratory testing.",
    "pillars.diagnostics_desc":
      "Equipping clinicians and patients with accurate, timely diagnostic insights to ensure early detection and targeted treatments.",
    "pillars.diagnostics_highlights_1":
      "Advanced Imaging (CT Scan, MRI, Digital X-Ray)",
    "pillars.diagnostics_highlights_2": "Automated Pathology & Hematology",
    "pillars.diagnostics_highlights_3":
      "Molecular Diagnostics & Special Lab Tests",
    "pillars.diagnostics_cta": "Book a Test / View Services",
    "pillars.pharma_tagline":
      "Quality-driven, accessible pharmaceutical production meeting international standards.",
    "pillars.pharma_desc":
      "Strengthening healthcare resilience by producing safe, effective, and affordable essential medicines locally.",
    "pillars.pharma_highlights_1": "High-Standard Formulation & Packaging",
    "pillars.pharma_highlights_2": "Strict Quality Control & GMP Adherence",
    "pillars.pharma_highlights_3": "B2B & Institutional Wholesale Distribution",
    "pillars.pharma_cta": "View Products & Capabilities",

    "values.headline": "Why Trust Afilas With Your Health?",
    "values.feature_1_title": "End-to-End Healthcare",
    "values.feature_1_desc":
      "From diagnosis and inpatient clinical care to post-treatment pharmaceuticals, we manage the entire care journey seamlessly.",
    "values.feature_2_title": "Cutting-Edge Technology",
    "values.feature_2_desc":
      "Equipped with modern diagnostic tools, modern surgical theaters, and automated pharmaceutical machinery.",
    "values.feature_3_title": "Uncompromising Quality & Safety",
    "values.feature_3_desc":
      "Driven by international clinical standards, strict infection control, and Good Manufacturing Practice (GMP) compliance.",

    "doctors.headline": "Find a Doctor & Book Your Visit",
    "doctors.subtitle":
      "Connect with experienced specialists across key medical disciplines.",
    "doctors.filter_specialty": "Select Specialty",
    "doctors.filter_availability": "Select Availability",
    "doctors.filter_search": "Search Doctor by Name...",
    "doctors.view_all": "View All Specialists & Schedule",
    "doctors.book": "Book Appointment",

    "footer.tagline":
      "Elevating health through care, precision, and production.",
    "footer.address": "Address: [Insert Facility Address]",
    "footer.phone": "Phone: [Insert Main Desk Number]",
    "footer.email": "Email: [Insert Info Email]",
    "footer.quick_links": "Quick Links",
    "footer.hospital_departments": "Hospital Departments",
    "footer.diagnostic_packages": "Diagnostic Packages",
    "footer.pharma_catalog": "Pharma Catalog",
    "footer.careers_news": "Careers & News",
    "footer.emergency_support": "Emergency & Support",
    "footer.emergency_hotline": "Emergency Hotline: [Insert Phone]",
    "footer.lab_results": "Lab Results Portal",
    "footer.lab_results_link": "Login / Access Link",
    "footer.pharma_inquiries": "Pharma Commercial Inquiries",
    "footer.pharma_inquiries_contact": "[Contact B2B Team]",
    "footer.rights_reserved": "All Rights Reserved.",

    // ============= Hospital Division ==================
    "hospital.hero.title": "Afilas Hospital Division",
    "hospital.hero.subtitle":
      "State-of-the-art facilities and expert medical care across multiple specialties. Our hospital division provides comprehensive inpatient and outpatient services with compassionate, patient-centered care.",
    "hospital.hero.cta1": "Explore Departments",
    "hospital.hero.cta2": "Book Appointment",
    "hospital.hero.scroll": "Scroll to explore",
    "hospital.hero.social_proof": "Trusted by 5,000+ patients annually",
    "hospital.hero.roller_1": "Compassionate Care",
    "hospital.hero.roller_2": "Expert Specialists",
    "hospital.hero.roller_3": "24/7 Emergency",
    "hospital.hero.roller_4": "Your Health, Our Priority",

    "hospital.services.title": "Our Medical Services",
    "hospital.services.subtitle":
      "Comprehensive care tailored to your health needs",
    "hospital.services.per_visit": "per visit",
    "hospital.services.book": "Book Now",

    // ============= Diagnostics Division ==================
    "diagnostics.hero.title": "Afilas Diagnostics Center",
    "diagnostics.hero.subtitle":
      "High-precision imaging and fully automated laboratory testing. Our diagnostics center delivers accurate, timely results to empower clinicians and patients with actionable health insights.",
    "diagnostics.hero.cta1": "View Services",
    "diagnostics.hero.cta2": "Book a Test",
    "diagnostics.hero.scroll": "Scroll to explore",
    "diagnostics.hero.social_proof": "Over 10,000 tests processed monthly",

    // ============= Pharma Division ==================
    "pharma.hero.title": "Afilas Drug Manufacturing",
    "pharma.hero.subtitle":
      "Quality-driven, accessible pharmaceutical production meeting international standards. Strengthening healthcare resilience by producing safe, effective, and affordable essential medicines locally.",
    "pharma.hero.cta1": "View Products",
    "pharma.hero.cta2": "B2B Inquiries",
    "pharma.hero.scroll": "Scroll to explore",
    "pharma.hero.social_proof": "ISO/GMP Certified Manufacturing",

    // -- Pharma: Why Choose Afilas Group? --
    "pharma.why.badge": "Value Proposition",
    "pharma.why.title": "Why Choose Afilas Group?",
    "pharma.why.subtitle": "From manufacturing to patient care — discover what makes Afilas Drug Manufacturing a trusted partner for hospitals, distributors, and pharmacies across the region.",
    "pharma.why.cta": "Request a B2B Quote",
    "pharma.why.card1_title": "End-to-End Healthcare",
    "pharma.why.card1_desc": "Seamless integration from manufacturing post-treatment pharmaceuticals down to patient care, managing the entire care journey under one umbrella.",
    "pharma.why.card1_h1": "From raw material sourcing to finished dosage forms",
    "pharma.why.card1_h2": "Integrated hospital & pharmacy distribution pipeline",
    "pharma.why.card1_h3": "Post-treatment pharmaceutical follow-up support",
    "pharma.why.card2_title": "Cutting-Edge Technology",
    "pharma.why.card2_desc": "Equipped with automated pharmaceutical machinery and modern formulation facilities to ensure consistent, high-quality production output.",
    "pharma.why.card2_h1": "Fully automated tablet & capsule production lines",
    "pharma.why.card2_h2": "Modern formulation & quality testing laboratories",
    "pharma.why.card2_h3": "Real-time batch tracking & production monitoring",
    "pharma.why.card3_title": "Uncompromising Quality & Safety",
    "pharma.why.card3_desc": "Full compliance with Good Manufacturing Practice (GMP), ISO standards, and strict quality control protocols at every stage of production.",
    "pharma.why.card3_h1": "GMP-certified manufacturing environment",
    "pharma.why.card3_h2": "ISO 9001 quality management system",
    "pharma.why.card3_h3": "Multi-stage quality control & assurance testing",

    // -- Pharma: B2B Inquiry Section --
    "pharma.b2b.badge": "B2B Commercial",
    "pharma.b2b.title": "Partner With Afilas Pharma",
    "pharma.b2b.subtitle": "Whether you're a hospital network, pharmacy chain, or pharmaceutical distributor — get tailored pricing, bulk order quotes, and contract manufacturing proposals.",
    "pharma.b2b.phone_label": "B2B Commercial Hotline",
    "pharma.b2b.email_label": "Commercial Email",
    "pharma.b2b.location_label": "Manufacturing Facility",
    "pharma.b2b.location_value": "Afilas Drug Manufacturing, Amhara Region, Ethiopia",
    "pharma.b2b.hours_label": "Business Hours",
    "pharma.b2b.hours_value": "Mon – Sat, 8:00 AM – 6:00 PM (EAT)",
    "pharma.b2b.stat1": "Partner Institutions",
    "pharma.b2b.stat2": "Response Time",
    "pharma.b2b.form_title": "Request a Quote",
    "pharma.b2b.form_subtitle": "Fill in your details and our B2B team will respond within 24 hours.",
    "pharma.b2b.field_company": "Company / Institution Name",
    "pharma.b2b.field_company_ph": "e.g., National Hospital Network",
    "pharma.b2b.field_contact": "Contact Person",
    "pharma.b2b.field_contact_ph": "Full name",
    "pharma.b2b.field_email": "Business Email",
    "pharma.b2b.field_email_ph": "you@company.com",
    "pharma.b2b.field_phone": "Phone Number",
    "pharma.b2b.field_phone_ph": "+251 ...",
    "pharma.b2b.field_company_type": "Organization Type",
    "pharma.b2b.select_placeholder": "Select an option",
    "pharma.b2b.type_hospital": "Hospital / Health Center",
    "pharma.b2b.type_pharmacy": "Pharmacy / Drug Store",
    "pharma.b2b.type_distributor": "Distributor / Wholesaler",
    "pharma.b2b.type_clinic": "Clinic / Medical Center",
    "pharma.b2b.type_government": "Government / Public Institution",
    "pharma.b2b.type_other": "Other",
    "pharma.b2b.field_inquiry_type": "Inquiry Type",
    "pharma.b2b.inquiry_bulk": "Bulk Order",
    "pharma.b2b.inquiry_contract": "Contract Manufacturing",
    "pharma.b2b.inquiry_distribution": "Distribution Partnership",
    "pharma.b2b.inquiry_custom": "Custom Formulation",
    "pharma.b2b.field_product": "Product(s) of Interest",
    "pharma.b2b.field_product_ph": "e.g., Amoxicillin, Paracetamol",
    "pharma.b2b.field_volume": "Estimated Volume",
    "pharma.b2b.field_volume_ph": "e.g., 10,000 units/month",
    "pharma.b2b.field_message": "Additional Details",
    "pharma.b2b.field_message_ph": "Tell us more about your requirements, timeline, or special needs...",
    "pharma.b2b.submit": "Submit Inquiry",
    "pharma.b2b.submitting": "Submitting...",
    "pharma.b2b.success_title": "Inquiry Received!",
    "pharma.b2b.success_desc": "Thank you for your interest. Our B2B commercial team will contact you within 24 business hours.",
    "pharma.b2b.disclaimer": "By submitting this form you agree to be contacted by the Afilas B2B commercial team regarding your inquiry.",

    // -- Pharma: Product Catalog --
    "pharma.catalog.badge": "Our Products",
    "pharma.catalog.title": "Pharmaceutical Products",
    "pharma.catalog.subtitle": "Quality-assured medicines manufactured locally under GMP standards — available for institutional and retail distribution.",
    "pharma.catalog.price": "Price",
    "pharma.catalog.active": "Active",
    "pharma.catalog.days": "days",

    // ============= Blog Page ==================
    "blog.title": "Health & Medical Insights",
    "blog.subtitle":
      "Stay informed with the latest medical research, clinical breakthroughs, and healthcare updates from Afilas Group.",
    "blog.search_placeholder": "Search articles, research, tags...",
    "blog.filter_all": "All Articles",
    "blog.filter_categories": "Categories",
    "blog.filter_locations": "Divisions",
    "blog.read_more": "Read Article",
    "blog.watch_video": "Watch Video",
    "blog.published_on": "Published on",
    "blog.by_author": "By",
    "blog.views": "views",
    "blog.likes": "likes",
    "blog.comments": "comments",
    "blog.tags": "Tags",
    "blog.video_available": "Video Included",
    "blog.no_blogs_found": "No articles found matching your criteria.",
    "blog.clear_filters": "Clear Filters",
    "blog.leave_comment": "Leave a Comment",
    "blog.comment_placeholder": "Write your thought or question...",
    "blog.submit_comment": "Post Comment",
    "blog.back_to_blogs": "Back to Articles",
    "blog.featured": "Featured Article",

    // ============= About Us Page ==================
    "about.page_title": "About Afilas Hospital",
    "about.toc_title": "On This Page",
    "about.what_is_afilas": "What is Afilas",
    "about.what_is_afilas_p1": "Afilas Pharmaceuticals Manufacturing and Medical Services S.C. was established in June 2017 by a group of committed, visionary, team-oriented, and considerate health science and related scholars who have lived the experiences of the community that we stand to serve. Because of the above-mentioned motive, the word \"AFILAS\" was selected from the Saban language, which means \"the voice of scholars is heard.\" (In Amharic, \"የእውቀት ድምጽ ተሰማ ወይም የአዋቂዎች ድምጽ ተሰማ\" ማለት ነው።) We strongly believe that professional experts should address every professional practice.",
    "about.what_is_afilas_p2": "The first business firm of Afilas, which opened in January 2018, was Afilas Health Center, which grew into Afilas General Hospital (AGH). The hospital is now one of the best healthcare destinations in the Amhara National Regional State (ANRS).",
    "about.what_is_afilas_p3": "In 2022, we opened our second business firm, Afilas Pharmaceuticals Wholesale (APW) and we have opened Afilas diagnostics center in 2026.",
    "about.vision_title": "Vision",
    "about.vision_text": "Aspiring to provide the perfect patient experience through innovative and compassionate care in the region by 2030.",
    "about.mission_title": "Mission",
    "about.mission_1": "To provide cost effective, compassionate, respectful, and high quality healthcare to the community.",
    "about.mission_2": "To offer highly equitable corporate social responsibility.",
    "about.mission_3": "To enhance the culture of Employee engagement.",
    "about.mission_4": "To promote Customer satisfaction, health and wellness.",
    "about.core_values_title": "Statement of Core Values",
    "about.core_value_1_title": "Compassion",
    "about.core_value_1_desc": "We treat every patient with kindness, empathy, and genuine care.",
    "about.core_value_2_title": "Excellence",
    "about.core_value_2_desc": "We pursue the highest standards of medical practice and service delivery.",
    "about.core_value_3_title": "Integrity",
    "about.core_value_3_desc": "We uphold honesty, transparency, and ethical conduct in all operations.",
    "about.core_value_4_title": "Innovation",
    "about.core_value_4_desc": "We embrace modern medical technologies and continuously improve our processes.",
    "about.core_value_5_title": "Teamwork",
    "about.core_value_5_desc": "We work collaboratively to deliver comprehensive, patient-centered care.",
    "about.core_value_6_title": "Accountability",
    "about.core_value_6_desc": "We take responsibility for our actions and strive for measurable results.",
    "about.board_title": "Afilas PMMS S.C. Board of Directors",
    "about.inspectors_title": "Inspectors / Internal Auditors",
    "about.ceo_title": "Afilas PMMS S.C. Chief Executive Officer (CEO)",
    "about.directors_title": "Directors",
    "about.established": "Established",
    "about.established_year": "June 2017",
    "about.meaning": "Name Meaning",
    "about.meaning_text": "The voice of scholars is heard",
  },
  am: {
    "nav.home": "መነሻ",
    "nav.hospital": "ሆስፒታል",
    "nav.diagnostics": "ምርመራ",
    "nav.pharma": "ፋርማሲ",
    "nav.about": "ስለ ኛ",
    "nav.contact": "ዋስትና",
    "nav.group": "የአፊላስ ቡድን",

    "nav.group_dropdown_title": "የአፊላስ የጤና እንክብካቤ ንግድ ምሰሶዎች",
    "nav.division.hospital_desc": "ርህሩህ፣ ልዩ የታካሚ እንክብካቤ በ24 ሰዓት ይገኛል።",
    "nav.division.diagnostics_desc":
      "ከፍተኛ ትክክለኛነት ያለው ምስል እና አውቶማቲክ የላብራቶሪ ምርመራ።",
    "nav.division.pharma_desc":
      "በጥራት የሚመራ፣ ተደራሽ የሆነ የመድኃኒት ምርት አለም አቀፍ ደረጃዎችን የሚያሟላ።",

    "nav.service": "አገልግሎቶች", // Services
    "nav.blog": "ብሎግ", // Blog
    "nav.about_us": "ስለ እኛ",
    "nav.contact_emergency": "ግንኙነት & ድንገተኛ",
    "nav.select_division": "ክፍል ይምረጡ",
    "nav.division.group": "የአፊላስ ቡድን",
    "nav.division.hospital": "አፊላስ ጠቅላላ ሆስፒታል",
    "nav.division.diagnostics": "አፊላስ የምርመራ ማዕከል",
    "nav.division.pharma": "አፊላስ መድሃኒት ማምረቻ",
    "topbar.emergency_available": "የድንገተኛ እንክብካቤ 24/7 ይገኛል",
    "topbar.call": "ይደውሉ:",
    "cta.emergency_call": "የድንገተኛ ጥሪ",
    "cta.book_appointment": "ቀጠሮ ይያዙ",
    "cta.get_lab_results": "የላብ ውጤት ይውሰዱ",

    "hero.headline": "አጠቃላይ የጤና አገልግሎቶች በአንድ ጥላ ስር",
    "hero.subheadline":
      "ከፍተኛ ደረጃ ካለው የህክምና አገልግሎት እና ትክክለኛ የምርመራ አቅም አንስቶ እስከ አካባቢያዊ የመድኃኒት ምርት ድረስ፣ አፊላስ (Afilas) በክልሉ የጤና አጠባበቅ ደረጃዎችን ከፍ ለማድረግ ቁርጠኛ ነው",
    "hero.cta_doctor": "ሐኪም ያግኙ",
    "hero.cta_diagnostic": "የላብራቶሪ ምርመራ ያስይዙ",
    "hero.cta_pharma": "የመድኃኒት ዘርፉን ያስሱ",
    "hero.badge_emergency": "የ24 ሰዓት አስቸኳይ የድንገተኛ ህክምና",
    "hero.badge_iso": "የጥራት ደረጃውን የጠበቀ (ISO/GMP Compliant)",
    "hero.badge_lab": "ዘመናዊ አውቶማቲክ ላብራቶሪ",

    "pillars.title": "በጤናው ዘርፍ የተዋሃደ የብቃት ደረጃ",
    "pillars.subtitle":
      "ሁሌ አስተማማኝ እንክብካቤ እና አስተማማኝ የመድኃኒት መፍትሄዎችን ለመስጠት ሶስቱ የተሰጡን ዘርፎች እንዴት አብረው እንደሚሰሩ ይወቁ።",
    "pillars.hospital_tagline": "ርህራሄ የተሞላበት፣ ልዩ ባለሙያተኛ የታካሚ እንክብካቤ 24/7 ይገኛል።",
    "pillars.hospital_desc":
      "ከፍተኛ የህክምና ቴክኖሎጂ እና ብቁ ባለሙያዎች ጋር በታካሚ ዙሪያ ያተኮረ እንክብካቤ መስጠት።",
    "pillars.hospital_highlights_1": "የውስጥ እና የውጭ ህሙማን እንክብካቤ",
    "pillars.hospital_highlights_2": "24/7 የድንገተኛ እና የቀዶ ጥገና ክፍሎች",
    "pillars.hospital_highlights_3": "የእናት እና ህጻናት ጤና አጠባበቅ",
    "pillars.hospital_cta": "የሆስፒታል አገልግሎቶችን ያስሱ",
    "pillars.diagnostics_tagline":
      "ከፍተኛ ትክክለኛነት ያላቸው ምስሎች እና አውቶማቲክ የላብራቶሪ ምርመራዎች።",
    "pillars.diagnostics_desc":
      "ቀደም ብሎ ማወቅ እና የታለሙ ሕክምናዎችን ለማረጋገጥ ክሊኒኮችን እና ታካሚዎችን በትክክለኛ እና ወቅታዊ የምርመራ ግንዛቤዎች ማስታጠቅ።",
    "pillars.diagnostics_highlights_1": "የላቁ ምስሎች (ሲቲ ስካን፣ ኤምአርአይ፣ ዲጂታል ኤክስሬይ)",
    "pillars.diagnostics_highlights_2": "አውቶማቲክ ፓቶሎጂ እና ሄማቶሎጂ",
    "pillars.diagnostics_highlights_3": "ሞለኪውላር ምርመራዎች እና ልዩ የላብራቶሪ ምርመራዎች",
    "pillars.diagnostics_cta": "ምርመራ ያስይዙ / አገልግሎቶችን ይመልከቱ",
    "pillars.pharma_tagline":
      "ጥራትን ያማከለ፣ ተደራሽ የሆነ ዓለም አቀፍ ደረጃዎችን የሚያሟላ የመድኃኒት ማምረቻ።",
    "pillars.pharma_desc":
      "ደህንነታቸው የተጠበቀ፣ ውጤታማ እና ተመጣጣኝ አስፈላጊ መድኃኒቶችን በአገር ውስጥ በማምረት የጤና እንክብካቤ ጥንካሬን ማጠናከር።",
    "pillars.pharma_highlights_1": "ከፍተኛ ደረጃ ያላቸው ቅመሞች እና ማሸጊያዎች",
    "pillars.pharma_highlights_2": "ጥብቅ የጥራት ቁጥጥር እና የጂኤምፒ (GMP) ማክበር",
    "pillars.pharma_highlights_3": "ቢቱቢ (B2B) እና ተቋማዊ የጅምላ ስርጭት",
    "pillars.pharma_cta": "ምርቶችን እና አቅሞችን ይመልከቱ",

    "values.headline": "ለምን አፊላስን በጤናዎ ይተማመናሉ?",
    "values.feature_1_title": "ከመጀመሪያ እስከ መጨረሻ የጤና እንክብካቤ",
    "values.feature_1_desc":
      "ከምርመራ እና ከሆስፒታል ክሊኒካል እንክብካቤ እስከ ህክምና በኋላ መድኃኒቶች ድረስ፣ ሙሉውን የእንክብካቤ ጉዞ ያለምንም እንቅፋት እናስተዳድራለን።",
    "values.feature_2_title": "ዘመናዊ ቴክኖሎጂ",
    "values.feature_2_desc":
      "በዘመናዊ የምርመራ መሳሪያዎች፣ ዘመናዊ የቀዶ ጥገና ክፍሎች እና አውቶማቲክ የመድኃኒት ማሽኖች የታጠቀ።",
    "values.feature_3_title": "የማያሻማ ጥራት እና ደህንነት",
    "values.feature_3_desc":
      "በአለም አቀፍ ክሊኒካል ደረጃዎች፣ ጥብቅ የኢንፌክሽን ቁጥጥር እና ጥሩ የማምረቻ ልምድ (GMP) ተገዢነት የሚመራ።",

    "doctors.headline": "ሐኪም ያግኙ እና ጉብኝትዎን ይያዙ",
    "doctors.subtitle": "በዋና ዋና የሕክምና ዘርፎች ውስጥ ልምድ ካላቸው ስፔሻሊስቶች ጋር ይገናኙ።",
    "doctors.filter_specialty": "ስፔሻሊቲ ይምረጡ",
    "doctors.filter_availability": "ተገኝነት ይምረጡ",
    "doctors.filter_search": "ሐኪም በስም ይፈልጉ...",
    "doctors.view_all": "ሁሉንም ስፔሻሊስቶች ይመልከቱ እና ቀጠሮ ይያዙ",
    "doctors.book": "ቀጠሮ ይያዙ",

    "footer.tagline": "በእንክብካቤ፣ ትክክለኛነት እና ምርት ጤናን ማሳደግ።",
    "footer.address": "አድራሻ፡ [Insert Facility Address]",
    "footer.phone": "ስልክ፡ [Insert Main Desk Number]",
    "footer.email": "ኢሜይል፡ [Insert Info Email]",
    "footer.quick_links": "ፈጣን አገናኞች",
    "footer.hospital_departments": "የሆስፒታል ክፍሎች",
    "footer.diagnostic_packages": "የምርመራ ፓኬጆች",
    "footer.pharma_catalog": "የመድኃኒት ካታሎግ",
    "footer.careers_news": "ስራዎች እና ዜናዎች",
    "footer.emergency_support": "ድንገተኛ እና ድጋፍ",
    "footer.emergency_hotline": "የድንገተኛ ጊዜ መስመር፡ [Insert Phone]",
    "footer.lab_results": "የላብራቶሪ ውጤት መግቢያ",
    "footer.lab_results_link": "ግባ / አገናኝ ይድረሱ",
    "footer.pharma_inquiries": "የመድኃኒት ንግድ ጥያቄዎች",
    "footer.pharma_inquiries_contact": "[የB2B ቡድን ያግኙ]",
    "footer.rights_reserved": "ሁሉም መብቶች የተጠበቁ ናቸው።",

    // ============= Hospital Divission ==================
    "hospital.hero.title": "አፊላስ ሆስፒታል ክፍል",
    "hospital.hero.subtitle":
      "ዘመናዊ መገልገያዎች እና በተለያዩ የህክምና ዘርፎች ልምድ ያላቸው ባለሙያዎች። የሆስፒታል ክፍላችን ርህራሄ የተሞላበት እና በታካሚ ዙሪያ ያተኮረ እንክብካቤ የሚሰጥ አጠቃላይ የሆስፒታል እና የውጭ ህሙማን አገልግሎቶችን ይሰጣል።",
    "hospital.hero.cta1": "ክፍሎችን ያስሱ",
    "hospital.hero.cta2": "ቀጠሮ ይያዙ",
    "hospital.hero.scroll": "ለማሰስ ይሸብልሉ",
    "hospital.hero.social_proof": "በየዓመቱ ከ5,000+ ታካሚዎች ታማኝነት",
    "hospital.hero.roller_1": "ርህሩህ እንክብካቤ",
    "hospital.hero.roller_2": "ባለሙያ ስፔሻሊስቶች",
    "hospital.hero.roller_3": "24/7 ድንገተኛ",
    "hospital.hero.roller_4": "ጤናዎ፣ ቅድሚያችን",

    "hospital.services.title": "የእኛ የህክምና አገልግሎቶች",
    "hospital.services.subtitle": "ለጤናዎ የተዘጋጀ አጠቃላይ እንክብካቤ",
    "hospital.services.per_visit": "በእያንዳንዱ ጉብኝት",
    "hospital.services.book": "ቀጠሮ ይያዙ",

    // ============= Diagnostics Division ==================
    "diagnostics.hero.title": "አፊላስ ምርመራ ማዕከል",
    "diagnostics.hero.subtitle":
      "ከፍተኛ ትክክለኛነት ያለው ምስል እና ሙሉ በሙሉ አውቶማቲክ የላብራቶሪ ምርመራ። የእኛ ምርመራ ማዕከል ክሊኒኮችን እና ታካሚዎችን ትክክለኛ እና ወቅታዊ ውጤቶች ያቀርባል።",
    "diagnostics.hero.cta1": "አገልግሎቶችን ይመልከቱ",
    "diagnostics.hero.cta2": "ምርመራ ያስይዙ",
    "diagnostics.hero.scroll": "ለማሰስ ይሸብልሉ",
    "diagnostics.hero.social_proof": "በየወሩ ከ10,000 በላይ ምርመራዎች ይከናወናሉ",

    // ============= Pharma Division ==================
    "pharma.hero.title": "አፊላስ መድሃኒት ማምረቻ",
    "pharma.hero.subtitle":
      "ጥራትን ያማከለ፣ ተደራሽ የሆነ ዓለም አቀፍ ደረጃዎችን የሚያሟላ የመድኃኒት ማምረቻ። ደህንነታቸው የተጠበቀ፣ ውጤታማ እና ተመጣጣኝ አስፈላጊ መድኃኒቶችን በአገር ውስጥ በማምረት የጤና ጥንካሬን ማጠናከር።",
    "pharma.hero.cta1": "ምርቶችን ይመልከቱ",
    "pharma.hero.cta2": "B2B ጥያቄዎች",
    "pharma.hero.scroll": "ለማሰስ ይሸብልሉ",
    "pharma.hero.social_proof": "ISO/GMP የተረጋገጠ ማምረቻ",

    // -- Pharma: ለምን አፊላስ ቡድንን ይምረጡ? --
    "pharma.why.badge": "የእሴት ሀሳብ",
    "pharma.why.title": "ለምን የአፊላስ ቡድንን ይመርጣሉ?",
    "pharma.why.subtitle": "ከማምረት እስከ ታካሚ እንክብካቤ — አፊላስ መድሃኒት ማምረቻ ለሆስፒታሎች፣ ለአከፋፋዮች እና ለፋርማሲዎች ታማኝ አጋር ያደርገዋል።",
    "pharma.why.cta": "B2B ዋጋ ጠይቅ",
    "pharma.why.card1_title": "ከጅምር እስከ ፍጻሜ የጤና እንክብካቤ",
    "pharma.why.card1_desc": "ከህክምና በኋላ መድሃኒቶችን ከማምረት እስከ ታካሚ እንክብካቤ ድረስ ያለምንም እንቅፋት ውህደት።",
    "pharma.why.card1_h1": "ከጥሬ ዕቃ አቅርቦት እስከ ዝግጁ የመድሃኒት ቅርጾች",
    "pharma.why.card1_h2": "የተቀናጀ ሆስፒታል እና ፋርማሲ ስርጭት",
    "pharma.why.card1_h3": "ከህክምና በኋላ የመድሃኒት ክትትል ድጋፍ",
    "pharma.why.card2_title": "ዘመናዊ ቴክኖሎጂ",
    "pharma.why.card2_desc": "ወጥ የሆነ ከፍተኛ ጥራት ያለው ምርት ለማረጋገጥ በአውቶማቲክ የመድሃኒት ማሽነሪ እና ዘመናዊ የቅንብር ተቋማት የተዘጋጀ።",
    "pharma.why.card2_h1": "ሙሉ በሙሉ አውቶማቲክ ታብሌት እና ካፕሱል ምርት",
    "pharma.why.card2_h2": "ዘመናዊ ቅንብር እና የጥራት ሙከራ ላብራቶሪዎች",
    "pharma.why.card2_h3": "በእውነተኛ ጊዜ የባች ክትትል እና የምርት ቁጥጥር",
    "pharma.why.card3_title": "የማያሻማ ጥራት እና ደህንነት",
    "pharma.why.card3_desc": "በጥሩ የማምረቻ ልምምድ (GMP)፣ ISO ደረጃዎች እና ጥብቅ የጥራት ቁጥጥር ፕሮቶኮሎች ሙሉ ተገዢነት።",
    "pharma.why.card3_h1": "GMP-የተረጋገጠ የማምረቻ አካባቢ",
    "pharma.why.card3_h2": "ISO 9001 የጥራት አስተዳደር ስርዓት",
    "pharma.why.card3_h3": "ባለብዙ-ደረጃ የጥራት ቁጥጥር እና ማረጋገጫ ሙከራ",

    // -- Pharma: B2B ጥያቄ --
    "pharma.b2b.badge": "B2B ንግድ",
    "pharma.b2b.title": "ከአፊላስ ፋርማ ጋር ይተባበሩ",
    "pharma.b2b.subtitle": "ሆስፒታል አውታረመረብ፣ ፋርማሲ ሰንሰለት ወይም የመድሃኒት አከፋፋይ ከሆኑ — ብጁ ዋጋ፣ የጅምላ ትዕዛዝ ጥቅሶች እና የኮንትራት ማምረቻ ሃሳቦችን ያግኙ።",
    "pharma.b2b.phone_label": "B2B የንግድ ስልክ",
    "pharma.b2b.email_label": "የንግድ ኢሜይል",
    "pharma.b2b.location_label": "የማምረቻ ተቋም",
    "pharma.b2b.location_value": "አፊላስ መድሃኒት ማምረቻ፣ አማራ ክልል፣ ኢትዮጵያ",
    "pharma.b2b.hours_label": "የስራ ሰዓት",
    "pharma.b2b.hours_value": "ሰኞ – ቅዳሜ፣ 8:00 ጥዋት – 6:00 ምሽት (EAT)",
    "pharma.b2b.stat1": "አጋር ተቋማት",
    "pharma.b2b.stat2": "የምላሽ ጊዜ",
    "pharma.b2b.form_title": "ዋጋ ጠይቅ",
    "pharma.b2b.form_subtitle": "ዝርዝሮችዎን ይሙሉ እና የB2B ቡድናችን በ24 ሰዓት ውስጥ ምላሽ ይሰጣል።",
    "pharma.b2b.field_company": "የድርጅት / ተቋም ስም",
    "pharma.b2b.field_company_ph": "ለምሳሌ፣ ብሔራዊ ሆስፒታል አውታረመረብ",
    "pharma.b2b.field_contact": "ተገናኝ ሰው",
    "pharma.b2b.field_contact_ph": "ሙሉ ስም",
    "pharma.b2b.field_email": "የንግድ ኢሜይል",
    "pharma.b2b.field_email_ph": "you@company.com",
    "pharma.b2b.field_phone": "ስልክ ቁጥር",
    "pharma.b2b.field_phone_ph": "+251 ...",
    "pharma.b2b.field_company_type": "የድርጅት ዓይነት",
    "pharma.b2b.select_placeholder": "አማራጭ ይምረጡ",
    "pharma.b2b.type_hospital": "ሆስፒታል / ጤና ጣቢያ",
    "pharma.b2b.type_pharmacy": "ፋርማሲ / መድሃኒት ቤት",
    "pharma.b2b.type_distributor": "አከፋፋይ / ጅምላ ነጋዴ",
    "pharma.b2b.type_clinic": "ክሊኒክ / ህክምና ማዕከል",
    "pharma.b2b.type_government": "መንግስት / የህዝብ ተቋም",
    "pharma.b2b.type_other": "ሌላ",
    "pharma.b2b.field_inquiry_type": "የጥያቄ ዓይነት",
    "pharma.b2b.inquiry_bulk": "የጅምላ ትዕዛዝ",
    "pharma.b2b.inquiry_contract": "የኮንትራት ማምረቻ",
    "pharma.b2b.inquiry_distribution": "የስርጭት ሽርክና",
    "pharma.b2b.inquiry_custom": "ብጁ ቅንብር",
    "pharma.b2b.field_product": "የሚፈለግ ምርት(ቶች)",
    "pharma.b2b.field_product_ph": "ለምሳሌ፣ Amoxicillin፣ Paracetamol",
    "pharma.b2b.field_volume": "የሚገመት መጠን",
    "pharma.b2b.field_volume_ph": "ለምሳሌ፣ 10,000 ዩኒት/ወር",
    "pharma.b2b.field_message": "ተጨማሪ ዝርዝሮች",
    "pharma.b2b.field_message_ph": "ስለ መስፈርቶችዎ፣ ጊዜ ሰሌዳ ወይም ልዩ ፍላጎቶች ይበልጥ ይንገሩን...",
    "pharma.b2b.submit": "ጥያቄ ያስገቡ",
    "pharma.b2b.submitting": "በማስገባት ላይ...",
    "pharma.b2b.success_title": "ጥያቄው ደርሷል!",
    "pharma.b2b.success_desc": "ለፍላጎትዎ እናመሰግናለን። የB2B ቡድናችን በ24 የስራ ሰዓት ውስጥ ያገኙዎታል።",
    "pharma.b2b.disclaimer": "ይህን ቅጽ በማስገባት ስለ ጥያቄዎ በአፊላስ B2B የንግድ ቡድን ሊገናኙ ይስማማሉ።",

    // -- Pharma: የምርት ካታሎግ --
    "pharma.catalog.badge": "ምርቶቻችን",
    "pharma.catalog.title": "የመድሃኒት ምርቶች",
    "pharma.catalog.subtitle": "በGMP ደረጃዎች ስር በአገር ውስጥ የሚመረቱ ጥራታቸው የተረጋገጠ መድሃኒቶች — ለተቋማዊ እና ችርቻሮ ስርጭት ይገኛሉ።",
    "pharma.catalog.price": "ዋጋ",
    "pharma.catalog.active": "ንቁ",
    "pharma.catalog.days": "ቀናት",

    // ============= Blog Page ==================
    "blog.title": "የጤና እና ህክምና ግንዛቤዎች",
    "blog.subtitle":
      "ከአፊላስ ቡድን የቅርብ ጊዜ የህክምና ምርምር፣ ክሊኒካዊ ግኝቶች እና የጤና ወቅታዊ መረጃዎችን ይከታተሉ።",
    "blog.search_placeholder": "ጽሑፎችን፣ ምርምሮችን፣ ታጎችን ይፈልጉ...",
    "blog.filter_all": "ሁሉም ጽሑፎች",
    "blog.filter_categories": "ምድቦች",
    "blog.filter_locations": "ክፍሎች",
    "blog.read_more": "ጽሑፉን ያንብቡ",
    "blog.watch_video": "ቪዲዮ ይመልከቱ",
    "blog.published_on": "የታተመበት",
    "blog.by_author": "በ",
    "blog.views": "እይታዎች",
    "blog.likes": "ወደድኩት",
    "blog.comments": "አስተያየቶች",
    "blog.tags": "ታጎች",
    "blog.video_available": "ቪዲዮ አለው",
    "blog.no_blogs_found": "ከመስፈርትዎ ጋር የሚስማማ ምንም ጽሑፍ አልተገኘም።",
    "blog.clear_filters": "ማጣሪያዎችን አጽዳ",
    "blog.leave_comment": "አስተያየት ይተዉ",
    "blog.comment_placeholder": "ሀሳብዎን ወይም ጥያቄዎን ይፃፉ...",
    "blog.submit_comment": "አስተያየት ላክ",
    "blog.back_to_blogs": "ወደ ጽሑፎች ተመለስ",
    "blog.featured": "ልዩ ጽሑፍ",

    // ============= About Us Page ==================
    "about.page_title": "ስለ አፊላስ ሆስፒታል",
    "about.toc_title": "በዚህ ገጽ ላይ",
    "about.what_is_afilas": "አፊላስ ምንድን ነው",
    "about.what_is_afilas_p1": "አፊላስ ፋርማሲዩቲካልስ ማኑፋክቸሪንግ እና ሜዲካል ሰርቪስ ኤስ.ሲ. በሰኔ 2017 (እ.ኤ.አ.) የተመሰረተው ቁርጠኛ፣ ራዕይ ያላቸው፣ ቡድን ተኮር፣ እና አሳቢ የጤና ሳይንስ እና ተዛማጅ ምሁራን ነው ማህበረሰቡ የሚቀርበውን ልምድ የኖሩ ናቸው። ከላይ ከተጠቀሰው ዓላማ አንፃር \"አፊላስ\" የሚለው ቃል \"የእውቀት ድምጽ ተሰማ ወይም የአዋቂዎች ድምጽ ተሰማ\" ማለት ከሳባ ቋንቋ ተመርጧል። ባለሙያ ኤክስፐርቶች ሁሉንም ሙያዊ ተግባራት ማስተናገድ አለባቸው ብለን በጥብቅ እናምናለን።",
    "about.what_is_afilas_p2": "የመጀመሪያው የአፊላስ ንግድ ድርጅት በጥር 2018 (እ.ኤ.አ.) የተከፈተው የአፊላስ ጤና ጣቢያ ነው፣ ይህም ወደ አፊላስ ጠቅላላ ሆስፒታል (AGH) አድጓል። ሆስፒታሉ አሁን በአማራ ብሄራዊ ክልላዊ መንግስት (አብክመ) ውስጥ ከምርጥ የጤና እንክብካቤ መዳረሻዎች አንዱ ነው።",
    "about.what_is_afilas_p3": "በ2022 ሁለተኛውን የንግድ ድርጅታችንን አፊላስ ፋርማሲዩቲካልስ ጅምላ (APW) ከፍተናል እንዲሁም በ2026 የአፊላስ ምርመራ ማዕከል ከፍተናል።",
    "about.vision_title": "ራዕይ",
    "about.vision_text": "እስከ 2030 ድረስ በክልሉ ፈጠራ እና ርህራሄ ባለው እንክብካቤ ፍጹም የታካሚ ተሞክሮ ለመስጠት መጓጓት።",
    "about.mission_title": "ተልዕኮ",
    "about.mission_1": "ለማህበረሰቡ ወጪ ቆጣቢ፣ ርህሩህ፣ አክባሪ እና ከፍተኛ ጥራት ያለው የጤና እንክብካቤ መስጠት።",
    "about.mission_2": "ከፍተኛ ፍትሃዊ የድርጅት ማህበራዊ ኃላፊነት መስጠት።",
    "about.mission_3": "የሰራተኛ ተሳትፎ ባህልን ማጎልበት።",
    "about.mission_4": "የደንበኛ እርካታን፣ ጤናን እና ደህንነትን ማስተዋወቅ።",
    "about.core_values_title": "የዋና እሴቶች መግለጫ",
    "about.core_value_1_title": "ርህራሄ",
    "about.core_value_1_desc": "ሁሉንም ታካሚዎች በደግነት፣ በመተሳሰብ እና በእውነተኛ እንክብካቤ እናስተናግዳለን።",
    "about.core_value_2_title": "ብቃት",
    "about.core_value_2_desc": "ከፍተኛ ደረጃ ያላቸው የህክምና ልምዶች እና የአገልግሎት አሰጣጥ እናከተላለን።",
    "about.core_value_3_title": "ታማኝነት",
    "about.core_value_3_desc": "በሁሉም ተግባራት ውስጥ ታማኝነትን፣ ግልጽነትን እና ሥነ-ምግባራዊ ስነ-ምግባርን እናስጠብቃለን።",
    "about.core_value_4_title": "ፈጠራ",
    "about.core_value_4_desc": "ዘመናዊ የህክምና ቴክኖሎጂዎችን እንቀበላለን እና ሂደቶቻችንን ያለማቋረጥ እናሻሽላለን።",
    "about.core_value_5_title": "የቡድን ስራ",
    "about.core_value_5_desc": "አጠቃላይ፣ በታካሚ ዙሪያ ያተኮረ እንክብካቤ ለመስጠት በትብብር እንሰራለን።",
    "about.core_value_6_title": "ተጠያቂነት",
    "about.core_value_6_desc": "ለድርጊቶቻችን ኃላፊነት እንወስዳለን እና ለሚለካ ውጤት እንጥራለን።",
    "about.board_title": "የአፊላስ PMMS ኤስ.ሲ. የዳይሬክተሮች ቦርድ",
    "about.inspectors_title": "ኦዲተሮች / ውስጣዊ ኦዲተሮች",
    "about.ceo_title": "የአፊላስ PMMS ኤስ.ሲ. ዋና ሥራ አስፈጻሚ (CEO)",
    "about.directors_title": "ዳይሬክተሮች",
    "about.established": "የተመሰረተ",
    "about.established_year": "ሰኔ 2017",
    "about.meaning": "የስም ትርጉም",
    "about.meaning_text": "የእውቀት ድምጽ ተሰማ",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      "afilas-language",
    ) as Language | null;
    setLanguageState(savedLanguage || "en");
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("afilas-language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  // Return default values if context is not available (e.g., during initial render before provider wraps)
  if (context === undefined) {
    return {
      language: "en" as Language,
      setLanguage: () => {},
      t: (key: string) => key,
    };
  }

  return context;
}
