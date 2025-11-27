// components/Hero.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';

// Add this function to fetch banners from your API
const getActiveBanners = async (): Promise<any[]> => {
  try {
    const response = await fetch('/api/banner');
    if (!response.ok) {
      throw new Error('Failed to fetch banners');
    }
    const banners = await response.json();
    return banners;
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
};

const Hero = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const activeBanners = await getActiveBanners();
        setBanners(activeBanners);
      } catch (error) {
        console.error('Error loading banners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Handle video loading and playback
  useEffect(() => {
    const currentBannerData = banners[currentBanner];
    if (currentBannerData?.mediaType === 'video' && videoRef.current) {
      const video = videoRef.current;
      video.load();
      video.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, [currentBanner, banners]);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        parallaxRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative h-[540px] overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading banners...</p>
        </div>
      </div>
    );
  }

  // If no banners from Sanity, show the original static version
  if (!banners || banners.length === 0) {
    return (
      <div className="relative h-[540px] overflow-hidden">
        {/* Parallax Background */}
        <div 
          ref={parallaxRef}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero.avif')" }}
        />
        {/* Fallback content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Welcome to Our Store
            </h1>
            <p className="text-xl md:text-2xl mb-6 opacity-90 drop-shadow-md">
              Discover amazing products
            </p>
            <Link
              href="/products"
              className={buttonVariants({ variant: 'secondary', size: 'lg' })}
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getTextPositionClass = (position: string) => {
    switch (position) {
      case 'left':
        return 'text-left mr-auto';
      case 'right':
        return 'text-left ml-auto';
      default:
        return 'text-center mx-auto';
    }
  };

  const getJustifyClass = (position: string) => {
    switch (position) {
      case 'left':
        return 'justify-start';
      case 'right':
        return 'justify-end';
      default:
        return 'justify-center';
    }
  };

  return (
    <div className="relative h-[540px] overflow-hidden">
      {/* Multiple banners with sliding */}
      {banners.map((banner, index) => (
        <div
          key={banner._id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentBanner ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Media Background from Sanity */}
          {banner.mediaType === 'video' && banner.video?.url ? (
            <div className="absolute inset-0 overflow-hidden">
              <video
                ref={index === currentBanner ? videoRef : null}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                preload="metadata"
                poster={banner.videoPoster}
                onLoadedData={index === currentBanner ? handleVideoLoad : undefined}
                controls={false}
                disablePictureInPicture
                disableRemotePlayback
              >
                <source src={banner.video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* Fallback image if video fails to load */}
              {!isVideoLoaded && banner.videoPoster && (
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url('${banner.videoPoster}')` 
                  }}
                />
              )}
            </div>
          ) : (
            // Image Banner with Parallax
            <div 
              ref={index === currentBanner ? parallaxRef : null}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url('${banner.imageUrl || banner.image?.asset?.url}')`,
                backgroundAttachment: 'fixed'
              }}
            />
          )}

          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Text Content from Sanity */}
          <div className={`absolute inset-0 h-full flex items-center ${getJustifyClass(banner.textPosition || 'center')} container mx-auto px-4`}>
            <div className={`max-w-2xl ${
              banner.textColor === 'light' ? 'text-white' : 'text-gray-900'
            } ${getTextPositionClass(banner.textPosition || 'center')}`}>
              {banner.title && (
                <h1 className="text-4xl md:text-6xl  mb-2 font-serif drop-shadow-lg">
                  {banner.title}
                </h1>
              )}
              {banner.subtitle && (
                <p className="text-lg md:text-2xl uppercase mb-6 opacity-75 drop-shadow-md">
                  {banner.subtitle}
                </p>
              )}
              {(banner.buttonText || banner.ctaText) && (banner.buttonLink || banner.ctaLink) && (
                <Link
                  href={banner.buttonLink || banner.ctaLink}
                  className={buttonVariants({ 
                    variant: banner.textColor === 'light' ? 'secondary' : 'default',
                    size: 'lg'
                  })}
                >
                  {banner.buttonText || banner.ctaText}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots - Only show if multiple banners */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-10 h-1 rounded-full transition-all ${
                index === currentBanner 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/70'
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