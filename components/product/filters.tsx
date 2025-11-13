// components/products/filters.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriceChips } from "../ui/price-slider";

interface FiltersProps {
  filters: any;
  availableFilters: any;
  categories: Array<{ _id: string; name: string; slug: string }>;
  onFilterChange: (key: string, value: any) => void;
  onArrayFilterChange: (type: string, value: string) => void;
  onPriceChange: (value: [number, number]) => void;
  onToggleFilter: (key: string) => void;
  onClearAll: () => void;
  getActiveFilterCount: () => number;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  availableFilters,
  categories,
  onFilterChange,
  onArrayFilterChange,
  onPriceChange,
  onToggleFilter,
  onClearAll,
  getActiveFilterCount,
  isMobile = false,
  onCloseMobile,
}) => {
  const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ 
    title, 
    children 
  }) => (
    <div className={isMobile ? "space-y-6" : "space-y-6"}>
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      {children}
    </div>
  );

  return (
    <motion.div
      initial={isMobile ? { opacity: 0, x: "100%" } : { opacity: 0, x: -20 }}
      animate={isMobile ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "bg-background rounded-xl border shadow-sm",
        isMobile 
          ? "fixed inset-0 z-50 p-6 overflow-y-auto" 
          : "p-6 sticky top-4 max-h-[calc(100vh-200px)] overflow-y-auto"
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className={cn("font-bold", isMobile ? "text-2xl" : "text-xl")}>
          Filters
        </h3>
        <div className="flex items-center gap-2">
          {getActiveFilterCount() > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Clear All
            </Button>
          )}
          {isMobile && onCloseMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCloseMobile}
            >
              ×
            </Button>
          )}
        </div>
      </div>

      <div className={cn("space-y-8", isMobile && "pb-8")}>
        {/* Quick Filters */}
        <FilterSection title="Quick Filters">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={filters.featured ? "default" : "outline"}
            
              onClick={() => onToggleFilter("featured")}
              className="justify-center"
            >
          
              Featured
            </Button>
            <Button
              variant={filters.onSale ? "default" : "outline"}
            
              onClick={() => onToggleFilter("onSale")}
              className="justify-center"
            >
             
              On Sale
            </Button>
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range">
          <PriceChips
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={onPriceChange}
            currency="₹"
          />
        </FilterSection>

        {/* Categories */}
        <FilterSection title="Categories">
          <Select
            value={filters.category || "all"}
            onValueChange={(value) => onFilterChange("category", value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterSection>

        {/* Brands */}
        {availableFilters.brands && availableFilters.brands.length > 0 && (
          <FilterSection title="Brands">
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {availableFilters.brands.map((brand: string) => (
                <div key={brand} className="flex items-center space-x-3">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brands?.includes(brand) || false}
                    onCheckedChange={() => onArrayFilterChange("brands", brand)}
                    className="h-4 w-4"
                  />
                  <Label 
                    htmlFor={`brand-${brand}`} 
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {brand}
                  </Label>
                  <Badge variant="secondary" className="text-xs">
                    {availableFilters.brandCounts?.[brand] || 0}
                  </Badge>
                </div>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Sizes */}
        {availableFilters.sizes.length > 0 && (
          <FilterSection title="Sizes">
            <div className="grid grid-cols-3 gap-2">
              {availableFilters.sizes.map((size: string) => (
                <Button
                  key={size}
                  variant={filters.sizes.includes(size) ? "default" : "outline"}
                  size="sm"
                  onClick={() => onArrayFilterChange("sizes", size)}
                  className="text-xs"
                >
                  {size}
                </Button>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Colors */}
        {availableFilters.colors.length > 0 && (
          <FilterSection title="Colors">
            <div className="flex flex-wrap gap-2">
              {availableFilters.colors.map((color: string) => (
                <div
                  key={color}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full border cursor-pointer transition-colors text-xs",
                    filters.colors.includes(color)
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-accent"
                  )}
                  onClick={() => onArrayFilterChange("colors", color)}
                >
                  <div
                    className="w-3 h-3 rounded-full border"
                    style={{
                      backgroundColor: color.toLowerCase(),
                      borderColor: color.toLowerCase() === 'white' ? '#ccc' : 'transparent'
                    }}
                  />
                  <span>{color}</span>
                </div>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Features */}
        {availableFilters.features.length > 0 && (
          <FilterSection title="Features">
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {availableFilters.features.map((feature: string) => (
                <div key={feature} className="flex items-center space-x-3">
                  <Checkbox
                    id={`feature-${feature}`}
                    checked={filters.features.includes(feature)}
                    onCheckedChange={() => onArrayFilterChange("features", feature)}
                    className="h-4 w-4"
                  />
                  <Label 
                    htmlFor={`feature-${feature}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Rating */}
        <FilterSection title="Minimum Rating">
          <div className="flex gap-2 flex-wrap">
            {[4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={filters.rating === rating ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange("rating", filters.rating === rating ? 0 : rating)}
                className="flex items-center gap-1 flex-1 min-w-[60px]"
              >
                <Star className="h-3 w-3 fill-current" />
                {rating}+
              </Button>
            ))}
          </div>
        </FilterSection>

        {/* Stock Status */}
        <FilterSection title="Availability">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="inStock"
              checked={filters.inStock}
              onCheckedChange={() => onToggleFilter("inStock")}
              className="h-4 w-4"
            />
            <Label htmlFor="inStock" className="text-sm font-normal cursor-pointer">
              Show only in stock
            </Label>
          </div>
        </FilterSection>

        {/* Sort */}
        <FilterSection title="Sort By">
          <Select 
            value={filters.sort} 
            onValueChange={(value) => onFilterChange("sort", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </FilterSection>

        {/* Mobile Apply Button */}
        {isMobile && onCloseMobile && (
          <Button
            className="w-full sticky bottom-0"
            onClick={onCloseMobile}
            size="lg"
          >
            Apply Filters
          </Button>
        )}
      </div>
    </motion.div>
  );
};