import axios from "axios";
// import { cookies } from "next/headers";

// 🔹 Public API (no auth required)
export const api = axios.create({
  baseURL: "https://api.ieltskaro.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🔹 Authenticated API (auto inject token from cookies)
export const apiWithAuth = axios.create({
  baseURL: "https://api.ieltskaro.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor to inject token dynamically
// apiWithAuth.interceptors.request.use(async (config) => {
//   try {
//     // const token = (await cookies()).get("token")?.value;

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   } catch (err) {
//     console.warn("No token found in cookies");
//   }

//   return config;
// });
