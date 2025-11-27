"use client";
import React, { useState, useEffect, useRef } from "react";
import Brand from "../utils/brand";
import { buttonVariants } from "../ui/button";
import { ShoppingBag, Truck, Search, X, Menu, Home, FileText, User, MenuIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "../ui/sheet";
import { IconMenu, IconSearch, IconShoppingBag } from '@tabler/icons-react'

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentTopText, setCurrentTopText] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [menuAnimation, setMenuAnimation] = useState("closed");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const topTexts = ["LUXURY COLLECTIONS", "#PREMIUMSTYLE", "EXCLUSIVE DESIGNS"];

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Rotate top bar text with animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTopText((prev) => (prev + 1) % topTexts.length);
        setIsAnimating(false);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, [topTexts.length]);

  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  }, [isSearchOpen]);

  // Handle menu animation states
  useEffect(() => {
    if (isSheetOpen) {
      setMenuAnimation("opening");
      document.body.style.overflow = 'hidden';
      setTimeout(() => setMenuAnimation("open"), 50);
    } else {
      setMenuAnimation("closing");
      setTimeout(() => {
        setMenuAnimation("closed");
        document.body.style.overflow = 'unset';
      }, 300);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSheetOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery("");
    }
  };

  const handleMenuToggle = () => {
    setIsSheetOpen(!isSheetOpen);
  };

  const closeMenu = () => {
    setIsSheetOpen(false);
  };

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Track Order", href: "/track-order" },
    { name: "Policies", href: "/terms" },
  ];

  const mobileMenuItems = [
    { href: "/", label: "HOME" },
    { href: "/track-order", label: "TRACK ORDER" },
    { href: "/terms", label: "POLICIES" },
  ];

  return (
    <>
      {/* Top Black Bar */}
      <div className="fixed top-0 left-0 w-full bg-black text-white py-2 z-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm font-medium uppercase tracking-wide h-5 flex items-center justify-center">
            <span 
              className={`transition-all duration-500 ease-out ${
                isAnimating 
                  ? 'opacity-0 transform -translate-y-4 scale-95' 
                  : 'opacity-100 transform translate-y-0 scale-100'
              }`}
            >
              {topTexts[currentTopText]}
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="fixed bg-white/50 saturate-200 backdrop-blur-2xl top-8 w-full z-40">
        <div className="flex items-center justify-between p-4 md:p-6">
          {/* Left Section - Menu (Mobile) / Navigation (Desktop) */}
          <div className="flex items-center md:flex-1">
            {/* Mobile Menu Button */}
            <button 
              onClick={handleMenuToggle}
              className="md:hidden p-2 transition-all duration-300 ease-out hover:scale-110 active:scale-95 hover:opacity-70 uppercase text-sm font-medium tracking-wide flex items-center gap-2"
              aria-label="Open menu"
            >
              <IconMenu />
            </button>
            
            {/* Desktop Navigation - Left */}
            <nav className="hidden md:flex items-center gap-8 w-full justify-start">
              {navigationItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className="relative transition-all duration-500 ease-out hover:opacity-80 
                             after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black 
                             after:transition-all after:duration-500 hover:after:w-full uppercase text-sm font-medium tracking-wide"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="md:absolute md:left-1/2 transform md:-translate-x-1/2 ">
  <Link href="/" className="transform transition-transform duration-300 hover:scale-105">
    <Brand />
  </Link>
</div>
          </div>
{/* Center Section - Logo */}


          {/* Right Section - Actions */}
          <div className="flex items-center gap-4 md:gap-8 md:flex-1 md:justify-end">
            {/* Search */}
            <button 
              onClick={handleSearchToggle}
              className="transition-all duration-300 ease-out hover:scale-110 active:scale-95 hover:opacity-70 flex items-center gap-2 uppercase font-medium tracking-wide"
              aria-label="Search"
            >
              <span className="sm:inline">SEARCH</span>
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 transition-all duration-300 hover:scale-110 relative flex items-center gap-2"
            >
              <IconShoppingBag size={20} />
              <span className="hidden sm:inline">CART</span>
              {/* Cart indicator */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isSearchOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <form onSubmit={handleSearch} className="bg-white border-t border-gray-200 p-4">
            <div className="container mx-auto">
              <div className="relative max-w-2xl mx-auto">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="SEARCH LUXURY COLLECTIONS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border-0 bg-gray-100 rounded-md uppercase text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 placeholder-gray-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition-colors duration-200"
                >
                  <Search size={16} />
                </button>
              </div>
              {searchQuery && (
                <button
                  type="submit"
                  className="w-full max-w-2xl mx-auto mt-3 px-4 py-2 bg-black text-white uppercase text-sm font-medium tracking-wide rounded-md transition-all duration-300 hover:bg-gray-800 active:scale-95"
                >
                  Search
                </button>
              )}
            </div>
          </form>
        </div>
      </header>

      {/* Mobile Menu */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent 
          side="left" 
          className={`w-80 p-0 border-r border-gray-200 bg-white transition-all duration-500 ease-in-out ${
            menuAnimation === "opening" ? "transform -translate-x-full" :
            menuAnimation === "closing" ? "transform -translate-x-full" :
            "transform translate-x-0"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-200">
              <span className="uppercase font-bold text-2xl tracking-widest">MENU</span>
              <button 
                onClick={closeMenu}
                className="p-2 transition-all duration-300 hover:scale-110 hover:opacity-70"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 p-8 bg-gradient-to-b from-white to-gray-50">
              <ul className="space-y-8">
                {mobileMenuItems.map((item, index) => (
                  <li key={item.href}>
                    <SheetClose asChild>
                      <Link
                        href={item.href}
                        className={`block py-4 uppercase text-2xl font-bold tracking-wider transition-all duration-700 ease-out 
                                   hover:opacity-80 hover:translate-x-4 hover:text-gray-800 border-b-2 border-transparent
                                   hover:border-black transform origin-left ${
                                     menuAnimation === "open" 
                                       ? `animate-in slide-in-from-left-full fade-in duration-700 ease-out fill-mode-backwards`
                                       : ""
                                   }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Footer */}
            <div className="p-8 border-t border-gray-200 bg-black text-white">
              <div className="space-y-4">
                <div className="invert">
                  <Brand />
                </div>
                <p className="text-sm uppercase tracking-widest text-gray-300">#PREMIUMSTYLE</p>
                <div className="pt-4 text-xs text-gray-400 uppercase tracking-wide border-t border-gray-700">
                  <p>Explore Exclusive Collections</p>
                  <p className="mt-2">Luxury Redefined</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Spacer for fixed header */}
      <div className="h-24"></div>
    </>
  );
}

export default Header;