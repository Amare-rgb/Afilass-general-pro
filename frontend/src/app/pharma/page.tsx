'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PharmaCatalog } from '@/components/PharmaDivision/PharmaCatalog'
import { PharmaHero } from '@/components/PharmaDivision/PharmaHero'
import { PharmaWhyChoose } from '@/components/PharmaDivision/PharmaWhyChoose'
import { PharmaB2BInquiry } from '@/components/PharmaDivision/PharmaB2BInquiry'

export default function PharmaPage() {
  return (
    <>
      <Header />
      <main className="bg-background text-foreground min-h-screen">
        {/* Main container */}
        <div className="relative">
          {/* Slide 1: Hero */}
          <PharmaHero />
        </div>

        {/* Why Choose Afilas Group? */}
        <PharmaWhyChoose />

        {/* Products Catalog */}
        <PharmaCatalog />

        {/* B2B Inquiry & Dynamic Quote Request */}
        <PharmaB2BInquiry />
      </main>
      <Footer />
    </>
  )
}
