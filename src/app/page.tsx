"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/landing-page/Navbar";
import Footer from "@/components/landing-page/Footer";
import JobCard from "@/components/company/JobCard";
import testimonialsData from "@/data/testimonials.json";
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
  FileX,
  RefreshCw,
  Building,
} from "lucide-react";
import axios, { AxiosError } from "axios";

// Define TypeScript interfaces
interface DisabilitasType {
  id: number;
  kategori_disabilitas: string;
  tingkat_disabilitas: string;
  created_at: string;
  updated_at: string;
  pivot: {
    post_lowongan_id: number;
    disabilitas_id: number;
  };
}

interface PerusahaanProfile {
  id: number;
  logo: string | null;
  logo_url: string | null; // Added for full logo URL from backend
  nama_perusahaan: string;
  industri: string;
  tahun_berdiri: string;
  jumlah_karyawan: string;
  deskripsi: string;
  no_telp: string;
  link_website: string;
  alamat_lengkap: string;
  visi: string;
  misi: string;
  nilai_nilai: string;
  sertifikat: string;
  bukti_wajib_lapor: string;
  nib: string;
  linkedin: string | null;
  instagram: string | null;
  facebook: string | null;
  twitter: string | null;
  youtube: string | null;
  tiktok: string | null;
  status_verifikasi: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface Company {
  id: number;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
  status: "active" | "inactive" | "pending";
  createdAt?: string;
  employeeCount?: string;
  logo?: string;
  industri?: string;
  tahunBerdiri?: string;
  website?: string;
}

interface JobVacancy {
  id: number;
  job_title: string;
  job_type: string;
  description: string;
  responsibilities: string;
  requirements: string;
  education: string;
  experience: string;
  salary_range: string;
  benefits: string;
  location: string;
  application_deadline: string;
  accessibility_features: string;
  work_accommodations: string;
  skills: string[];
  perusahaan_profile: PerusahaanProfile;
  disabilitas: DisabilitasType[];
  created_at?: string;
  updated_at?: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination?: Pagination;
}

// Base URL for images
const BASE_IMAGE_URL = "http://localhost:8000/storage";

// Skeleton Component for JobCard
const JobCardSkeleton = () => (
  <article className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full">
    <header className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3 flex-1">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 w-12 h-12 rounded-lg" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-5 rounded w-3/4" />
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 rounded w-1/2" />
        </div>
      </div>
    </header>
    <section className="space-y-3 mb-4">
      <div className="flex items-center">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 w-4 h-4 rounded mr-2" />
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 rounded w-2/3" />
      </div>
      <div className="flex items-center">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 w-4 h-4 rounded mr-2" />
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 rounded w-1/2" />
      </div>
      <div className="flex items-center">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 w-4 h-4 rounded mr-2" />
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 rounded w-1/3" />
      </div>
    </section>
    <section className="mb-4">
      <div className="flex flex-wrap gap-2">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 rounded-full w-16" />
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 rounded-full w-20" />
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 rounded-full w-14" />
      </div>
    </section>
    <div className="flex-1"></div>
    <div className="flex items-center justify-between mb-4">
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 rounded-full w-20" />
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 rounded w-24" />
    </div>
    <footer className="pt-4 border-t border-gray-100 dark:border-gray-700">
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 w-full h-10 rounded-lg" />
    </footer>
  </article>
);

// Skeleton Component for CompanyCard
const CompanyCardSkeleton = () => (
  <article className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
    <div className="flex items-center space-x-4 mb-6">
      <div className="animate-pulse bg-slate-200 dark:bg-slate-700 w-16 h-16 rounded-lg"></div>
      <div className="flex-1 space-y-2">
        <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-5 rounded w-3/4" />
        <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-4 rounded w-1/2" />
      </div>
    </div>
    <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
      <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-4 rounded w-24" />
    </div>
  </article>
);

// Empty State Component for Jobs
const EmptyState = ({ onRefresh }: { onRefresh: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="text-center max-w-md">
      <FileX className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Tidak Ada Lowongan Pekerjaan
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
        Saat ini belum ada lowongan pekerjaan yang tersedia. Silakan coba lagi nanti atau hubungi administrator.
      </p>
      <button
        onClick={onRefresh}
        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Muat Ulang
      </button>
    </div>
  </div>
);

// Empty State Component for Companies
const CompanyEmptyState = ({ onRefresh }: { onRefresh: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="text-center max-w-md">
      <FileX className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Tidak Ada Perusahaan Tersedia
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
        Saat ini belum ada data perusahaan yang tersedia. Silakan coba lagi nanti atau hubungi administrator.
      </p>
      <button
        onClick={onRefresh}
        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Muat Ulang
      </button>
    </div>
  </div>
);

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [errorJobs, setErrorJobs] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [errorCompanies, setErrorCompanies] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const testimonials: Testimonial[] = testimonialsData;

  // Transform API response to Company interface
  const transformApiResponseToCompany = (
    apiData: PerusahaanProfile[]
  ): Company[] => {
    return apiData.map((item) => ({
      id: item.id,
      companyName: item.nama_perusahaan || "Tidak Diketahui",
      email: item.user?.email || "tidak tersedia",
      phone: item.no_telp || "Tidak tersedia",
      address: item.alamat_lengkap || "Tidak tersedia",
      description: item.deskripsi,
      status:
        item.status_verifikasi === "terverifikasi"
          ? "active"
          : item.status_verifikasi === "ditolak"
          ? "inactive"
          : "pending",
      createdAt: item.created_at
        ? new Date(item.created_at).toLocaleDateString("id-ID")
        : undefined,
      employeeCount: item.jumlah_karyawan,
      logo: item.logo_url || item.logo,
      industri: item.industri,
      tahunBerdiri: item.tahun_berdiri,
      website: item.link_website,
    }));
  };

  // Helper function to get company logo URL
  const getCompanyLogoUrl = (logo: string | null | undefined, companyName: string): string => {
    if (logo && logo.trim() !== "") {
      if (logo.startsWith("http")) {
        return logo;
      }
      return `${BASE_IMAGE_URL}/${logo}`;
    }
    const encodedName = encodeURIComponent(companyName);
    return `https://ui-avatars.com/api/?name=${encodedName}&length=2`;
  };

  // Fetch jobs from backend
  const fetchJobs = async (): Promise<void> => {
    try {
      setLoadingJobs(true);
      setErrorJobs(null);

      let response;
      const possibleEndpoints = ["/jobs"];

      let lastError = null;

      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          response = await apiBissaKerja.get<ApiResponse<JobVacancy>>(endpoint);
          console.log(`Success with endpoint: ${endpoint}`, response.data);
          break;
        } catch (err) {
          console.log(`Failed endpoint: ${endpoint}`, err);
          lastError = err;
          continue;
        }
      }

      if (!response) {
        console.warn("All API endpoints failed. Using dummy data for development.");
        const dummyData: JobVacancy[] = [
          {
            id: 1,
            job_title: "Frontend Developer",
            job_type: "Full Time",
            description: "Develop user interfaces using React",
            responsibilities: "Build responsive web applications",
            requirements: "Experience with React, TypeScript",
            education: "S1 Informatika",
            experience: "2-3 tahun",
            salary_range: "8-12 Juta",
            benefits: "Asuransi kesehatan, bonus tahunan",
            location: "Jakarta, Indonesia",
            application_deadline: "2025-12-31",
            accessibility_features: "Ramah disabilitas",
            work_accommodations: "Fleksible working hours",
            skills: ["React", "TypeScript", "CSS", "JavaScript"],
            perusahaan_profile: {
              id: 1,
              logo: null,
              logo_url: null,
              nama_perusahaan: "Tech Innovate",
              industri: "Technology",
              tahun_berdiri: "2020",
              jumlah_karyawan: "50-100",
              deskripsi: "Perusahaan teknologi modern",
              no_telp: "021-1234567",
              link_website: "https://techinnovate.com",
              alamat_lengkap: "Jakarta Selatan",
              visi: "Menjadi perusahaan tech terdepan",
              misi: "Memberikan solusi teknologi terbaik",
              nilai_nilai: "Innovation, Quality, Integrity",
              sertifikat: "ISO 9001",
              bukti_wajib_lapor: "12345678",
              nib: "87654321",
              linkedin: null,
              instagram: null,
              facebook: null,
              twitter: null,
              youtube: null,
              tiktok: null,
              status_verifikasi: "terverifikasi",
              user_id: 1,
              created_at: "2024-01-01",
              updated_at: "2024-01-01",
            },
            disabilitas: [
              {
                id: 1,
                kategori_disabilitas: "Tuna Daksa",
                tingkat_disabilitas: "Ringan",
                created_at: "2024-01-01",
                updated_at: "2024-01-01",
                pivot: {
                  post_lowongan_id: 1,
                  disabilitas_id: 1,
                },
              },
            ],
            created_at: "2024-08-01",
            updated_at: "2024-08-01",
          },
          {
            id: 2,
            job_title: "Backend Developer",
            job_type: "Full Time",
            description: "Develop server-side applications",
            responsibilities: "Build APIs and manage databases",
            requirements: "Experience with Node.js, MongoDB",
            education: "S1 Teknik Informatika",
            experience: "1-2 tahun",
            salary_range: "7-10 Juta",
            benefits: "Remote work, learning budget",
            location: "Bandung, Indonesia",
            application_deadline: "2025-11-30",
            accessibility_features: "Akses kursi roda",
            work_accommodations: "Remote work available",
            skills: ["Node.js", "MongoDB", "Express", "API"],
            perusahaan_profile: {
              id: 2,
              logo: null,
              logo_url: null,
              nama_perusahaan: "Digital Solutions",
              industri: "Software Development",
              tahun_berdiri: "2019",
              jumlah_karyawan: "10-50",
              deskripsi: "Solusi digital untuk bisnis",
              no_telp: "022-9876543",
              link_website: "https://digitalsolutions.com",
              alamat_lengkap: "Bandung, Jawa Barat",
              visi: "Digitalisasi untuk semua",
              misi: "Membantu bisnis bertransformasi digital",
              nilai_nilai: "Excellence, Innovation, Collaboration",
              sertifikat: "ISO 27001",
              bukti_wajib_lapor: "11223344",
              nib: "44332211",
              linkedin: null,
              instagram: null,
              facebook: null,
              twitter: null,
              youtube: null,
              tiktok: null,
              status_verifikasi: "pending",
              user_id: 2,
              created_at: "2024-02-01",
              updated_at: "2024-02-01",
            },
            disabilitas: [],
            created_at: "2024-08-15",
            updated_at: "2024-08-15",
          },
        ];
        setJobs(dummyData);
        return;
      }

      if (response.data.success === true) {
        setJobs(response.data.data || []);
      } else {
        setJobs([]);
        console.log("API returned unsuccessful response:", response.data.message);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 404) {
          setErrorJobs("Data lowongan tidak ditemukan.");
        } else if (axiosError.response?.status === 500) {
          setErrorJobs("Server sedang mengalami gangguan. Silakan coba lagi nanti.");
        } else if (axiosError.response?.status === 401) {
          setErrorJobs("Sesi Anda telah berakhir. Silakan login kembali.");
        } else if (axiosError.response?.status === 403) {
          setErrorJobs("Anda tidak memiliki akses untuk melihat data ini.");
        } else if (!axiosError.response) {
          setErrorJobs("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
        } else {
          setErrorJobs(`Terjadi kesalahan (Error ${axiosError.response?.status}). Silakan coba lagi.`);
        }
      } else {
        setErrorJobs("Terjadi kesalahan yang tidak diketahui. Silakan refresh halaman.");
      }
    } finally {
      setLoadingJobs(false);
    }
  };

  // Fetch companies from backend with pagination
  const fetchCompanies = async (page: number = 1): Promise<void> => {
    try {
      setLoadingCompanies(true);
      setErrorCompanies(null);

      const response = await apiBissaKerja.get<ApiResponse<PerusahaanProfile>>(
        `/companies`
      );

      console.log("Fetched Companies:", response.data);

      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data)
      ) {
        const transformedCompanies = transformApiResponseToCompany(response.data.data);
        setCompanies(transformedCompanies);
        setCurrentPage(response.data.pagination?.current_page || 1);
        setLastPage(response.data.pagination?.last_page || 1);
      } else {
        console.warn("Unexpected data format:", response.data);
        setCompanies([]);
      }
    } catch (err) {
      console.error("Error fetching companies:", err);
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 404) {
          setErrorCompanies("Data perusahaan tidak ditemukan.");
        } else if (axiosError.response?.status === 500) {
          setErrorCompanies("Server sedang mengalami gangguan. Silakan coba lagi nanti.");
        } else if (axiosError.response?.status === 401) {
          setErrorCompanies("Sesi Anda telah berakhir. Silakan login kembali.");
        } else if (axiosError.response?.status === 403) {
          setErrorCompanies("Anda tidak memiliki akses untuk melihat data ini.");
        } else if (!axiosError.response) {
          setErrorCompanies("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
        } else {
          setErrorCompanies(`Terjadi kesalahan (Error ${axiosError.response?.status}). Silakan coba lagi.`);
        }
      } else {
        setErrorCompanies("Terjadi kesalahan yang tidak diketahui. Silakan refresh halaman.");
      }
    } finally {
      setLoadingCompanies(false);
    }
  };

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < lastPage) {
      fetchCompanies(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchCompanies(currentPage - 1);
    }
  };

  // Get status badge for company
  const getStatusBadge = (status: string): string => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "active":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case "inactive":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
    }
  };

  // Get status label for company
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "active":
        return "Terverifikasi";
      case "inactive":
        return "Ditolak";
      case "pending":
        return "Belum Verifikasi";
      default:
        return "Tidak Diketahui";
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchCompanies();
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
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 1000);
    return () => clearInterval(interval);
  }, []);

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
                  <p className="text-lg lg:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
                    Platform teknologi terdepan yang menghubungkan talenta terbaik dengan perusahaan progresif. Membangun ekosistem kerja yang inklusif, berkelanjutan, dan mengutamakan kesetaraan.
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
                    <div className="text-2xl font-bold text-white">500+</div>
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
                Pendekatan sistematis dan terstruktur untuk memastikan pengalaman yang optimal dan hasil yang berkelanjutan
              </p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" role="list">
              {[
                {
                  step: "01",
                  icon: <UserPlus className="w-8 h-8" />,
                  title: "Registrasi & Orientasi",
                  description: "Proses registrasi yang komprehensif dengan validasi identitas dan assessment kemampuan",
                },
                {
                  step: "02",
                  icon: <FileText className="w-8 h-8" />,
                  title: "Pengembangan Profil",
                  description: "Pengembangan profil profesional dengan bantuan konsultan karier bersertifikat",
                },
                {
                  step: "03",
                  icon: <Search className="w-8 h-8" />,
                  title: "Pencocokan Cerdas",
                  description: "Sistem AI yang mencocokkan kandidat dengan peluang berdasarkan kompatibilitas holistik",
                },
                {
                  step: "04",
                  icon: <Send className="w-8 h-8" />,
                  title: "Aplikasi & Tindak Lanjut",
                  description: "Proses aplikasi terintegrasi dengan tracking real-time dan support berkelanjutan",
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
                Menyediakan solusi end-to-end untuk menciptakan ekosistem kerja yang berkelanjutan dan inklusif bagi semua kalangan
              </p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" role="list">
              {[
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Penyandang Disabilitas",
                  description: "Solusi komprehensif untuk penyandang disabilitas dalam mengembangkan karier profesional yang berkelanjutan",
                  category: "INDIVIDU",
                },
                {
                  icon: <Building2 className="w-8 h-8" />,
                  title: "Perusahaan",
                  description: "Program kemitraan strategis untuk perusahaan dalam membangun workforce yang beragam dan inklusif",
                  category: "Mitra Perusahaan",
                },
                {
                  icon: <FileText className="w-8 h-8" />,
                  title: "Hubungan Pemerintah",
                  description: "Kolaborasi dengan Disnaker dalam implementasi kebijakan ketenagakerjaan yang progresif",
                  category: "Pemerintah",
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Komnas Disabilitas",
                  description: "Kerjasama dengan Komnas Disabilitas untuk memastikan perlindungan hak dan standar industri",
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
                <>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <JobCardSkeleton key={index} />
                  ))}
                </>
              ) : errorJobs ? (
                <EmptyState onRefresh={fetchJobs} />
              ) : jobs.length > 0 ? (
                jobs.slice(0, 6).map((job) => (
                  <div key={job.id}>
                    <JobCard
                      job={{
                        id: job.id.toString(),
                        title: job.job_title,
                        company: job.perusahaan_profile?.nama_perusahaan ?? "Unknown Company",
                        location: job.location,
                        salary: job.salary_range || "Kompetitif",
                        type: job.job_type,
                        description: job.description,
                        requirements: job.requirements?.split("\n") ?? [],
                        logo: getCompanyLogoUrl(job.perusahaan_profile?.logo, job.perusahaan_profile?.nama_perusahaan),
                        skills: job.skills,
                        accessibility: job.disabilitas.length > 0 ? job.disabilitas.map(d => d.kategori_disabilitas).join(", ") : undefined,
                        deadline: job.application_deadline,
                      }}
                      urlDetail={`/cari-kerja/detail/${job.id}`}
                    />
                  </div>
                ))
              ) : (
                <EmptyState onRefresh={fetchJobs} />
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
                  Perspektif dari para profesional yang telah merasakan dampak transformatif yang luar biasa dari platform kami, memberikan wawasan berharga tentang bagaimana solusi inovatif kami telah mengubah cara mereka menavigasi dunia karier dan mencapai kesuksesan.
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
                  <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  aria-label="Testimoni selanjutnya"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" aria-hidden="true" />
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
              >
                Jaringan Mitra Strategis
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light">
                Kolaborasi dengan organisasi terkemuka yang berbagi visi
              </p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {loadingCompanies ? (
                <>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <CompanyCardSkeleton key={index} />
                  ))}
                </>
              ) : errorCompanies ? (
                <CompanyEmptyState onRefresh={() => fetchCompanies(1)} />
              ) : companies.length > 0 ? (
                companies.map((company) => (
                  <article
                    key={company.id}
                    className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={getCompanyLogoUrl(company.logo, company.companyName)}
                          alt={`Logo ${company.companyName}`}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                          {company.companyName}
                        </h3>
                        <span className={getStatusBadge(company.status)}>
                          {getStatusLabel(company.status)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {company.address}
                      </div>
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        {company.industri}
                      </div>
                    </div>
                    <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                      <button className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-medium text-sm transition-colors duration-300">
                        Lihat Kemitraan →
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <CompanyEmptyState onRefresh={() => fetchCompanies(1)} />
              )}
            </div>
            {lastPage > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                      : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  }`}
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-slate-600 dark:text-slate-400">
                  Halaman {currentPage} dari {lastPage}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === lastPage}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === lastPage
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                      : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  }`}
                  aria-label="Halaman berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
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