'use client'

import { useLanguage } from '@/contexts/LanguageProvider'
import { pharmacalProducts } from '@/lib/mockData'
import { ShoppingCart, Star } from 'lucide-react'

export function PharmaCatalog() {
  const { t } = useLanguage()

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Pharmaceutical Products
        </h2>
        <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
          Wide range of quality health supplements and medicines
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pharmacalProducts.map(product => (
          <div key={product.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group">
            {/* Product Image Placeholder */}
            <div className="w-full h-48 bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center">
              <div className="text-4xl"></div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
                  <p className="text-xs font-semibold text-accent mt-1">{product.category}</p>
                </div>
              </div>

              <p className="text-sm text-foreground/70 leading-relaxed">{product.description}</p>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < 4 ? 'fill-accent text-accent' : 'text-muted'}`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-foreground/70">Price</p>
                  <p className="text-2xl font-bold text-foreground">ETB {product.price}</p>
                </div>
                <button className="p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
