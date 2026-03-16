import Link from 'next/link';
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { MdElectricBolt } from 'react-icons/md';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-accent-900 text-white mt-16">
      <div className="container-fluid py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-ev rounded-lg flex items-center justify-center">
                <MdElectricBolt className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">EVCharge</span>
            </div>
            <p className="text-accent-300 text-sm mb-4">
              Making EV charging accessible, convenient, and sustainable for everyone.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-accent-300 hover:text-primary-400 transition">
                <FiFacebook size={18} />
              </a>
              <a href="#" className="text-accent-300 hover:text-primary-400 transition">
                <FiTwitter size={18} />
              </a>
              <a href="#" className="text-accent-300 hover:text-primary-400 transition">
                <FiLinkedin size={18} />
              </a>
              <a href="#" className="text-accent-300 hover:text-primary-400 transition">
                <FiInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/stations" className="text-accent-300 hover:text-primary-400 transition">
                  Stations
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-accent-300 hover:text-primary-400 transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-accent-300 hover:text-primary-400 transition">
                  Book Now
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-accent-300 hover:text-primary-400 transition">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-accent-300 hover:text-primary-400 transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-accent-300 hover:text-primary-400 transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-accent-300 hover:text-primary-400 transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-accent-300 hover:text-primary-400 transition">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-accent-300">
                <FiMail className="mt-1 flex-shrink-0" />
                <a href="mailto:support@evcharge.com" className="hover:text-primary-400 transition">
                  support@evcharge.com
                </a>
              </div>
              <div className="flex items-start gap-3 text-accent-300">
                <FiPhone className="mt-1 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-primary-400 transition">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-start gap-3 text-accent-300">
                <FiMapPin className="mt-1 flex-shrink-0" />
                <span>123 Green Street, Tech City, TC 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-accent-700 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-accent-400 text-sm">
            <div>
              <p>&copy; {currentYear} EVCharge. All rights reserved.</p>
            </div>
            <div className="flex justify-center gap-4">
              <a href="#" className="hover:text-primary-400 transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary-400 transition">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary-400 transition">
                Cookie Policy
              </a>
            </div>
            <div className="text-right">
              <p>Powered by sustainable energy ⚡</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
