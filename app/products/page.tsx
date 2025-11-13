"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/queries/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Search } from "lucide-react";
import ProductsSection from "@/components/sections/products";
import { Filters } from "@/components/product/filters";
import { Input } from "@/components/ui/input";


function ProductsPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    Array<{ _id: string; name: string; slug: string }>
  >([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Enhanced available filters with brands
  const [availableFilters, setAvailableFilters] = useState({
    sizes: [] as string[],
    colors: [] as string[],
    features: [] as string[],
    brands: [] as string[],
    brandCounts: {} as Record<string, number>,
    maxPrice: 0,
  });

  // Enhanced filters state with brands
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    minPrice: parseInt(searchParams.get("minPrice") || "0"),
    maxPrice: parseInt(searchParams.get("maxPrice") || "50000"),
    category: searchParams.get("category") || "",
    sort: searchParams.get("sort") || "newest",
    page: parseInt(searchParams.get("page") || "1"),
    limit: 12,
    sizes: searchParams.get("sizes")?.split(",").filter(Boolean) || [],
    colors: searchParams.get("colors")?.split(",").filter(Boolean) || [],
    features: searchParams.get("features")?.split(",").filter(Boolean) || [],
    brands: searchParams.get("brands")?.split(",").filter(Boolean) || [],
    rating: searchParams.get("rating") ? parseInt(searchParams.get("rating")!) : 0,
    featured: searchParams.get("featured") === "true",
    inStock: searchParams.get("inStock") !== "false",
    onSale: searchParams.get("onSale") === "true",
  });

  const [pagination, setPagination] = useState({
    total: 0,
    hasNextPage: false,
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.q) params.set("q", filters.q);
    if (filters.minPrice > 0) params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice < 50000) params.set("maxPrice", filters.maxPrice.toString());
    if (filters.category) params.set("category", filters.category);
    if (filters.sort !== "newest") params.set("sort", filters.sort);
    if (filters.page > 1) params.set("page", filters.page.toString());
    if (filters.sizes.length > 0) params.set("sizes", filters.sizes.join(","));
    if (filters.colors.length > 0) params.set("colors", filters.colors.join(","));
    if (filters.features.length > 0) params.set("features", filters.features.join(","));
    if (filters.brands.length > 0) params.set("brands", filters.brands.join(","));
    if (filters.rating > 0) params.set("rating", filters.rating.toString());
    if (filters.featured) params.set("featured", "true");
    if (!filters.inStock) params.set("inStock", "false");
    if (filters.onSale) params.set("onSale", "true");

    router.replace(`/products?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.q) params.append("q", filters.q);
      params.append("minPrice", filters.minPrice.toString());
      params.append("maxPrice", filters.maxPrice.toString());
      if (filters.category) params.append("category", filters.category);
      params.append("sort", filters.sort);
      params.append("page", filters.page.toString());
      params.append("limit", filters.limit.toString());
      if (filters.sizes.length > 0) params.append("sizes", filters.sizes.join(","));
      if (filters.colors.length > 0) params.append("colors", filters.colors.join(","));
      if (filters.features.length > 0) params.append("features", filters.features.join(","));
      if (filters.brands.length > 0) params.append("brands", filters.brands.join(","));
      if (filters.rating > 0) params.append("minRating", filters.rating.toString());
      if (filters.featured) params.append("featured", "true");
      if (!filters.inStock) params.append("excludeSoldOut", "true");
      if (filters.onSale) params.append("onSale", "true");

      const response = await fetch(`/api/product?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
        setPagination({
          total: data.pagination.total,
          hasNextPage: data.pagination.hasNextPage,
        });

        // Extract available filters from products including brands
        if (data.data.length > 0) {
          const sizes = new Set<string>();
          const colors = new Set<string>();
          const features = new Set<string>();
          const brands = new Set<string>();
          const brandCounts: Record<string, number> = {};
          let maxPrice = 0;

          data.data.forEach((product: Product) => {
            product.sizes?.forEach(size => sizes.add(size));
            product.colors?.forEach((color: string) => colors.add(color));
            product.features?.forEach(feature => features.add(feature));
            
            // Extract brand from product name or use a default
            const brand = product.brand || extractBrandFromName(product.name);
            if (brand) {
              brands.add(brand);
              brandCounts[brand] = (brandCounts[brand] || 0) + 1;
            }
            
            if (product.price > maxPrice) maxPrice = product.price;
          });

          setAvailableFilters({
            sizes: Array.from(sizes).sort(),
            colors: Array.from(colors).sort(),
            features: Array.from(features).sort(),
            brands: Array.from(brands).sort(),
            brandCounts,
            maxPrice: Math.ceil(maxPrice / 1000) * 1000,
          });
        }
      } else {
        throw new Error(data.message || "Failed to fetch products");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract brand from product name
  const extractBrandFromName = (name: string): string => {
    const brandPatterns = [
      /^(.*?)(?=\s+[A-Z]|$)/, // Capture first word
      /([A-Z][a-z]+)(?:\s+[A-Z][a-z]+)*/ // Capture capitalized words
    ];
    
    for (const pattern of brandPatterns) {
      const match = name.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return name.split(' ')[0] || 'Unknown';
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // Filter handlers
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleArrayFilterChange:any = (type: "sizes" | "colors" | "features" | "brands", value: string) => {
    setFilters((prev) => {
      const currentArray = prev[type];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [type]: newArray,
        page: 1,
      };
    });
  };

  const handlePriceChange = (value: [number, number]) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
      page: 1,
    }));
  };

  const handleToggleFilter:any = (key: "featured" | "inStock" | "onSale") => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
      page: 1,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      q: "",
      minPrice: 0,
      maxPrice: 50000,
      category: "",
      sort: "newest",
      page: 1,
      limit: 12,
      sizes: [],
      colors: [],
      features: [],
      brands: [],
      rating: 0,
      featured: false,
      inStock: true,
      onSale: false,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.minPrice > 0) count++;
    if (filters.maxPrice < 50000) count++;
    if (filters.category) count++;
    if (filters.sizes.length > 0) count++;
    if (filters.colors.length > 0) count++;
    if (filters.features.length > 0) count++;
    if (filters.brands.length > 0) count++;
    if (filters.rating > 0) count++;
    if (filters.featured) count++;
    if (!filters.inStock) count++;
    if (filters.onSale) count++;
    return count;
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
       
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={filters.q}
              onChange={(e) => handleFilterChange("q", e.target.value)}
              className="w-full pl-10 pr-4 py-1 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mobile Filters Button */}
          <Button
            variant="outline"
            className="flex items-center gap-2 md:hidden"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <Filter/>
            Filters
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-1">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          <Badge variant="secondary" className="cursor-pointer" onClick={clearAllFilters}>
            Clear All ×
          </Badge>
          
          {filters.category && (
            <Badge variant="secondary">
              Category: {categories.find(c => c.slug === filters.category)?.name}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleFilterChange("category", "")} />
            </Badge>
          )}
          
          {filters.brands.map(brand => (
            <Badge key={brand} variant="secondary">
              Brand: {brand}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleArrayFilterChange("brands", brand)} />
            </Badge>
          ))}
          
          {filters.sizes.map(size => (
            <Badge key={size} variant="secondary">
              Size: {size}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleArrayFilterChange("sizes", size)} />
            </Badge>
          ))}
          
          {filters.rating > 0 && (
            <Badge variant="secondary">
              Rating: {filters.rating}+
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleFilterChange("rating", 0)} />
            </Badge>
          )}
          
          {filters.featured && (
            <Badge variant="secondary">
              Featured
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleToggleFilter("featured")} />
            </Badge>
          )}
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filters Overlay */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <Filters
              filters={filters}
              availableFilters={availableFilters}
              categories={categories}
              onFilterChange={handleFilterChange}
              onArrayFilterChange={handleArrayFilterChange}
              onPriceChange={handlePriceChange}
              onToggleFilter={handleToggleFilter}
              onClearAll={clearAllFilters}
              getActiveFilterCount={getActiveFilterCount}
              isMobile={true}
              onCloseMobile={() => setMobileFiltersOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Desktop Filters Sidebar */}
        <div className="hidden md:block w-80">
          <Filters
            filters={filters}
            availableFilters={availableFilters}
            categories={categories}
            onFilterChange={handleFilterChange}
            onArrayFilterChange={handleArrayFilterChange}
            onPriceChange={handlePriceChange}
            onToggleFilter={handleToggleFilter}
            onClearAll={clearAllFilters}
            getActiveFilterCount={getActiveFilterCount}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              Showing {products.length} of {pagination.total} products
            </p>
            <Button
              variant="outline"
              className="hidden md:flex items-center gap-2"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </div>

          {error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-600 p-4 rounded-lg"
            >
              {error}
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                <ProductsSection
                  products={products}
                  deskCols={3}
                  title={
                    filters.category
                      ? `${
                          categories.find((c) => c.slug === filters.category)
                            ?.name
                        } Collection`
                      : "All Products"
                  }
                  desc={
                    filters.q 
                      ? `Search results for "${filters.q}"`
                      : "Discover our complete collection"
                  }
                  showViewAll={false}
                />
              </motion.div>

              {/* Pagination */}
              {pagination.total > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-center mt-12 gap-2"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={filters.page === 1}
                    onClick={() => handlePageChange(filters.page - 1)}
                  >
                    ‹
                  </Button>

                  {Array.from({
                    length: Math.min(
                      5,
                      Math.ceil(pagination.total / filters.limit)
                    ),
                  }).map((_, i) => {
                    let pageNum;
                    if (Math.ceil(pagination.total / filters.limit) <= 5) {
                      pageNum = i + 1;
                    } else if (filters.page <= 3) {
                      pageNum = i + 1;
                    } else if (
                      filters.page >=
                      Math.ceil(pagination.total / filters.limit) - 2
                    ) {
                      pageNum =
                        Math.ceil(pagination.total / filters.limit) - 4 + i;
                    } else {
                      pageNum = filters.page - 2 + i;
                    }

                    return (
                      <Button
                        key={i}
                        variant={
                          filters.page === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasNextPage}
                    onClick={() => handlePageChange(filters.page + 1)}
                  >
                    ›
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="hidden md:block space-y-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <ProductsPageComponent />
    </Suspense>
  );
}