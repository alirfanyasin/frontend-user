"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  Building2,
  FileText,
  Shield,
  MapPin,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Search,
  Send,
  HandHeart,
  Accessibility,
  UserCheck,
  ClipboardCheck,
  Target,
  Mail,
  Award,
  TrendingUp,
  Globe,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

// Extract static data to module scope to avoid re-creating on each render
const JOB_LISTINGS = [
  {
    id: 1,
    title: "Front-End Developer",
    company: "PT Tech Indonesia",
    location: "Surabaya",
    salary: "8-12 juta",
    type: "Full-time",
    accessibility: ["Ramah Tuli", "Akses Kursi Roda"],
    posted: "2 hari lalu",
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "CV Digital Solutions",
    location: "Malang",
    salary: "6-9 juta",
    type: "Full-time",
    accessibility: ["Ramah Tunanetra", "Flexible Hours"],
    posted: "1 hari lalu",
  },
  {
    id: 3,
    title: "Content Writer",
    company: "Media Creative Agency",
    location: "Sidoarjo",
    salary: "5-7 juta",
    type: "Part-time",
    accessibility: ["Work From Home", "Ramah Disabilitas Fisik"],
    posted: "3 hari lalu",
  },
];

const COMPANIES = [
  { id: 1, name: "PT Telkom Indonesia", logo: "TI", location: "Jakarta" },
  { id: 2, name: "Bank Mandiri", logo: "BM", location: "Surabaya" },
  { id: 3, name: "Gojek Indonesia", logo: "GI", location: "Jakarta" },
  { id: 4, name: "Shopee Indonesia", logo: "SI", location: "Jakarta" },
  { id: 5, name: "Tokopedia", logo: "TP", location: "Jakarta" },
  { id: 6, name: "Bukalapak", logo: "BL", location: "Jakarta" },
];

const TESTIMONIALS = [
  {
    name: "Andi Prasetyo",
    role: "Software Developer",
    company: "PT Tech Solutions",
    content:
      "Platform ini benar-benar membantu saya menemukan pekerjaan yang sesuai dengan kebutuhan aksesibilitas saya. Prosesnya mudah dan perusahaan yang terdaftar sangat inklusif.",
    avatar: "AP",
  },
  {
    name: "Sari Wijayanti",
    role: "Data Analyst",
    company: "CV Digital Innovation",
    content:
      "Sebagai penyandang disabilitas, saya merasa dihargai di platform ini. Tim support sangat membantu dalam proses pencarian kerja.",
    avatar: "SW",
  },
  {
    name: "Budi Santoso",
    role: "Graphic Designer",
    company: "Creative Agency Indo",
    content:
      "Fitur filter berdasarkan kebutuhan aksesibilitas sangat membantu. Saya dapat menemukan pekerjaan yang benar-benar cocok untuk saya.",
    avatar: "BS",
  },
];

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
    );
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300`}>
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded z-50"
        aria-label="Lewati ke konten utama"
      >
        Lewati ke konten utama
      </a>

      {/* Professional Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Accessibility className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  JATIM BISSA
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Basis Data Disabilitas Berdaya
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              <a
                href="#beranda"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              >
                Beranda
              </a>
              <a
                href="#lowongan"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              >
                Lowongan Kerja
              </a>
              <a
                href="#perusahaan"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              >
                Perusahaan
              </a>
              <a
                href="#tentang"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              >
                Tentang Kami
              </a>
              <a
                href="#kontak"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              >
                Kontak
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? "🌞" : "🌙"}
              </button>
              <Link
                href={"/login"}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href={"/register"}
                className="border border-blue-600 text-blue-600 dark:text-blue-400 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main id="main-content" role="main">
        {/* Professional Hero Section with Background Image */}
        <section
          id="beranda"
          className="relative pt-8 pb-16 overflow-hidden"
          aria-labelledby="hero-heading"
          role="banner"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.85), rgba(99, 102, 241, 0.85)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2393c5fd'/%3E%3Cstop offset='100%25' style='stop-color:%23a5b4fc'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23bg)'/%3E%3C!-- Professional workplace scene with disability inclusion --%3E%3C!-- Office building silhouette --%3E%3Crect x='100' y='300' width='300' height='300' fill='%23ffffff' opacity='0.1'/%3E%3Crect x='500' y='250' width='250' height='350' fill='%23ffffff' opacity='0.1'/%3E%3Crect x='850' y='280' width='200' height='320' fill='%23ffffff' opacity='0.1'/%3E%3C!-- People silhouettes representing diversity and inclusion --%3E%3C!-- Person in wheelchair --%3E%3Ccircle cx='200' cy='420' r='25' fill='%23ffffff' opacity='0.8'/%3E%3Crect x='190' y='440' width='20' height='40' fill='%23ffffff' opacity='0.8'/%3E%3Ccircle cx='200' cy='500' r='30' fill='none' stroke='%23ffffff' stroke-width='3' opacity='0.8'/%3E%3Ccircle cx='180' cy='500' r='8' fill='%23ffffff' opacity='0.8'/%3E%3Ccircle cx='220' cy='500' r='8' fill='%23ffffff' opacity='0.8'/%3E%3C!-- Standing person with cane --%3E%3Ccircle cx='350' cy='380' r='22' fill='%23ffffff' opacity='0.8'/%3E%3Crect x='342' y='400' width='16' height='60' fill='%23ffffff' opacity='0.8'/%3E%3Cline x1='365' y1='420' x2='365' y2='460' stroke='%23ffffff' stroke-width='3' opacity='0.8'/%3E%3C!-- Another person --%3E%3Ccircle cx='500' cy='390' r='20' fill='%23ffffff' opacity='0.8'/%3E%3Crect x='493' y='408' width='14' height='50' fill='%23ffffff' opacity='0.8'/%3E%3C!-- Team collaboration scene --%3E%3Crect x='600' y='400' width='80' height='20' fill='%23ffffff' opacity='0.6' rx='10'/%3E%3C!-- Accessibility symbols --%3E%3Cpath d='M900 350 L920 350 L920 370 L940 370 L940 390 L920 390 L920 410 L900 410 L900 390 L880 390 L880 370 L900 370 Z' fill='%23ffffff' opacity='0.7'/%3E%3C!-- Abstract geometric shapes for modern feel --%3E%3Ccircle cx='1000' cy='200' r='40' fill='%23fbbf24' opacity='0.3'/%3E%3Crect x='150' y='150' width='60' height='60' fill='%2310b981' opacity='0.3' rx='30'/%3E%3Cpolygon points='800,180 820,220 780,220' fill='%23f59e0b' opacity='0.3'/%3E%3C/svg%3E")`,
              }}
            />
            {/* Additional overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 dark:from-gray-900/40 dark:to-black/40" />
          </div>

          {/* Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                    <Award className="w-4 h-4 mr-2" />
                    Platform Resmi Pemerintah Jawa Timur
                  </div>

                  <h1
                    id="hero-heading"
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                  >
                    Platform
                    <span className="block text-yellow-300">JATIM BISSA</span>
                  </h1>

                  <p className="text-lg text-blue-100 leading-relaxed max-w-2xl">
                    JATIM BISSA menghubungkan penyandang disabilitas dengan
                    perusahaan inklusif di Jawa Timur. Platform resmi hasil
                    kerjasama Disnakertrans Jatim, Komnas Disabilitas, dan
                    Universitas Telkom Surabaya.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl flex items-center justify-center">
                    <Search className="w-5 h-5 mr-2" />
                    Cari Pekerjaan
                  </button>
                </div>

                {/* Professional Stats */}
                <div className="grid grid-cols-3 gap-8 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">12,547+</div>
                    <div className="text-sm text-blue-200 font-medium">
                      Lowongan Aktif
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">850+</div>
                    <div className="text-sm text-blue-200 font-medium">
                      Perusahaan Partner
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">98%</div>
                    <div className="text-sm text-blue-200 font-medium">
                      Tingkat Kepuasan
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Professional Hero Visual */}
              <div className="relative">
                <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
                  {/* Simulated professional workplace image with accessibility features */}
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Lingkungan Kerja Inklusif
                      </h3>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>

                    {/* Workplace features representation */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Accessibility className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Akses Ramah Disabilitas
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <HandHeart className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Tim Support Dedicated
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Program Pengembangan Karier
                        </span>
                      </div>
                    </div>

                    {/* Success metrics visualization */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          2,847
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Berhasil Bekerja
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600 dark:text-green-400">
                          156
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Perusahaan Aktif
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400/30 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-400/30 rounded-full blur-xl"></div>
                </div>

                {/* Floating accessibility icons */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <Accessibility className="w-6 h-6 text-white" />
                </div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <HandHeart className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Target Users Section - More Professional */}
        <section
          className="py-16 bg-gray-50 dark:bg-gray-800"
          aria-labelledby="target-users-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Melayani Seluruh Ekosistem Ketenagakerjaan
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Platform terintegrasi yang menghubungkan berbagai pihak untuk
                menciptakan lingkungan kerja yang inklusif dan berkelanjutan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Penyandang Disabilitas",
                  description:
                    "Akses eksklusif ke lowongan kerja inklusif, pelatihan keterampilan, dan dukungan pengembangan karier berkelanjutan.",
                  color: "bg-blue-500",
                  stats: "15,000+ Pengguna Aktif",
                },
                {
                  icon: <Building2 className="w-8 h-8" />,
                  title: "Perusahaan",
                  description:
                    "Platform rekrutmen terintegrasi untuk menemukan talenta berkualitas dan membangun reputasi sebagai perusahaan inklusif.",
                  color: "bg-green-500",
                  stats: "850+ Perusahaan Partner",
                },
                {
                  icon: <FileText className="w-8 h-8" />,
                  title: "Disnakertrans Jatim",
                  description:
                    "Dashboard monitoring dan pelaporan untuk mengoptimalkan program ketenagakerjaan dan menurunkan tingkat pengangguran.",
                  color: "bg-purple-500",
                  stats: "38 Kabupaten/Kota",
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Komnas Disabilitas",
                  description:
                    "Sistem advokasi dan perlindungan hak-hak penyandang disabilitas dalam dunia kerja dengan monitoring berkelanjutan.",
                  color: "bg-red-500",
                  stats: "24/7 Support System",
                },
              ].map((card, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group hover:-translate-y-1"
                >
                  <div
                    className={`${card.color} text-white rounded-xl p-3 w-fit mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {card.description}
                  </p>
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {card.stats}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Job Listings Section */}
        <section
          id="lowongan"
          className="py-16 bg-white dark:bg-gray-900"
          aria-labelledby="job-listings-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Lowongan Pekerjaan Terpilih
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Peluang karier terbaik dari perusahaan-perusahaan yang telah
                berkomitmen pada lingkungan kerja inklusif
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {JOB_LISTINGS.map((job: typeof JOB_LISTINGS[number]) => (
                <div
                  key={job.id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 font-medium">
                        {job.company}
                      </p>
                    </div>
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                      {job.type}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>Rp {job.salary}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Diposting {job.posted}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Fitur Aksesibilitas:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {job.accessibility.map((feature: string, index: number) => (
                        <span
                          key={index}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
                    Lamar Sekarang
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                Lihat Semua Lowongan (12,547+ Tersedia)
              </button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Cara Kerja Platform
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Proses yang telah dirancang khusus untuk memudahkan penyandang
                disabilitas dalam mencari dan mendapatkan pekerjaan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  icon: <UserCheck className="w-8 h-8" />,
                  title: "Registrasi Akun",
                  description:
                    "Buat akun dengan mudah menggunakan email, nomor telepon, atau akun media sosial yang sudah ada",
                },
                {
                  step: "02",
                  icon: <ClipboardCheck className="w-8 h-8" />,
                  title: "Profil & Verifikasi",
                  description:
                    "Lengkapi profil dengan data keahlian dan kebutuhan aksesibilitas, kemudian verifikasi melalui sistem kami",
                },
                {
                  step: "03",
                  icon: <Target className="w-8 h-8" />,
                  title: "Pencarian Cerdas",
                  description:
                    "Gunakan filter canggih berdasarkan lokasi, keahlian, dan kebutuhan aksesibilitas untuk menemukan pekerjaan ideal",
                },
                {
                  step: "04",
                  icon: <Send className="w-8 h-8" />,
                  title: "Lamar & Monitor",
                  description:
                    "Kirim lamaran dengan sekali klik dan pantau status aplikasi melalui dashboard pribadi yang terintegrasi",
                },
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-600 dark:group-hover:bg-blue-500 transition-colors duration-300">
                      <div className="text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300">
                        {item.icon}
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Companies Section */}
        <section id="perusahaan" className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Perusahaan Partner Terpercaya
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Bergabung dengan ekosistem perusahaan-perusahaan terkemuka yang
                telah berkomitmen menciptakan lingkungan kerja inklusif
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {COMPANIES.map((company: typeof COMPANIES[number]) => (
                <div
                  key={company.id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {company.logo}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {company.name}
                      </h3>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {company.location}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors">
                      Lihat Lowongan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Testimoni Pengguna
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Dengarkan cerita sukses dari para pengguna yang telah menemukan
                karier impian mereka melalui platform kami
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 shadow-xl">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-2xl">
                      {TESTIMONIALS[currentTestimonial].avatar}
                    </span>
                  </div>

                  <blockquote className="text-xl md:text-2xl text-gray-900 dark:text-white font-medium leading-relaxed mb-6">
                    "{TESTIMONIALS[currentTestimonial].content}"
                  </blockquote>

                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {TESTIMONIALS[currentTestimonial].name}
                    </div>
                    <div className="text-base text-blue-600 dark:text-blue-400 font-medium">
                      {TESTIMONIALS[currentTestimonial].role}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {TESTIMONIALS[currentTestimonial].company}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>

              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center space-x-2 mt-8">
                {TESTIMONIALS.map((_: typeof TESTIMONIALS[number], index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? "bg-blue-600 dark:bg-blue-400 scale-125"
                        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="kontak" className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Hubungi Kami
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Tim support kami siap membantu Anda 24/7. Jangan ragu untuk
                menghubungi kami jika ada pertanyaan atau butuh bantuan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Telepon
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  +62 31 1234 5678
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Senin - Jumat, 08:00 - 17:00
                </p>
              </div>

              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Email
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  support@jatimbissa.go.id
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Respon dalam 24 jam
                </p>
              </div>

              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Alamat
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Jl. Ahmad Yani No. 118
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Surabaya, Jawa Timur 60235
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">
                Siap Memulai Perjalanan Karier Anda?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Bergabunglah dengan ribuan penyandang disabilitas yang telah
                menemukan pekerjaan impian mereka melalui JATIM BISSA.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Daftar Sebagai Pencari Kerja
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  Daftar Sebagai Perusahaan
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Professional Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Accessibility className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">JATIM BISSA</h3>
                  <p className="text-sm text-gray-400">
                    Basis Data Disabilitas Berdaya
                  </p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Platform resmi Pemerintah Provinsi Jawa Timur untuk
                menghubungkan penyandang disabilitas dengan peluang karier
                terbaik.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <Globe className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pencarian Kerja
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Konsultasi Karier
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pelatihan Keterampilan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sertifikasi Profesi
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pasang Lowongan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Database Kandidat
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Konsultasi HR
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Training Inklusif
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Dukungan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pusat Bantuan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Panduan Pengguna
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Hubungi Kami
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 JATIM BISSA. Dikembangkan oleh Disnakertrans Provinsi Jawa
              Timur, Komnas Disabilitas, dan Universitas Telkom Surabaya.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Kebijakan Privasi
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Syarat & Ketentuan
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Aksesibilitas
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Screen Reader Only CSS */}
      <style jsx global>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .focus\\:not-sr-only:focus {
          position: static;
          width: auto;
          height: auto;
          padding: 0.5rem 1rem;
          margin: 0;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
