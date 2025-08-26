"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/landing-page/Navbar";
import Footer from "@/components/landing-page/Footer";
import JobCard from "@/components/company/JobCard";
import jobsData from "@/data/jobs.json";
import companiesData from "@/data/companies.json";
import testimonialsData from "@/data/testimonials.json";
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
  UserPlus,
  Search,
  Send,
} from "lucide-react";

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  const jobListings = jobsData;
  const companies = companiesData;
  const testimonials = testimonialsData;

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
    }
    setMounted(true);
  }, []);

  // Listen for theme changes from other components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        setDarkMode(e.newValue === "dark");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    const handleThemeChange = (e: CustomEvent) => {
      setDarkMode(e.detail === "dark");
    };
    window.addEventListener("themeChange", handleThemeChange as EventListener);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "themeChange",
        handleThemeChange as EventListener
      );
    };
  }, []);

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

  // Testimonial slider navigation
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-slate-800 text-white px-4 py-2 rounded z-50"
        aria-label="Lewati ke konten utama"
      >
        Lewati ke konten utama
      </a>

      <Navbar />

      <main id="main-content" role="main">
        <section
          className="relative pt-20 sm:pt-24 pb-16 sm:pb-20 border-b border-slate-200 dark:border-slate-700 overflow-hidden"
          aria-labelledby="hero-heading"
          role="banner"
        >
          <div className="absolute inset-0 z-0">
            <img
              src="/images/disabilitas.jpg"
              alt=""
              className="w-full h-80% object-cover object-center scale-with-zoom"
              role="presentation"
            />
            <div className="absolute inset-0 bg-slate-900/50 dark:bg-slate-900/60"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-8 text-center lg:text-left">
                <header className="space-y-6">
                  <h1
                    id="hero-heading"
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight"
                    aria-label="Solusi Profesional untuk Karier Inklusif"
                  >
                    Solusi Profesional untuk
                    <span className="text-slate-300 block">
                      {" "}
                      Karier Inklusif
                    </span>
                  </h1>
                  <p
                    className="text-lg lg:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light"
                    aria-label="Platform teknologi terdepan yang menghubungkan talenta terbaik dengan perusahaan progressive. Membangun ekosistem kerja yang inklusif, berkelanjutan, dan mengutamakan kesetaraan."
                  >
                    Platform teknologi terdepan yang menghubungkan talenta
                    terbaik dengan perusahaan progressive. Membangun ekosistem
                    kerja yang inklusif, berkelanjutan, dan mengutamakan
                    kesetaraan.
                  </p>
                </header>
                <div
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  role="group"
                  aria-label="Tombol aksi utama"
                >
                  <button
                    className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
                    aria-label="Mulai eksplorasi platform"
                  >
                    Mulai Eksplorasi
                  </button>
                  <button
                    className="border border-slate-300 text-white hover:bg-white/10 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
                    aria-label="Pelajari lebih lanjut tentang platform"
                  >
                    Pelajari Lebih Lanjut
                  </button>
                </div>
                <section
                  className="grid grid-cols-3 gap-8 pt-8 max-w-md mx-auto lg:mx-0 border-t border-slate-200 dark:border-slate-700"
                  aria-label="Statistik platform"
                >
                  <div
                    className="text-center"
                    aria-label="10 ribu lebih peluang karier tersedia"
                  >
                    <div className="text-2xl font-bold text-white dark:text-white">
                      10K+
                    </div>
                    <div className="text-sm text-slate-100 dark:text-slate-400 font-medium">
                      Peluang Karier
                    </div>
                  </div>
                  <div
                    className="text-center"
                    aria-label="500 lebih mitra perusahaan"
                  >
                    <div
                      className="text-2xl font-bold text-white dark:text-white"
                      aria-label="500+"
                    >
                      500+
                    </div>
                    <div className="text-sm text-slate-100 dark:text-slate-400 font-medium">
                      Mitra Perusahaan
                    </div>
                  </div>
                  <div
                    className="text-center"
                    aria-label="95 persen tingkat kepuasan"
                  >
                    <div
                      className="text-2xl font-bold text-white dark:text-white"
                      aria-label="95%"
                    >
                      95%
                    </div>
                    <div className="text-sm text-slate-100 dark:text-slate-400 font-medium">
                      Tingkat Kepuasan
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
        <section
          className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700"
          aria-labelledby="methodology-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-16">
              <h2
                id="methodology-heading"
                className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight"
                aria-label="Metodologi Profesional"
              >
                Metodologi Profesional
              </h2>
              <p
                className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light"
                aria-label="Pendekatan sistematis dan terstruktur untuk memastikan pengalaman yang optimal dan hasil yang berkelanjutan"
              >
                Pendekatan sistematis dan terstruktur untuk memastikan
                pengalaman yang optimal dan hasil yang berkelanjutan
              </p>
            </header>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              role="list"
              aria-label="Tahapan metodologi profesional"
            >
              {[
                {
                  step: "01",
                  icon: <UserPlus className="w-8 h-8" />,
                  title: "Registration & Onboarding",
                  description:
                    "Proses registrasi yang komprehensif dengan validasi identitas dan assessment kemampuan",
                },
                {
                  step: "02",
                  icon: <FileText className="w-8 h-8" />,
                  title: "Profile Development",
                  description:
                    "Pengembangan profil profesional dengan bantuan konsultan karier bersertifikat",
                },
                {
                  step: "03",
                  icon: <Search className="w-8 h-8" />,
                  title: "Intelligent Matching",
                  description:
                    "Sistem AI yang mencocokkan kandidat dengan peluang berdasarkan kompatibilitas holistik",
                },
                {
                  step: "04",
                  icon: <Send className="w-8 h-8" />,
                  title: "Application & Follow-up",
                  description:
                    "Proses aplikasi terintegrasi dengan tracking real-time dan support berkelanjutan",
                },
              ].map((item, index) => (
                <article
                  key={index}
                  className="text-center group"
                  role="listitem"
                  aria-label={`Tahap ${item.step}: ${item.title} - ${item.description}`}
                  tabIndex={0}
                >
                  <div className="relative mb-8">
                    <div
                      className="w-20 h-20 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center mx-auto group-hover:border-slate-400 dark:group-hover:border-slate-500 transition-colors duration-300"
                      aria-hidden="true"
                    >
                      <div className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-300 transition-colors duration-300">
                        {item.icon}
                      </div>
                    </div>
                    <div
                      className="absolute -top-2 -right-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center"
                      aria-label={`Tahap ${item.step}`}
                    >
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          className="relative py-16 sm:py-20 border-b border-slate-200 dark:border-slate-700 overflow-hidden"
          aria-labelledby="services-heading"
          role="region"
        >
          <div className="absolute inset-0 z-0">
            <img
              src="/images/disabilitas2.jpg"
              alt=""
              className="w-full h-80% object-cover"
              role="presentation"
            />
            <div className="absolute inset-0 bg-slate-900/50 dark:bg-slate-900/60"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-16">
              <h2
                id="services-heading"
                className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight"
                aria-label="Layanan Profesional Kami"
              >
                Layanan Profesional Kami
              </h2>
              <p
                className="text-xl text-slate-200 max-w-3xl mx-auto font-light"
                aria-label="Menyediakan solusi end-to-end untuk menciptakan ekosistem kerja yang berkelanjutan dan inklusif bagi semua kalangan"
              >
                Menyediakan solusi end-to-end untuk menciptakan ekosistem kerja
                yang berkelanjutan dan inklusif bagi semua kalangan
              </p>
            </header>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              role="list"
              aria-label="Daftar layanan profesional"
            >
              {[
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Talent Solutions",
                  description:
                    "Solusi komprehensif untuk penyandang disabilitas dalam mengembangkan karier profesional yang berkelanjutan",
                  category: "Individual",
                },
                {
                  icon: <Building2 className="w-8 h-8" />,
                  title: "Enterprise Partners",
                  description:
                    "Program kemitraan strategis untuk perusahaan dalam membangun workforce yang beragam dan inklusif",
                  category: "Corporate",
                },
                {
                  icon: <FileText className="w-8 h-8" />,
                  title: "Government Relations",
                  description:
                    "Kolaborasi dengan Disnaker dalam implementasi kebijakan ketenagakerjaan yang progressive",
                  category: "Government",
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Advocacy & Compliance",
                  description:
                    "Kerjasama dengan Komnas Disabilitas untuk memastikan perlindungan hak dan standar industri",
                  category: "Regulatory",
                },
              ].map((service, index) => (
                <article
                  key={index}
                  className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-slate-700 group backdrop-blur-sm"
                  role="listitem"
                  aria-label={`${service.title}: ${service.description}`}
                  tabIndex={0}
                >
                  <div
                    className="text-slate-600 dark:text-slate-400 mb-6 group-hover:text-slate-900 dark:group-hover:text-slate-300 transition-colors duration-300"
                    aria-hidden="true"
                  >
                    {service.icon}
                  </div>
                  <div className="mb-3">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {service.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {service.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700"
          aria-labelledby="opportunities-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-16">
              <h2
                id="opportunities-heading"
                className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight"
                aria-label="Peluang Karier Terkurasi"
              >
                Peluang Karier Terkurasi
              </h2>
              <p
                className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light"
                aria-label="Akses eksklusif ke posisi-posisi strategis dari perusahaan terkemuka yang mengutamakan nilai-nilai inklusivitas"
              >
                Akses eksklusif ke posisi-posisi strategis dari perusahaan
                terkemuka yang mengutamakan nilai-nilai inklusivitas
              </p>
            </header>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              role="list"
              aria-label="Daftar peluang karier terkurasi"
            >
              {jobListings.map((job) => (
                <div key={job.id} role="listitem">
                  <JobCard job={job} urlDetail="/cari-kerja/detail" />
                </div>
              ))}
            </div>
            <div className="text-center mt-16">
              <button
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                aria-label="Eksplorasi semua peluang karier"
              >
                Eksplorasi Semua Peluang
              </button>
            </div>
          </div>
        </section>
        <section
  className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-800 relative"
  aria-labelledby="testimonials-heading"
>
  <div className="absolute inset-0 z-0">
    <img
      src="/images/disabilitas3.jpg"
      alt=""
      className="w-full h-full object-cover"
      role="presentation"
    />
    <div className="absolute inset-0 bg-slate-900/50 dark:bg-slate-900/60"></div>
  </div>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <header className="text-left mb-8 lg:mb-0">
        <h2
          id="testimonials-heading"
          className="text-3xl sm:text-4xl font-bold text-slate-200 dark:text-white mb-4 tracking-tight"
          aria-label="Testimoni Profesional"
        >
          Testimoni Profesional
        </h2>
        <p
          className="text-xl text-slate-200 dark:text-slate-400 max-w-md font-light"
          aria-label="Perspektif dari para profesional yang telah merasakan dampak transformatif yang luar biasa dari platform kami, memberikan wawasan berharga tentang bagaimana solusi inovatif kami telah mengubah cara mereka menavigasi dunia karier dan mencapai kesuksesan."
        >
          Perspektif dari para profesional yang telah merasakan dampak
          transformatif yang luar biasa dari platform kami, memberikan wawasan
          berharga tentang bagaimana solusi inovatif kami telah mengubah cara
          mereka menavigasi dunia karier dan mencapai kesuksesan.
        </p>
      </header>
      <div
        className="relative max-w-2xl mx-auto lg:mx-0"
        role="region"
        aria-label="Carousel testimoni profesional"
        aria-live="polite"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div
              className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6"
              aria-label={`Avatar ${testimonials[currentTestimonial].name}`}
            >
              <span className="text-slate-700 dark:text-slate-300 font-bold text-xl">
                {testimonials[currentTestimonial].avatar}
              </span>
            </div>
            <blockquote
              className="text-lg text-slate-900 dark:text-white font-light leading-relaxed mb-6 italic pl-12 pr-12"
              aria-label={`Testimoni: ${testimonials[currentTestimonial].content}`}
            >
              "{testimonials[currentTestimonial].content}"
            </blockquote>
            <div className="space-y-2">
              <div
                className="text-base font-semibold text-slate-900 dark:text-white"
                aria-label={`Nama: ${testimonials[currentTestimonial].name}`}
              >
                {testimonials[currentTestimonial].name}
              </div>
              <div
                className="text-slate-600 dark:text-slate-400 font-medium text-sm"
                aria-label={`Posisi: ${testimonials[currentTestimonial].role}`}
              >
                {testimonials[currentTestimonial].role}
              </div>
              <div
                className="text-sm text-slate-500 dark:text-slate-500"
                aria-label={`Perusahaan: ${testimonials[currentTestimonial].company}`}
              >
                {testimonials[currentTestimonial].company}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={prevTestimonial}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          aria-label="Testimoni sebelumnya"
        >
          <ChevronLeft
            className="w-5 h-5 text-slate-600 dark:text-slate-400"
            aria-hidden="true"
          />
        </button>
        <button
          onClick={nextTestimonial}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          aria-label="Testimoni selanjutnya"
        >
          <ChevronRight
            className="w-5 h-5 text-slate-600 dark:text-slate-400"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  </div>
</section>
        <section
          className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700"
          aria-labelledby="network-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-16">
              <h2
                id="network-heading"
                className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight"
                aria-label="Jaringan Mitra Strategis"
              >
                Jaringan Mitra Strategis
              </h2>
              <p
                className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light"
                aria-label="Kolaborasi dengan organisasi terkemuka yang berbagi visi untuk menciptakan masa depan kerja yang lebih inklusif"
              >
                Kolaborasi dengan organisasi terkemuka yang berbagi visi untuk
                menciptakan masa depan kerja yang lebih inklusif
              </p>
            </header>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              role="list"
              aria-label="Daftar mitra strategis"
            >
              {companies.map((company) => (
                <article
                  key={company.id}
                  className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-slate-700 group"
                  role="listitem"
                  aria-label={`Mitra ${company.name} di ${company.location}`}
                  tabIndex={0}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div
                      className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-slate-300 dark:group-hover:bg-slate-600 transition-colors duration-300"
                      aria-label={`Logo ${company.name}`}
                    >
                      <span className="text-slate-700 dark:text-slate-300 font-bold text-lg">
                        {company.logo}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                        {company.name}
                      </h3>
                      <div
                        className="flex items-center text-slate-600 dark:text-slate-400 text-sm"
                        aria-label={`Lokasi: ${company.location}`}
                      >
                        <MapPin className="w-4 h-4 mr-1" aria-hidden="true" />
                        {company.location}
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                    <button
                      className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-medium text-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 rounded"
                      aria-label={`Lihat kemitraan dengan ${company.name}`}
                    >
                      Lihat Kemitraan →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;