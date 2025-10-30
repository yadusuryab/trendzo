"use client";
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import PriceFormat_Sale from '../commerce-ui/price-format-sale'
import { Badge } from '../ui/badge'
import StarRating_Basic from '../commerce-ui/star-rating-basic'

type Props = {
  id: string
  name: string
  imageUrl: string
  price: number
  salesPrice: number
  isNew?: boolean
  isBestSeller?: boolean
  rating?: number
}

function ProductCard({ id, name, imageUrl, salesPrice, price, isNew = false, isBestSeller = false, rating = 0 }: Props) {
  return (
    <Link href={`/product/${id.toLowerCase()}`} passHref>
      <motion.div 
        className="group flex flex-col bg-[#f8f8f8] rounded-none"
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Product Image Container */}
        <div className="relative w-full aspect-[1/1.1] bg-white mb-1 overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Status Badges - Minimal */}
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1">
            {isNew && (
              <div className="font-sans uppercase tracking-widest text-xs text-gray-900 font-medium px-2 py-1 bg-white">
                New
              </div>
            )}
            {isBestSeller && (
              <div className="font-sans uppercase tracking-widest text-xs text-gray-900 font-medium px-2 py-1 bg-white">
                Best Seller
              </div>
            )}
          </div>

          {/* Quick View Overlay - Minimal */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="font-sans uppercase tracking-widest text-xs text-gray-900 font-medium bg-white px-4 py-2">
              Quick View
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-grow p-2">
          {/* Product Name */}
          <h3 className="font-sans uppercase tracking-wide text-xs text-gray-900 font-normal leading-tight mb-1">
            {name}
          </h3>

          {/* Star Rating */}
          {/* <div className="mb-2">
            <StarRating_Basic 
              value={rating} 
              readOnly 
              iconSize={10} 
              className="fill-gray-400"
            />
          </div> */}

          {/* Price */}
          <div className="flex items-center gap-2">
            {salesPrice < price ? (
              <>
                <span className="font-sans text-xs text-gray-900 font-medium">
                  ₹{salesPrice.toLocaleString()}
                </span>
                <span className="font-sans text-xs text-gray-400 line-through font-medium">
                  ₹{price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="font-sans text-xs text-muted-foreground font-">
                ₹{price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default ProductCard