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

import { getToken } from "@/dal/auth/getToken"; // Adjust the import path

apiWithAuth.interceptors.request.use(async (config) => {
  console.log("Interceptor: Token fetched or not"); // Confirm token is retrieved

  try {
    // Fetch the token from your authentication service or local storage
    const token = await getToken();
    console.log("Interceptor: Token fetched:", token); // Confirm token is retrieved
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        "Interceptor: Authorization header set to:",
        config.headers.Authorization
      );
    }
  } catch (error) {
    console.error("Interceptor error:", error);
  }
  return config;
});
