import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { MdElectricBolt } from 'react-icons/md';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/stations', label: 'Stations' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/booking', label: 'Book' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container-fluid flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-ev rounded-lg flex items-center justify-center">
              <MdElectricBolt className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">EVCharge</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-accent-700 font-medium hover:text-primary-600 transition"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-primary-600 font-semibold hover:text-primary-700">
                Login
              </Link>
              <Link href="/signup" className="btn btn-primary btn-small">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="flex items-center gap-2 text-accent-700 hover:text-primary-600">
                <FiUser />
                Dashboard
              </Link>
              <button className="btn btn-outline btn-small flex items-center gap-2">
                <FiLogOut />
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-accent-700 hover:text-primary-600 transition"
        >
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 border-t border-accent-100">
          <div className="container-fluid py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-accent-700 font-medium hover:text-primary-600 transition py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-accent-100 pt-4 flex flex-col gap-2">
              <Link href="/login" className="btn btn-outline btn-small text-center">
                Login
              </Link>
              <Link href="/signup" className="btn btn-primary btn-small text-center">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
