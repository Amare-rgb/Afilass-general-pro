'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PharmaCatalog } from '@/components/PharmaCatalog'
import { PharmaHero } from '@/components/PharmaHero'
import { ShoppingCart, Pill, Package, Truck, Phone } from 'lucide-react'

export default function PharmaPage() {
  const categories = [
    {
      name: 'Supplements',
      description: 'Essential vitamins and minerals',
      icon: Pill,
      count: 12,
    },
    {
      name: 'Pain Relief',
      description: 'Analgesics and anti-inflammatory',
      icon: Package,
      count: 8,
    },
    {
      name: 'Cold & Flu',
      description: 'Respiratory health products',
      icon: ShoppingCart,
      count: 15,
    },
    {
      name: 'Heart Health',
      description: 'Cardiovascular support',
      icon: Truck,
      count: 10,
    },
  ]

  return (
    <>
      <Header />
      <main>
        {/* Main container – sticky slide here */}
        <div className="relative">
          {/* Slide 1: Hero */}
          <PharmaHero />
        </div>

        {/* Product Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Product Categories</h2>
            <p className="text-lg text-foreground/70">
              Explore our wide range of pharmaceutical products
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, idx) => {
              const Icon = category.icon
              return (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer"
                >
                  <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{category.name}</h3>
                  <p className="text-foreground/70 text-sm mb-4">{category.description}</p>
                  <p className="text-sm font-semibold text-accent">{category.count} products</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Why Order From Us */}
        <section className="bg-card py-24 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Why Order From Us</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Experience quality, convenience, and care
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: 'Authentic Products', desc: '100% genuine pharmaceuticals' },
                { title: 'Expert Staff', desc: 'Trained pharmacists and advisors' },
                { title: 'Fast Delivery', desc: 'Home delivery within 24 hours' },
                { title: 'Affordable Prices', desc: 'Competitive pricing and discounts' },
              ].map((benefit, idx) => (
                <div key={idx} className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto">
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{benefit.title}</h3>
                  <p className="text-foreground/70 text-sm">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products */}
        <PharmaCatalog />

        {/* Ordering Info */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8">
              <Phone className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">Call Us</h3>
              <p className="text-foreground/70 text-sm mb-4">
                Order by phone for personalized assistance
              </p>
              <p className="font-semibold text-primary">+251 (0) 911 234 567</p>
            </div>

            <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-2xl p-8">
              <ShoppingCart className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">Online Order</h3>
              <p className="text-foreground/70 text-sm mb-4">
                Shop online and have products delivered to your home
              </p>
              <p className="font-semibold text-secondary">Easy checkout process</p>
            </div>

            <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-2xl p-8">
              <Truck className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">Fast Delivery</h3>
              <p className="text-foreground/70 text-sm mb-4">
                Free delivery for orders above ETB 500
              </p>
              <p className="font-semibold text-accent">Within 24 hours</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
