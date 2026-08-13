'use client';

import { useState, useEffect } from 'react';
import { navLinks } from '@/data/portfolio-data';

export default function Navbar({ onOpenAdmin }: { onOpenAdmin: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,10,15,0.95)] backdrop-blur-[20px] border-b border-[var(--border-color)] py-4 transition-shadow duration-300"
      style={scrolled ? { boxShadow: '0 4px 30px rgba(0,0,0,0.3)' } : undefined}
    >
      <div className="max-w-[1200px] mx-auto px-8 flex justify-between items-center">
        <div className="text-2xl font-extrabold tracking-tight bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
          SV.dev
        </div>

        <ul className="hidden md:flex gap-10 list-none">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-[var(--text-secondary)] no-underline font-medium text-[0.95rem] transition-colors duration-300 relative hover:text-[var(--accent-primary)] after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-[var(--accent-primary)] after:to-[var(--accent-secondary)] after:transition-[width] after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          onClick={onOpenAdmin}
          className="px-3 py-2 bg-transparent border border-[var(--border-color)] text-[var(--text-secondary)] rounded-md cursor-pointer text-sm transition-colors duration-300 font-mono hover:border-[var(--accent-secondary)] hover:text-[var(--accent-secondary)]"
        >
          ⚙ ADMIN
        </button>
      </div>
    </nav>
  );
}
