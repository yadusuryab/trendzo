'use client'

import React, { useEffect, useState } from 'react'
import CategoryCard from '../cards/category-card'
import { Sparkles } from 'lucide-react'

export type Category = {
  name: string
  image: string
  slug: string
}

function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const cached = localStorage.getItem('categories_cache')
        const cacheTime = localStorage.getItem('categories_cache_time')
        const now = new Date().getTime()

        if (cached && cacheTime && now - parseInt(cacheTime) < 1000 * 60 * 10) {
          setCategories(JSON.parse(cached))
        } else {
          const res = await fetch('/api/categories')
          const data = await res.json()
          setCategories(data)

          localStorage.setItem('categories_cache', JSON.stringify(data))
          localStorage.setItem('categories_cache_time', now.toString())
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return (
      <section className="relative py-20 bg-gradient-to-b from-background to-background/80 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtMi4yIDAtNCAxLjgtNCA0czEuOCA0IDQgNCA0LTEuOCA0LTRjMC0yLjItMS44LTQtNC00eiIgZmlsbD0icmdiYSgyMTUsMTU2LDY1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-gold-500 animate-pulse" />
              <h2 className="text-4xl font-serif italic text-foreground/80 animate-pulse">
                 Collections
              </h2>
              <Sparkles className="w-6 h-6 text-gold-500 animate-pulse" />
            </div>
            <p className="text-lg text-foreground/60 font-light tracking-wide">
              Discovering luxury categories...
            </p>
          </div>

          <div className="flex justify-center gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-72 h-96 bg-gradient-to-br from-foreground/5 to-foreground/10 rounded-2xl animate-pulse border border-foreground/10"
              >
                <div className="w-full h-3/4 bg-foreground/10 rounded-t-2xl" />
                <div className="p-6">
                  <div className="h-4 bg-foreground/10 rounded mb-3 w-3/4" />
                  <div className="h-3 bg-foreground/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-2 bg-gradient-to-b from-background to-background/80 overflow-hidden">
      {/* Decorative background elements */}
      
      {/* Accent elements */}
   
      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-start gap-0 mb-2">
            <h2 className="text-4xl font-serif italic underline text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
           Explore collections.
            </h2>
          </div>
          <p className="text-sm  text-foreground/60 uppercase max-w-2xl leading-relaxed">
          Discover what’s trending right now.       </p>
        </div>

        {/* Peek Carousel Container */}
        <div className="relative">
          {/* Categories Container with Peek Effect */}
          <div className="flex overflow-x-auto gap-2 pb-8 scrollbar-hide scroll-smooth px-8 -mx-12">
            {categories.length !== 0 && categories?.map((cat, i) => (
              <div
                key={cat.slug}
                className="flex-shrink-0 transform transition-all duration-500 hover:scale-105 first:ml-1 last:mr-8"
                style={{ 
                  animationDelay: `${i * 150}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <CategoryCard {...cat} />
              </div>
            ))}
          </div>

          {/* Gradient Overlays for Peek Effect */}
        
          {/* Scroll Indicator */}
          <div className="flex justify-center items-center gap-2 mt-3">
            <div className="h-px w-12 bg-foreground/20" />
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-foreground/30" />
              <div className="w-1 h-1 rounded-full bg-foreground/30" />
              <div className="w-1 h-1 rounded-full bg-foreground/30" />
            </div>
            <div className="h-px w-12 bg-foreground/20" />
          </div>
        </div>

        {/* CTA Footer */}
        <div className="text-center mt-3">
          <p className="text-sm text-foreground/50 font-light tracking-widest uppercase mb-1">
            Exclusive Selection
          </p>
          <p className="text-2xl text-foreground/70 font-serif italic max-w-md mx-auto">
            Each piece tells a story of craftsmanship and elegance
          </p>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}

export default CategorySection