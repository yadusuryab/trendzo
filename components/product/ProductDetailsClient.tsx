"use client";

import React from "react";
import PriceFormat_Sale from "@/components/commerce-ui/price-format-sale";
import StarRating_Basic from "@/components/commerce-ui/star-rating-basic";
import { Button } from "@/components/ui/button";
import AddToCartButton from "../utils/add-to-cart";

// Size selector component
const SizeSelector = ({ sizes, selectedSize, onSizeSelect }: {
  sizes: string[];
  selectedSize: string | null;
  onSizeSelect: (size: string) => void;
}) => {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <label className="text-xs font-medium tracking-wider uppercase text-[#666666]">
          Size
        </label>
        <button className="text-xs text-[#666666] underline underline-offset-2 hover:text-[#111111] transition-colors">
          Size Guide
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeSelect(size)}
            className={`
              py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200
              ${selectedSize === size
                ? 'bg-[#111111] text-white'
                : 'bg-[#f1f1f1] text-[#111111] hover:bg-[#e8e8e8]'
              }
            `}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

// Color selector component
const ColorSelector = ({ colors, selectedColor, onColorSelect }: {
  colors: string[];
  selectedColor: string | null;
  onColorSelect: (color: string) => void;
}) => {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="mt-6">
      <label className="text-xs font-medium tracking-wider uppercase text-[#666666] mb-4 block">
        Color
      </label>
      <div className="flex gap-3">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            className={`
              w-10 h-10 rounded-full border-2 transition-all duration-200
              ${selectedColor === color
                ? 'border-[#111111] scale-110'
                : 'border-gray-300 hover:scale-105'
              }
            `}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};

// Main client component that wraps all interactive elements
const ProductDetailsClient = ({ product }: { product: any }) => {
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [openSection, setOpenSection] = React.useState('description');

  const availableSizes = product.sizes || ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const availableColors = product.colors || [];

  const handleAddToCart = () => {
    // Implement add to cart logic
    console.log('Adding to cart:', {
      product: product._id,
      size: selectedSize,
      color: selectedColor,
      quantity: 1
    });
  };

  const handleBuyNow = () => {
    // Implement buy now logic
    console.log('Buy now:', {
      product: product._id,
      size: selectedSize,
      color: selectedColor,
      quantity: 1
    });
  };

  const accordionSections = [
    {
      id: 'description',
      title: 'Description',
      content: product.description || "No description available.",
    },
    {
      id: 'details',
      title: 'Details',
      content: product.features?.length ? (
        <ul className="space-y-2">
          {product.features.map((feat: string, index: number) => (
            <li key={index} className="text-[#666666]">• {feat}</li>
          ))}
        </ul>
      ) : "No details available.",
    },
    {
      id: 'shipping',
      title: 'Shipping & Returns',
      content: "Free shipping on orders over ₹2999. Delivery within 3-5 business days. Easy 30-day return policy.",
    },
  ];

  return (
    <div className="lg:pl-8">
      {/* Product Title */}
      <h1 className="text-2xl md:text-3xl font-medium uppercase tracking-tight text-[#111111] mb-4">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-6">
        <StarRating_Basic 
          value={product.rating} 
          readOnly 
          iconSize={16}
        />
        <span className="text-sm text-[#666666]">
          ({product.reviewCount || 0} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="mb-8">
        {product.salesPrice ? (
          <PriceFormat_Sale
            originalPrice={product.price}
            salePrice={product.salesPrice}
            prefix="₹"
            showSavePercentage={true}
            classNameSalePrice="text-2xl font-medium text-[#111111]"
            classNameOriginalPrice="text-lg text-[#666666] line-through"
          />
        ) : (
          <div className="text-2xl font-medium text-[#111111]">
            ₹{product.price}
          </div>
        )}
      </div>

      {/* Size Selector */}
      {availableSizes.length > 0 && (
        <SizeSelector
          sizes={availableSizes}
          selectedSize={selectedSize}
          onSizeSelect={setSelectedSize}
        />
      )}

      {/* Color Selector */}
      <ColorSelector
        colors={availableColors}
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
      />

      {/* Action Buttons */}
      <div className="mt-8 space-y-4">
       <AddToCartButton product={product} showBuyNow/>
      
      </div>

      {/* Product Details Accordion */}
      <div className="mt-8 border-t border-[#e0e0e0]">
        {accordionSections.map((section) => (
          <div key={section.id} className="border-b border-[#e0e0e0]">
            <button
              onClick={() => setOpenSection(openSection === section.id ? '' : section.id)}
              className="w-full py-6 flex justify-between items-center text-left uppercase tracking-wider text-sm font-medium text-[#111111] hover:text-[#333333] transition-colors"
            >
              {section.title}
              <span className="text-lg">
                {openSection === section.id ? '−' : '+'}
              </span>
            </button>
            {openSection === section.id && (
              <div className="pb-6">
                <div className="text-[#666666] text-sm leading-relaxed">
                  {section.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-8 text-center">
        <p className="text-xs text-[#666666] uppercase tracking-wider">
          Free Shipping • 30-Day Returns • Secure Payment
        </p>
      </div>
    </div>
  );
};

export default ProductDetailsClient;