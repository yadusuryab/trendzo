// components/cards/category-card.tsx
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export type CategoryCardProps = {
  name: string
  image: string
  slug: string
  productCount?: number
}

function CategoryCard({ name, image, slug, productCount }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${slug}`} className="block group">
      <div className="bg-white h-[380px] shadow-sm overflow-hidden transition-all duration-500 hover:shadow-xl border border-gray-100 hover:border-gray-200 w-80  relative">
        
        {/* Large rectangular product image */}
        <div className="relative h-[380px] w-full overflow-hidden bg-gray-50">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=600&fit=crop'
            }}
          />
        </div>
        
        {/* Floating info box - bottom left aligned */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="backdrop-blur-3xl  p-4">
            <div className="flex items-center justify-between">
              {/* Text content */}
              <div className="flex-1">
                <h3 className="text-md uppercase text-white mb-2 tracking-tight font-sans">
                  {name}
                </h3>
                <Link 
                  href={`/category/${slug}`}
                  className="text-gray-200 hover:text-gray-900 text-sm font-medium underline underline-offset-4 transition-colors duration-300"
                >
                  Shop Now
                </Link>
              </div>
              
              {/* Arrow button */}
              <button className="ml-4 w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center transition-all duration-300 hover:bg-gray-800 hover:scale-105 group/btn">
                <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-0.5 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Subtle hover effects */}
        <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/10 pointer-events-none transition-all duration-500" />
        
      </div>
    </Link>
  )
}

export default CategoryCard