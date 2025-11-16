'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/browse', label: 'Browse' },
    { href: '/search', label: 'Search' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-netflix-black/95 backdrop-blur-md' 
        : 'bg-gradient-to-b from-black via-black/80 to-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link 
            href="/" 
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo.png"
              alt="StreamFlix"
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              priority
            />
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-netflix-red">
              StreamFlix
            </span>
          </Link>
          <div className="flex items-center space-x-3 sm:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-white'
                    : 'text-netflix-gray-200 hover:text-white'
                }`}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-netflix-red" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
