"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, Filter, MapPin, Accessibility, Clock, DollarSign, ChevronDown, X, ChevronUp, RefreshCw, FileX } from "lucide-react";
import JobCard from "@/components/company/JobCard";
import apiBissaKerja from "@/lib/api-bissa-kerja";
import axios, { AxiosError } from "axios";

// Interfaces (tidak diubah, hanya disalin untuk referensi)
interface DisabilitasType {
  id: number;
  kategori_disabilitas: string;
  tingkat_disabilitas: string;
  created_at: string;
  updated_at: string;
  pivot: { post_lowongan_id: number; disabilitas_id: number };
}

interface PerusahaanProfile {
  id: number;
  logo: string | null;
  nama_perusahaan: string;
  industri: string;
  tahun_berdiri: string;
  jumlah_karyawan: string;
  province_id: string;
  regencie_id: string;
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

interface ApiResponse {
  success: boolean;
  message: string;
  data: JobVacancy[];
  meta?: { current_page: number; last_page: number; total: number };
}

// Konstanta
const DISABILITY_TYPES = [
  "Ramah untuk tunanetra",
  "Ramah untuk tunarungu",
  "Ramah untuk tunadaksa",
  "Ramah untuk disabilitas intelektual",
  "Ramah untuk disabilitas mental",
  "Ramah untuk semua disabilitas",
];

// Skeleton Component
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
    </section>
    <footer className="pt-4 border-t border-gray-100 dark:border-gray-700">
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 w-full h-10 rounded-lg" />
    </footer>
  </article>
);

// Error State Component
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="text-center max-w-md">
      <FileX className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Terjadi Kesalahan
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
        {error}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Coba Lagi
      </button>
    </div>
  </div>
);

// Empty State Component
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

// Custom Hook untuk Manajemen Jobs
const useJobs = () => {
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchJobs = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiBissaKerja.get<ApiResponse>(`/jobs?page=${pageNum}`);
      if (response.data.success) {
        // Validasi data
        const newJobs = response.data.data.filter(job => job.id && job.job_title && job.perusahaan_profile);
        setJobs(prev => (pageNum === 1 ? newJobs : [...prev, ...newJobs]));
        setHasMore(!!response.data.meta && response.data.meta.current_page < response.data.meta.last_page);
      } else {
        setJobs([]);
        setError(response.data.message || "Gagal mengambil data lowongan.");
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 404) {
          setError("Data lowongan tidak ditemukan.");
        } else if (axiosError.response?.status === 500) {
          setError("Server sedang mengalami gangguan. Silakan coba lagi nanti.");
        } else if (axiosError.response?.status === 401) {
          setError("Sesi Anda telah berakhir. Silakan login kembali.");
        } else if (axiosError.response?.status === 403) {
          setError("Anda tidak memiliki akses untuk melihat data ini.");
        } else if (!axiosError.response) {
          setError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
        } else {
          setError(`Terjadi kesalahan (Error ${axiosError.response?.status}). Silakan coba lagi.`);
        }
      } else {
        setError("Terjadi kesalahan yang tidak diketahui. Silakan refresh halaman.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(page);
  }, [page]);

  return { jobs, loading, error, fetchJobs, page, setPage, hasMore };
};

// Komponen Filter
const JobFilters = ({
  searchTerm,
  setSearchTerm,
  locationFilter,
  setLocationFilter,
  locationInput,
  setLocationInput,
  showLocationDropdown,
  setShowLocationDropdown,
  disabilityFilter,
  setDisabilityFilter,
  typeFilter,
  setTypeFilter,
  sortBy,
  setSortBy,
  uniqueLocations,
  uniqueTypes,
  clearFilters,
}: any) => {
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowLocationDropdown]);


  const filteredLocations = useMemo(
    () => uniqueLocations.filter((loc: string) => loc.toLowerCase().includes(locationInput.toLowerCase())),
    [uniqueLocations, locationInput]
  );

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Location Filter */}
        <div className="relative" ref={locationRef}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MapPin className="h-4 w-4 inline mr-1" />
            Lokasi
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Ketik atau pilih lokasi..."
              value={locationInput}
              onChange={(e) => {
                setLocationInput(e.target.value);
                setLocationFilter(e.target.value);
                setShowLocationDropdown(true);
              }}
              onFocus={() => setShowLocationDropdown(true)}
              className="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              aria-label="Pilih lokasi pekerjaan"
            />
            <button
              type="button"
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="absolute inset-y-0 right-0 flex items-center pr-2"
              aria-label={showLocationDropdown ? "Tutup dropdown lokasi" : "Buka dropdown lokasi"}
            >
              {showLocationDropdown ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          {showLocationDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-auto">
              {filteredLocations.length > 0 ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setLocationFilter("");
                      setLocationInput("");
                      setShowLocationDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-200 dark:border-gray-600"
                    aria-label="Pilih semua lokasi"
                  >
                    Semua Lokasi
                  </button>
                  {filteredLocations.map((location: string) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => {
                        setLocationFilter(location);
                        setLocationInput(location);
                        setShowLocationDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                      aria-label={`Pilih lokasi ${location}`}
                    >
                      {location}
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  Lokasi tidak ditemukan
                </div>
              )}
            </div>
          )}
        </div>

        {/* Disability Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Accessibility className="h-4 w-4 inline mr-1" />
            Jenis Disabilitas
          </label>
          <select
            value={disabilityFilter}
            onChange={(e) => setDisabilityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Pilih jenis disabilitas"
          >
            <option value="">Semua Jenis</option>
            {DISABILITY_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Job Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Clock className="h-4 w-4 inline mr-1" />
            Tipe Pekerjaan
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Pilih tipe pekerjaan"
          >
            <option value="">Semua Tipe</option>
            {uniqueTypes.map((type: string) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <DollarSign className="h-4 w-4 inline mr-1" />
            Urutkan
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Pilih urutan tampilan"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="salary-high">Gaji Tertinggi</option>
            <option value="salary-low">Gaji Terendah</option>
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {(searchTerm || locationFilter || disabilityFilter || typeFilter || sortBy !== "newest") && (
        <div className="flex justify-end">
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            aria-label="Hapus semua filter"
          >
            <X className="h-4 w-4" />
            Hapus Semua Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default function CariPekerjaanPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [disabilityFilter, setDisabilityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const { jobs, loading, error, fetchJobs, page, setPage, hasMore } = useJobs();

  const uniqueLocations = useMemo(() => [...new Set(jobs.map(job => job.location))], [jobs]);
  const uniqueTypes = useMemo(() => [...new Set(jobs.map(job => job.job_type))], [jobs]);

  const filteredJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
      const matchesSearch =
        !searchTerm ||
        job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requirements.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.perusahaan_profile.nama_perusahaan.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesDisability =
        !disabilityFilter || job.disabilitas.some(d => d.kategori_disabilitas.toLowerCase().includes(disabilityFilter.toLowerCase()));
      const matchesType = !typeFilter || job.job_type === typeFilter;

      return matchesSearch && matchesLocation && matchesDisability && matchesType;
    });

    switch (sortBy) {
      case "oldest":
        return filtered.sort((a, b) => new Date(a.application_deadline).getTime() - new Date(b.application_deadline).getTime());
      case "salary-high":
        return filtered.sort((a, b) => {
          const salaryA = parseInt(a.salary_range.replace(/[^\d]/g, "")) || 0;
          const salaryB = parseInt(b.salary_range.replace(/[^\d]/g, "")) || 0;
          return salaryB - salaryA;
        });
      case "salary-low":
        return filtered.sort((a, b) => {
          const salaryA = parseInt(a.salary_range.replace(/[^\d]/g, "")) || 0;
          const salaryB = parseInt(b.salary_range.replace(/[^\d]/g, "")) || 0;
          return salaryA - salaryB;
        });
      case "newest":
      default:
        return filtered.sort((a, b) => new Date(b.application_deadline).getTime() - new Date(a.application_deadline).getTime());
    }
  }, [jobs, searchTerm, locationFilter, disabilityFilter, typeFilter, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setLocationInput("");
    setDisabilityFilter("");
    setTypeFilter("");
    setSortBy("newest");
    setShowLocationDropdown(false);
  };

  const getCompanyLogoUrl = (logo: string | null, companyName: string): string => {
    if (logo && logo.trim()) {
      return `${process.env.NEXT_PUBLIC_BASE_URL}/storage/${logo}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&length=2`;
  };

  return (
    <div className="min-h-screen dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Cari Pekerjaan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Temukan peluang karier yang sesuai dengan keahlian dan kebutuhan Anda
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari berdasarkan posisi, perusahaan, atau keahlian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              aria-label="Cari lowongan pekerjaan"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              aria-label={showFilters ? "Sembunyikan filter" : "Tampilkan filter"}
            >
              <Filter className="h-4 w-4" />
              Filter & Urutkan
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              Menampilkan <span className="font-semibold text-gray-900 dark:text-white">{filteredJobs.length}</span> dari {jobs.length} lowongan
            </div>
          </div>

          {showFilters && (
            <JobFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              locationInput={locationInput}
              setLocationInput={setLocationInput}
              showLocationDropdown={showLocationDropdown}
              setShowLocationDropdown={setShowLocationDropdown}
              disabilityFilter={disabilityFilter}
              setDisabilityFilter={setDisabilityFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              uniqueLocations={uniqueLocations}
              uniqueTypes={uniqueTypes}
              clearFilters={clearFilters}
            />
          )}
        </div>

        {/* Active Filters Display */}
        {(searchTerm || locationFilter || disabilityFilter || typeFilter || sortBy !== "newest") && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} aria-label="Hapus filter pencarian">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {locationFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full">
                  📍 {locationFilter}
                  <button
                    onClick={() => {
                      setLocationFilter("");
                      setLocationInput("");
                    }}
                    aria-label="Hapus filter lokasi"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {disabilityFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded-full">
                  ♿ {disabilityFilter}
                  <button onClick={() => setDisabilityFilter("")} aria-label="Hapus filter disabilitas">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {typeFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-sm rounded-full">
                  ⏰ {typeFilter}
                  <button onClick={() => setTypeFilter("")} aria-label="Hapus filter tipe pekerjaan">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Job Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <ErrorState error={error} onRetry={() => fetchJobs(1)} />
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={{
                  id: job.id.toString(),
                  title: job.job_title,
                  company: job.perusahaan_profile.nama_perusahaan,
                  location: job.location,
                  salary: job.salary_range,
                  type: job.job_type,
                  description: job.description,
                  requirements: job.requirements.split("\n"),
                  logo: getCompanyLogoUrl(job.perusahaan_profile.logo, job.perusahaan_profile.nama_perusahaan),
                  skills: job.skills,
                  accessibility: job.disabilitas.length > 0 ? job.disabilitas.map(d => d.kategori_disabilitas).join(", ") : undefined,
                  deadline: job.application_deadline,
                }}
                urlDetail={`/cari-kerja/detail/${job.id}`}
              />
            ))}
          </div>
        ) : (
          <EmptyState onRefresh={() => fetchJobs(1)} />
        )}

        {/* Pagination */}
        {hasMore && filteredJobs.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setPage(page + 1)}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors text-sm"
              aria-label="Muat lebih banyak lowongan"
            >
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>
    </div>
  );
}