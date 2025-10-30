// components/Hero.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

type Banner = {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  isActive?: boolean;
};

const Hero = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banner");
        const bannerData = await res.json();

        // If we get a single banner object, wrap it in an array
        if (bannerData && (bannerData.title || bannerData.imageUrl)) {
          setBanners([bannerData]);
        } else {
          setBanners([]);
        }

        // Small delay to ensure smooth animation
        setTimeout(() => setIsLoaded(true), 100);
      } catch (error) {
        console.error("Error fetching banner:", error);
        setBanners([]);
      }
    };
    fetchBanners();
  }, []);

  // Auto-slide functionality for multiple banners
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        parallaxRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Loading state
  if (!banners || banners.length === 0) {
    return (
      <div 
        ref={heroRef}
        className="w-full h-full min-h-[500px] relative overflow-hidden bg-slate-700 flex items-center justify-center"
      >
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-24 h-24 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={heroRef}
      className="w-full h-full min-h-[500px] relative overflow-hidden"
    >
      {/* Multiple banners with sliding - if we have multiple banners */}
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            index === currentBanner
              ? "opacity-100 scale-100"
              : "opacity-0 scale-110 pointer-events-none"
          }`}
        >
          {/* Image Background with Parallax */}
          {banner.imageUrl && (
            <div className="absolute inset-0">
              {/* Parallax Background */}
              <div 
                ref={parallaxRef}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={banner.imageUrl}
                  alt={banner.title || "Luxury Banner"}
                  fill
                  sizes="100vw"
                  priority
                  className={`object-cover transition-all duration-1000 ease-out ${
                    isLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
                  }`}
                  quality={100}
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                />
              </div>

              {/* Enhanced gradient overlays */}
            </div>
          )}

          {/* Text Content - Positioned to be covered by bottom content */}
          {(banner.title || banner.subtitle || banner.ctaText) && (
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center px-6 lg:px-12 text-center transition-all duration-1000 ease-out ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {/* Content container with refined styling */}
              <div className="max-w-4xl mx-auto text-white">
                {banner.title && (
                  <h1 className="text-2xl lg:text-3xl font-light tracking-wide drop-shadow-2xl font-serif italic">
                    {banner.title.split("").map((letter, index) => (
                      <span
                        key={index}
                        className="inline-block transition-all duration-500 hover:scale-110 hover:text-gold-300 cursor-default"
                        style={{ transitionDelay: `${index * 50}ms` }}
                      >
                        {letter}
                      </span>
                    ))}
                  </h1>
                )}

                {banner.subtitle && (
                  <p className="text-sm lg:text-xl font-light tracking-wider drop-shadow-lg uppercase text-gray-200 max-w-2xl mx-auto leading-relaxed mt-4">
                    {banner.subtitle}
                  </p>
                )}

                {banner.ctaText && banner.ctaLink && (
                  <div className="pt-6">
                    <Link
                      href={banner.ctaLink}
                      className="group/btn inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-gold-500 text-gold-300 font-light tracking-widest uppercase text-xs transition-all duration-500 hover:bg-gold-500 hover:text-black hover:shadow-2xl hover:scale-105 relative overflow-hidden"
                    >
                      {/* Button background effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-gold-300/10 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />

                      <span className="relative z-10">{banner.ctaText}</span>
                      <ArrowRight className="w-4 h-4 relative z-10 transform group-hover/btn:translate-x-1 transition-transform duration-300" />

                      {/* Button corners */}
                      
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Luxury pattern overlay */}
        </div>
      ))}

      {/* Bottom Content Overlay - This covers the bottom part of the hero */}
    

      {/* Navigation Dots - Only show if multiple banners */}
      {banners.length > 1 && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-5 h-[0.5] rounded-full transition-all border-2 ${
                index === currentBanner
                  ? "bg-white border-white"
                  : "bg-transparent border-white/50 hover:border-white"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;