"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/landing-page/Navbar";
import Footer from "@/components/landing-page/Footer";
import JobCard from "@/components/company/JobCard";
import apiBissaKerja from "@/lib/api-bissa-kerja";
import {
  Users,
  Building2,
  FileText,
  Shield,
  MapPin,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Search,
  Send,
} from "lucide-react";

// Define TypeScript interfaces for type safety
interface Job {
  id: string;
  job_title: string;
  perusahaan_profile?: {
    nama_perusahaan: string;
    logo?: string;
  };
  location: string;
  salary_range: string;
  job_type: string;
  description: string;
  requirements?: string;
}

interface Company {
  id: number;
  nama_perusahaan: string;
  logo?: string;
  industri: string;
  province_id?: number;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

interface CompanyApiResponse {
  id: number;
  nama_perusahaan: string;
  logo?: string;
  industri: string;
  province_id?: string;
}

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [errorJobs, setErrorJobs] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [errorCompanies, setErrorCompanies] = useState<string | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [errorTestimonials, setErrorTestimonials] = useState<string | null>(null);

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        const response = await apiBissaKerja.get("post_lowongan");
        if (response.data.success) {
          setJobs(response.data.data || []);
        } else {
          setJobs([]);
          setErrorJobs("Tidak ada data lowongan ditemukan");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setErrorJobs("Gagal mengambil data lowongan");
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  // Fetch companies from backend
  const transformApiResponseToCompany = (apiData: CompanyApiResponse[]): Company[] => {
    return apiData.map((item) => ({
      id: item.id,
      nama_perusahaan: item.nama_perusahaan,
      logo: item.logo,
      industri: item.industri,
      province_id: item.province_id ? Number(item.province_id) : undefined,
    }));
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        const response = await apiBissaKerja.get("/perusahaan_profiles");
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          const transformedCompanies = transformApiResponseToCompany(response.data.data);
          setCompanies(transformedCompanies);
        } else if (response.data && Array.isArray(response.data.data)) {
          const transformedCompanies = transformApiResponseToCompany(response.data.data);
          setCompanies(transformedCompanies);
        } else if (response.data && Array.isArray(response.data)) {
          const transformedCompanies = transformApiResponseToCompany(response.data);
          setCompanies(transformedCompanies);
        } else {
          setCompanies([]);
          setErrorCompanies("Tidak ada data perusahaan ditemukan");
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
        setErrorCompanies("Gagal mengambil data perusahaan");
      } finally {
        setLoadingCompanies(false);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch testimonials from backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoadingTestimonials(true);
        const response = await apiBissaKerja.get("/testimonials");
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setTestimonials(response.data.data);
        } else {
          setTestimonials([]);
          setErrorTestimonials("Tidak ada data testimoni ditemukan");
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setErrorTestimonials("Gagal mengambil data testimoni");
      } finally {
        setLoadingTestimonials(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }
    setMounted(true);
  }, []);

  // Apply dark mode class
  useEffect(() => {
    if (mounted) {
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [darkMode, mounted]);

  // Testimonial navigation
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % Math.max(testimonials.length, 1));
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + Math.max(testimonials.length, 1)) % Math.max(testimonials.length, 1));
  };

  // Auto-slide testimonials
  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(nextTestimonial, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  // Function to generate company logo from first letter
  const getCompanyLogo = (companyName: string) => {
    return companyName.charAt(0).toUpperCase();
  };

  if (!mounted) return null;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark" : ""}`}
    >
      <Navbar />
      <main id="main-content" role="main">
        <section
          className="relative pt-20 sm:pt-24 pb-16 sm:pb-20 border-b border-slate-200 dark:border-slate-700 overflow-hidden"
          aria-labelledby="hero-heading"
          role="banner"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/disabilitas.jpg"
              alt="Hero background"
              fill
              className="object-cover object-center"
              priority
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
                  >
                    Solusi Profesional untuk
                    <span className="text-slate-300 block"> Karier Inklusif</span>
                  </h1>
                  <p
                    className="text-lg lg:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light"
                  >
                    Platform teknologi terdepan yang menghubungkan talenta terbaik
                    dengan perusahaan progresif. Membangun ekosistem kerja yang
                    inklusif, berkelanjutan, dan mengutamakan kesetaraan.
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
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">10K+</div>
                    <div className="text-sm text-slate-100 dark:text-slate-400 font-medium">
                      Peluang Karier
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{companies.length}+</div>
                    <div className="text-sm text-slate-100 dark:text-slate-400 font-medium">
                      Mitra Perusahaan
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">95%</div>
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
              >
                Metodologi Profesional
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light">
                Pendekatan sistematis dan terstruktur untuk memastikan pengalaman
                yang optimal dan hasil yang berkelanjutan
              </p>
            </header>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              role="list"
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
                    <div className="w-20 h-20 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center mx-auto group-hover:border-slate-400 dark:group-hover:border-slate-500 transition-colors duration-300">
                      <div className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-300 transition-colors duration-300">
                        {item.icon}
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
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
            <Image
              src="/images/disabilitas2.jpg"
              alt="Services background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/50 dark:bg-slate-900/60"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-16">
              <h2
                id="services-heading"
                className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight"
              >
                Layanan Profesional Kami
              </h2>
              <p className="text-xl text-slate-200 max-w-3xl mx-auto font-light">
                Menyediakan solusi end-to-end untuk menciptakan ekosistem kerja
                yang berkelanjutan dan inklusif bagi semua kalangan
              </p>
            </header>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              role="list"
            >
              {[
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Penyandang Disabilitas",
                  description:
                    "Solusi komprehensif untuk penyandang disabilitas dalam mengembangkan karier profesional yang berkelanjutan",
                  category: "INDIVIDU",
                },
                {
                  icon: <Building2 className="w-8 h-8" />,
                  title: "Perusahaan",
                  description:
                    "Program kemitraan strategis untuk perusahaan dalam membangun workforce yang beragam dan inklusif",
                  category: "Mitra Perusahaan",
                },
                {
                  icon: <FileText className="w-8 h-8" />,
                  title: "Hubungan Pemerintah",
                  description:
                    "Kolaborasi dengan Disnaker dalam implementasi kebijakan ketenagakerjaan yang progresif",
                  category: "Pemerintah",
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Komnas Disabilitas",
                  description:
                    "Kerjasama dengan Komnas Disabilitas untuk memastikan perlindungan hak dan standar industri",
                  category: "Regulasi",
                },
              ].map((service, index) => (
                <article
                  key={index}
                  className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-slate-700 group backdrop-blur-sm"
                  role="listitem"
                  aria-label={`${service.title}: ${service.description}`}
                  tabIndex={0}
                >
                  <div className="text-slate-600 dark:text-slate-400 mb-6 group-hover:text-slate-900 dark:group-hover:text-slate-300 transition-colors duration-300">
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
              >
                Peluang Karier Terkurasi
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light">
                Akses eksklusif ke posisi strategis dari perusahaan terkemuka
              </p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {loadingJobs ? (
                <div className="col-span-3 text-center py-8 text-slate-600 dark:text-slate-400">
                  Memuat data...
                </div>
              ) : errorJobs ? (
                <div className="col-span-3 text-center py-8 text-red-500">
                  {errorJobs}
                </div>
              ) : jobs.length > 0 ? (
                jobs.slice(0, 6).map((job) => (
                  <div key={job.id}>
                    <JobCard
                      job={{
                        id: job.id,
                        title: job.job_title,
                        company: job.perusahaan_profile?.nama_perusahaan ?? "Unknown Company",
                        location: job.location,
                        salary: job.salary_range,
                        type: job.job_type,
                        description: job.description,
                        requirements: job.requirements?.split("\n") ?? [],
                        logo: job.perusahaan_profile?.logo ?? "",
                      }}
                      urlDetail={`/cari-kerja/detail/${job.id}`}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-slate-600 dark:text-slate-400">
                  Tidak ada peluang tersedia
                </div>
              )}
            </div>
            <div className="text-center mt-16">
              <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-all">
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
            <Image
              src="/images/disabilitas3.jpg"
              alt="Testimonials background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/50 dark:bg-slate-900/60"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <header className="text-left mb-8 lg:mb-0">
                <h2
                  id="testimonials-heading"
                  className="text-3xl sm:text-4xl font-bold text-slate-200 dark:text-white mb-4 tracking-tight"
                >
                  Testimoni Profesional
                </h2>
                <p className="text-xl text-slate-200 dark:text-slate-400 max-w-md font-light">
                  Perspektif dari para profesional yang telah merasakan dampak
                  transformatif yang luar biasa dari platform kami, memberikan
                  wawasan berharga tentang bagaimana solusi inovatif kami telah
                  mengubah cara mereka menavigasi dunia karier dan mencapai
                  kesuksesan.
                </p>
              </header>
              <div role="region" aria-label="Carousel testimoni profesional" aria-live="polite">
                {loadingTestimonials ? (
                  <div className="text-center py-8 text-slate-200 dark:text-slate-400">
                    Memuat data testimoni...
                  </div>
                ) : errorTestimonials ? (
                  <div className="text-center py-8 text-red-500">
                    {errorTestimonials}
                  </div>
                ) : testimonials.length > 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-slate-700 dark:text-slate-300 font-bold text-xl">
                          {testimonials[currentTestimonial].avatar}
                        </span>
                      </div>
                      <blockquote className="text-lg text-slate-900 dark:text-white font-light leading-relaxed mb-6 italic pl-12 pr-12">
                        "{testimonials[currentTestimonial].content}"
                      </blockquote>
                      <div className="space-y-2">
                        <div className="text-base font-semibold text-slate-900 dark:text-white">
                          {testimonials[currentTestimonial].name}
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 font-medium text-sm">
                          {testimonials[currentTestimonial].role}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-500">
                          {testimonials[currentTestimonial].company}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-200 dark:text-slate-400">
                    Tidak ada testimoni tersedia
                  </div>
                )}
                {testimonials.length > 0 && (
                  <>
                    <button
                      onClick={prevTestimonial}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                      aria-label="Testimoni sebelumnya"
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                      aria-label="Testimoni selanjutnya"
                    >
                      <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                  </>
                )}
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
              >
                Jaringan Mitra Strategis
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light">
                Kolaborasi dengan organisasi terkemuka yang berbagi visi
              </p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {loadingCompanies ? (
                <div className="col-span-3 text-center py-8 text-slate-600 dark:text-slate-400">
                  Memuat data perusahaan...
                </div>
              ) : errorCompanies ? (
                <div className="col-span-3 text-center py-8 text-red-500">
                  {errorCompanies}
                </div>
              ) : companies.length > 0 ? (
                companies.slice(0, 6).map((company) => (
                  <article
                    key={company.id}
                    className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-slate-700 group"
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={`Logo ${company.nama_perusahaan}`}
                            className="w-12 h-12 object-contain rounded"
                          />
                        ) : (
                          <span className="text-slate-700 dark:text-slate-300 font-bold text-lg">
                            {getCompanyLogo(company.nama_perusahaan)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                          {company.nama_perusahaan}
                        </h3>
                        <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm mb-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {company.province_id ? `Provinsi ID: ${company.province_id}` : "Lokasi tidak tersedia"}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-500">
                          {company.industri}
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <button className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-medium text-sm transition-colors duration-300">
                          Lihat Kemitraan →
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-slate-600 dark:text-slate-400">
                  Tidak ada data perusahaan tersedia
                </div>
              )}
            </div>
            {companies.length > 6 && (
              <div className="text-center mt-16">
                <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-all">
                  Lihat Semua Mitra ({companies.length} Perusahaan)
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;