'use client'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Search, Filter, MapPin, Accessibility, Clock, DollarSign, ChevronDown, X, ChevronUp } from 'lucide-react'
import JobCard from '@/components/company/JobCard'
import { publicApi } from '@/lib/api-bissa-kerja'

// Interface job dari backend
interface PerusahaanProfile {
  id: number
  nama_perusahaan: string
  logo: string | null
  alamat_lengkap: string
}

interface Job {
  id: number
  job_title: string
  job_type: string
  description: string
  requirements: string
  salary_range: string
  location: string
  application_deadline: string
  experience: string
  perusahaan_profile: PerusahaanProfile
  accessibility_features?: string
  skills: string[]
}

export default function CariPekerjaanPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [locationInput, setLocationInput] = useState('')
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [disabilityFilter, setDisabilityFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  const locationRef = useRef<HTMLDivElement>(null)

  // Function to get full logo URL
  const getFullLogoUrl = (logoPath: string | undefined) => {
    if (!logoPath) return '';
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';
    
    // If it's already a complete URL
    if (logoPath.startsWith('http')) {
      return logoPath;
    }
    
    // If it starts with 'logos/' (from database)
    if (logoPath.startsWith('logos/')) {
      return `${baseUrl}/storage/${logoPath}`;
    }
    
    // For other cases, assume it's a filename
    return `${baseUrl}/storage/logos/${logoPath}`;
  };

  // Fetch jobs dari backend menggunakan publicApi
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Coba endpoint publik terlebih dahulu
        let response;
        try {
          response = await publicApi.get("/public/jobs");
        } catch (publicError) {
          // Fallback ke endpoint yang sudah ada jika endpoint public belum tersedia
          console.warn("Public jobs endpoint not available, falling back to company/job-vacancies");
          response = await publicApi.get("/company/job-vacancies");
        }
        
        if (response.data.success) {
          setJobs(response.data.data || [])
        } else {
          setJobs([])
          setError("Tidak ada data lowongan ditemukan")
        }
      } catch (err) {
        console.error("Error fetch jobs:", err)
        setError("Gagal mengambil data lowongan")
        setJobs([])
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  // Get unique values for filters
  const uniqueLocations = useMemo(() => 
    [...new Set(jobs.map(job => job.location))], [jobs]
  )
  
  const filteredLocations = useMemo(() => 
    uniqueLocations.filter(location => 
      location.toLowerCase().includes(locationInput.toLowerCase())
    ), [uniqueLocations, locationInput]
  )
  
  const uniqueTypes = useMemo(() => 
    [...new Set(jobs.map(job => job.job_type))], [jobs]
  )

  // Jenis disabilitas options
  const disabilityTypes = [
    'Ramah untuk tunanetra',
    'Ramah untuk tunarungu', 
    'Ramah untuk tunadaksa',
    'Ramah untuk disabilitas intelektual',
    'Ramah untuk disabilitas mental',
    'Ramah untuk semua disabilitas'
  ]

  // Close location dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLocationSelect = (location: string) => {
    setLocationFilter(location)
    setLocationInput(location)
    setShowLocationDropdown(false)
  }

  const handleLocationInputChange = (value: string) => {
    setLocationInput(value)
    setLocationFilter(value)
    setShowLocationDropdown(true)
  }

  // Filter and search logic
  const filteredJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
      const matchesSearch = searchTerm === '' || 
        job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requirements.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesLocation = locationFilter === '' || 
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      
      const matchesDisability = disabilityFilter === '' || 
        (job.accessibility_features && job.accessibility_features === disabilityFilter)
      
      const matchesType = typeFilter === '' || job.job_type === typeFilter

      return matchesSearch && matchesLocation && matchesDisability && matchesType
    })

    // Sort logic
    switch (sortBy) {
      case 'oldest':
        return filtered.reverse()
      case 'salary-high':
        return filtered.sort((a, b) => {
          const salaryA = parseInt(a.salary_range.replace(/[^\d]/g, '')) || 0
          const salaryB = parseInt(b.salary_range.replace(/[^\d]/g, '')) || 0
          return salaryB - salaryA
        })
      case 'salary-low':
        return filtered.sort((a, b) => {
          const salaryA = parseInt(a.salary_range.replace(/[^\d]/g, '')) || 0
          const salaryB = parseInt(b.salary_range.replace(/[^\d]/g, '')) || 0
          return salaryA - salaryB
        })
      default:
        return filtered
    }
  }, [jobs, searchTerm, locationFilter, disabilityFilter, typeFilter, sortBy])

  const clearFilters = () => {
    setSearchTerm('')
    setLocationFilter('')
    setLocationInput('')
    setDisabilityFilter('')
    setTypeFilter('')
    setSortBy('newest')
    setShowLocationDropdown(false)
  }

  const hasActiveFilters = searchTerm || locationFilter || disabilityFilter || typeFilter || sortBy !== 'newest'

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
          
          {/* Main Search Bar */}
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
            />
          </div>

          {/* Filter Toggle Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              <Filter className="h-4 w-4" />
              Filter & Urutkan
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Results Count */}
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              Menampilkan <span className="font-semibold text-gray-900 dark:text-white">{filteredJobs.length}</span> dari {jobs.length} lowongan
            </div>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                
                {/* Location Filter with Search */}
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
                      onChange={(e) => handleLocationInputChange(e.target.value)}
                      onFocus={() => setShowLocationDropdown(true)}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                      className="absolute inset-y-0 right-0 flex items-center pr-2"
                    >
                      {showLocationDropdown ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {/* Dropdown Options */}
                  {showLocationDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-auto">
                      {filteredLocations.length > 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleLocationSelect('')}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-200 dark:border-gray-600"
                          >
                            Semua Lokasi
                          </button>
                          {filteredLocations.map((location) => (
                            <button
                              key={location}
                              type="button"
                              onClick={() => handleLocationSelect(location)}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
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
                  >
                    <option value="">Semua Jenis</option>
                    {disabilityTypes.map(type => (
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
                  >
                    <option value="">Semua Tipe</option>
                    {uniqueTypes.map(type => (
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
                  >
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                    <option value="salary-high">Gaji Tertinggi</option>
                    <option value="salary-low">Gaji Terendah</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Hapus Semua Filter
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm('')}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {locationFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full">
                  📍 {locationFilter}
                  <button onClick={() => {
                    setLocationFilter('')
                    setLocationInput('')
                  }}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {disabilityFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded-full">
                  ♿ {disabilityFilter}
                  <button onClick={() => setDisabilityFilter('')}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {typeFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-sm rounded-full">
                  ⏰ {typeFilter}
                  <button onClick={() => setTypeFilter('')}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Job Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full mx-auto mb-4"></div>
            <div className="text-gray-600 dark:text-gray-400">Memuat data lowongan...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 mb-2">⚠️</div>
            <div className="text-red-500">{error}</div>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={{
                  id: job.id,
                  title: job.job_title,
                  company: job.perusahaan_profile.nama_perusahaan,
                  location: job.location,
                  salary: job.salary_range,
                  type: job.job_type,
                  posted: job.application_deadline,
                  description: job.description,
                  requirements: job.requirements.split('\n'),
                  logo: getFullLogoUrl(job.perusahaan_profile.logo) || ''
                }}
                urlDetail={`/cari-kerja/detail/${job.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Tidak ada lowongan ditemukan
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Coba ubah kata kunci pencarian atau filter yang Anda gunakan
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Reset Pencarian
            </button>
          </div>
        )}

        {/* Load More Button (if needed) */}
        {filteredJobs.length > 0 && filteredJobs.length >= 9 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors text-sm">
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>
    </div>
  )
}