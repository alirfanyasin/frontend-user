"use client";
import React, { useEffect, useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      // Check system preference if no saved theme
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
    }
    setMounted(true);
    const isLoginCookie = Cookies.get("isLogin");
    setIsLogin(isLoginCookie === "true");
  }, []);

  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // Apply dark mode class to document
  useEffect(() => {
    if (mounted) {
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [darkMode, mounted]);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-200 dark:bg-black border-b border-gray-300 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo - Responsive sizing */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2">
              <img
                src="/images/logo/jatimbissa.png"
                alt="InklusifKerja Logo"
                className="w-20 h-20 sm:w-22 sm:h-15 rounded-lg hover:opacity-90 transition-opacity"
              />
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white hidden xs:block">
                JatimBissa
              </span>
            </div>
          </div>

          {/* Desktop/Tablet Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 lg:space-x-8">
              <Link
                href="/"
                className="text-gray-900 dark:text-white hover:text-blue-400 px-2 lg:px-3 py-2 text-sm font-medium transition-colors"
              >
                Beranda
              </Link>
              <Link
                href="/cari-kerja"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-400 px-2 lg:px-3 py-2 text-sm font-medium transition-colors"
              >
                Cari Kerja
              </Link>
              <Link
                href="/akademik"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-400 px-2 lg:px-3 py-2 text-sm font-medium transition-colors"
              >
                Akademik
              </Link>
              <Link
                href="/toko"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-400 px-2 lg:px-3 py-2 text-sm font-medium transition-colors"
              >
                Toko
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Dark Mode Toggle - Always visible */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 sm:p-2 rounded-lg bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* Auth Buttons - Hidden on small mobile */}
            {!isLogin ? (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Daftar
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  href="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-lg bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Optimized for touch */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-200 dark:bg-black border-t border-gray-300 dark:border-gray-800">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-3 text-base font-medium text-gray-900 dark:text-white hover:text-blue-400 transition-colors rounded-lg"
            >
              Beranda
            </Link>
            <Link
              href="/cari-kerja"
              className="block px-3 py-3 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-400 transition-colors rounded-lg"
            >
              Cari Kerja
            </Link>
            <Link
              href="/akademi"
              className="block px-3 py-3 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-400 transition-colors rounded-lg"
            >
              Akademi
            </Link>
            <Link
              href="/toko"
              className="block px-3 py-3 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-400 transition-colors rounded-lg"
            >
              Toko
            </Link>

            {!isLogin ? (
              <div className="border-t border-gray-300 dark:border-gray-800 pt-3 mt-3 sm:hidden">
                <Link
                  href="/login"
                  className="block w-full text-left px-3 py-3 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-400 transition-colors rounded-lg"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-left px-3 py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg mt-2 transition-colors"
                >
                  Daftar
                </Link>
              </div>
            ) : (
              <div className="border-t border-gray-300 dark:border-gray-800 pt-3 mt-3 sm:hidden">
                <Link
                  href="/dashboard"
                  className="block w-full text-left px-3 py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg mt-2 transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}