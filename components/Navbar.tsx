'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/contact', label: 'Contact' },
];

const calculatorLinks = [
  { href: '/illinois', label: 'Illinois' },
  { href: '/indiana', label: 'Indiana' },
  { href: '/iowa', label: 'Iowa' },
  { href: '/michigan', label: 'Michigan' },
  { href: '/minnesota', label: 'Minnesota' },
  { href: '/nebraska', label: 'Nebraska' },
  { href: '/ohio', label: 'Ohio' },
  { href: '/wisconsin', label: 'Wisconsin' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleDropdown = (name: string) =>
    setOpenDropdown(prev => (prev === name ? null : name));

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">Renewable Energy Tax Impacts</Link>
      </div>

      <ul className={styles.navLinks}>
        {navLinks.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className={styles.navLink}>
              {label}
            </Link>
          </li>
        ))}

        {/* Dropdown as li */}
        <li
          className={styles.dropdown}
          onMouseEnter={() => !isMobileMenuOpen && setOpenDropdown('calc')}
          onMouseLeave={() => !isMobileMenuOpen && setOpenDropdown(null)}
          onClick={() => isMobileMenuOpen && toggleDropdown('calc')}
        >
          <span className={styles.navLink}>Calculators</span>
          <div
            className={clsx(
              styles.dropdownMenu,
              openDropdown === 'calc' && styles.showDropdown
            )}
          >
            {calculatorLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={styles.dropdownItem}>
                {label}
              </Link>
            ))}
          </div>
        </li>
      </ul>
    </nav>
  );
}
