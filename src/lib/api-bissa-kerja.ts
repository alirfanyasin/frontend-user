// lib/axios.ts
import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");
const apiBissaKerja = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BISSA_KERJA_API_URL ||
    "http://31.97.48.147:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
});

// Interceptor: Inject token sebelum setiap request
apiBissaKerja.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiBissaKerja;